import { Component, Input, SimpleChanges } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { QueryConfig } from '@hospitality-bot/admin/library';
import {
  AdminUtilityService,
  BaseDatatableComponent as BaseDatableComponent,
  ConfigService,
  Option,
  TableService,
  sharedConfig,
} from '@hospitality-bot/admin/shared';
import {
  ModalService,
  SnackBarService,
} from '@hospitality-bot/shared/material';
import * as FileSaver from 'file-saver';
import { Subject, Subscription } from 'rxjs';
import {
  EntityTabGroup,
  hotelCols,
  HotelMenuOptions,
  MenuOptions,
  outletCols,
  ReservationSearchItem,
  reservationStatusDetails,
  ReservationStatusType,
  ReservationTableValue,
  ReservationType,
  RestaurantMenuOptions,
  title,
} from '../../constants/reservation-table';
import { manageReservationRoutes } from '../../constants/routes';
import {
  BookingConfig,
  ReservationList,
} from '../../models/reservations.model';
import { ManageReservationService } from '../../services/manage-reservation.service';
import { ReservationListResponse } from '../../types/response.type';
import { ModalComponent } from 'libs/admin/shared/src/lib/components/modal/modal.component';
import { MatDialogConfig } from '@angular/material/dialog';
import { LazyLoadEvent } from 'primeng/api';
import { switchMap, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'hospitality-bot-manage-reservation-data-table',
  templateUrl: './manage-reservation-data-table.component.html',
  styleUrls: [
    '../../../../../shared/src/lib/components/datatable/datatable.component.scss',
    './manage-reservation-data-table.component.scss',
  ],
})
export class ManageReservationDataTableComponent extends BaseDatableComponent {
  readonly manageReservationRoutes = manageReservationRoutes;
  readonly reservationStatusDetails = reservationStatusDetails;
  readonly reservationType = ReservationType;
  scrollTargetPoint: number = 150;

  hotelId!: string;
  selectedTab: ReservationTableValue = ReservationTableValue.ALL;
  selectedOutlet: EntityTabGroup = EntityTabGroup.HOTEL;
  previousOutlet: EntityTabGroup = EntityTabGroup.HOTEL;
  reservationLists!: ReservationList;
  $subscription = new Subscription();
  globalQueries = [];
  configData: BookingConfig;
  isAllTabFilterRequired: boolean = true;
  isOutletChanged: boolean = false;
  private destroy$ = new Subject<void>();

  menuOptions: Option[] = MenuOptions;

  constructor(
    public fb: FormBuilder,
    protected tabFilterService: TableService,
    private manageReservationService: ManageReservationService,
    private adminUtilityService: AdminUtilityService,
    private globalFilterService: GlobalFilterService,
    protected snackbarService: SnackBarService,
    private router: Router,
    private configService: ConfigService,
    private modalService: ModalService
  ) {
    super(fb, tabFilterService);
  }

  ngOnInit(): void {
    // this.getConfigData();
    this.tableName = title;
    this.listenForGlobalFilters();
  }

  // initTableDetails = () => {
  //   this.selectedOutlet === EntityTabGroup.HOTEL
  //     ? (this.cols = hotelCols)
  //     : (this.cols = outletCols);
  // };

  getConfigData(): void {
    this.configService
      .getColorAndIconConfig(this.hotelId)
      .subscribe((response) => {
        this.configData = new BookingConfig().deserialize(
          response.bookingConfig
        );

        const data = this.configData.source.map((item) => {
          return {
            ...item,
            content: '',
            disabled: false,
            total: 0,
          };
        });
      });
  }

  /**
   * @function listenForGlobalFilters To listen for global filters and load data when filter value is changed.
   */
  listenForGlobalFilters(): void {
    this.hotelId = this.globalFilterService.hotelId;
    this.globalQueries = [];
    this.globalFilterService.globalFilter$.subscribe((data) => {
      // set-global query everytime global filter changes
      this.globalQueries = [
        ...data['filter'].queryValue,
        ...data['dateRange'].queryValue,
      ];
      this.initTableValue();
    });
  }

  loadData(event: LazyLoadEvent): void {
    this.manageReservationService.selectedTab = this.selectedTab;
    if (!this.isOutletChanged) this.initTableValue();
  }

  listenForOutletChange(value) {
    // this.manageReservationService.getSelectedOutlet().subscribe((value) => {
    this.selectedOutlet = value;
    if (this.selectedOutlet !== this.previousOutlet) {
      this.resetTableValues();
      this.loading = true;
      this.isOutletChanged = true;
    } else {
      this.isOutletChanged = false;
    }

    this.previousOutlet = this.selectedOutlet;
    this.initDetails(this.selectedOutlet);
    // });
  }

  initDetails(selectedOutlet: EntityTabGroup) {
    if (selectedOutlet === EntityTabGroup.HOTEL) {
      this.selectedTab = ReservationTableValue.ALL;
      this.cols = hotelCols;
      this.menuOptions = HotelMenuOptions;
      this.isAllTabFilterRequired = true;
      this.isTabFilters = true;
    } else {
      this.cols = outletCols;
      this.isTabFilters = false;
      this.isAllTabFilterRequired = false;
      this.menuOptions = MenuOptions;
      if (selectedOutlet === EntityTabGroup.RESTAURANT_AND_BAR) {
        this.menuOptions = RestaurantMenuOptions;
      }
    }
  }

  /**
   * @function initTableValue initializing data into value of table
   */
  initTableValue() {
    this.loading = true;
    this.manageReservationService
      .getSelectedOutlet()
      .pipe(
        switchMap((selectedOutlet) => {
          // Store the selected outlet
          this.selectedOutlet = selectedOutlet;
          this.listenForOutletChange(selectedOutlet);
          if (this.selectedOutlet === EntityTabGroup.HOTEL) {
            // API call for hotel data
            return this.manageReservationService.getReservationItems<
              ReservationListResponse
            >(this.getQueryConfig());
          } else {
            // API call for outlet data
            return this.manageReservationService.getReservationList(
              this.hotelId,
              this.getOutletConfig()
            );
          }
        }),
        takeUntil(this.destroy$) // Unsubscribe when the destroy$ subject emits
      )
      .subscribe(
        (res) => {
          // Process the response and update the data
          if (this.selectedOutlet === EntityTabGroup.HOTEL) {
            this.reservationLists = new ReservationList().deserialize(res);
            this.values = this.reservationLists.reservationData.map((item) => {
              return {
                ...item,
                statusValues: this.getStatusValues(item.reservationType),
              };
            });
            this.initFilters(
              this.reservationLists.entityTypeCounts,
              this.reservationLists.entityStateCounts,
              this.reservationLists.total,
              this.reservationStatusDetails
            );
            this.loading = false;
          } else {
            this.values = res.records;
            this.initFilters(
              res.entityTypeCounts,
              res.entityStateCounts,
              res.total
            );
            this.loading = false;
          }
        },
        (error) => {
          // Handle error if needed
          this.values = [];
          this.loading = false;
        }
      );
  }

  /**
   * To get query params
   */
  getOutletConfig(): QueryConfig {
    const config = {
      params: this.adminUtilityService.makeQueryParams([
        ...this.globalQueries,
        ...this.getSelectedQuickReplyFiltersV2(),
        {
          offset: this.first,
          limit: this.rowsPerPage,
        },
      ]),
    };
    return config;
  }

  /**
   * @function getStatusValues To get status value.
   */
  getStatusValues(status) {
    return [
      {
        label: 'Draft',
        value: ReservationStatusType.DRAFT,
        type: 'warning',
        disabled:
          status === ReservationStatusType.CANCELED ||
          status === ReservationStatusType.CONFIRMED,
      },
      {
        label: 'Cancel',
        value: ReservationStatusType.CANCELED,
        type: 'failed',
      },
      {
        label: 'Confirm',
        value: ReservationStatusType.CONFIRMED,
        type: 'new',
        disabled: status === ReservationStatusType.CANCELED,
      },
    ];
  }

  /**
   * @function handleStatus To handle the status change
   * @param status status value
   */
  handleStatus(status: ReservationStatusType, reservationData): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    const togglePopupCompRef = this.modalService.openDialog(
      ModalComponent,
      dialogConfig
    );

    togglePopupCompRef.componentInstance.content = {
      heading: `Mark Reservation As ${
        status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()
      }`,
      description: [
        `You are about to mark this reservation as ${status}`,
        'Are you Sure?',
      ],
    };

    togglePopupCompRef.componentInstance.actions = [
      {
        label: 'No',
        onClick: () => this.modalService.close(),
        variant: 'outlined',
      },
      {
        label: 'Yes',
        onClick: () => {
          this.changeStatus(status, reservationData);
          this.modalService.close();
        },
        variant: 'contained',
      },
    ];

    togglePopupCompRef.componentInstance.onClose.subscribe(() => {
      this.modalService.close();
    });
  }

  changeStatus(status: ReservationStatusType, reservationData) {
    this.loading = true;
    this.$subscription.add(
      this.manageReservationService
        .updateBookingStatus(reservationData.id, this.hotelId, {
          reservationType: status,
        })
        .subscribe(
          (res) => {
            this.values.find(
              (item) => item.id === reservationData.id
            ).reservationType = status;
            this.initTableValue();
            this.snackbarService.openSnackBarAsText(
              'Reservation ' + status + ' changes successfully',
              '',
              { panelClass: 'success' }
            );
          },
          this.handleError,
          this.handleFinal
        )
    );
  }

  /**
   * @function editReservation To navigate to the edit page
   */
  editReservation(id: string, expandAccordion = false) {
    const queryParams = expandAccordion ? { expandAccordion: true } : undefined;
    this.router.navigate(
      [
        `/pages/efrontdesk/manage-reservation/${manageReservationRoutes.editReservation.route}/${id}`,
      ],
      { queryParams }
    );
  }

  /**
   * @function getQueryConfig to configuration
   */
  getQueryConfig(): QueryConfig {
    const config = {
      params: this.adminUtilityService.makeQueryParams([
        ...this.globalQueries,
        ...this.getSelectedQuickReplyFiltersV2({ key: 'entityState' }),
        {
          type: ReservationSearchItem.ROOM_TYPE,
          entityType: this.selectedTab,
          entityId: this.hotelId,
          offset: this.first,
          limit: this.rowsPerPage,
        },
      ]),
    };
    return config;
  }

  handleMenuClick(value: string, id: string) {
    switch (value) {
      case 'MANAGE_INVOICE':
        this.router.navigateByUrl(`pages/efrontdesk/invoice/${id}`);
        break;
      case 'EDIT_RESERVATION':
        this.editReservation(id);
        break;
      case 'PRINT_INVOICE':
        // Handle PRINT_INVOICE case
        break;
      case 'ASSIGN_ROOM':
        this.editReservation(id, true);
        // Handle ASSIGN_ROOM case
        break;
      case 'ASSIGN_TABLE':
        // Handle ASSIGN_TABLE case
        break;
    }
  }

  /**
   * @function exportCSV To export CSV report of the table.
   */
  exportCSV(): void {
    this.loading = true;
    const config: QueryConfig = {
      params: this.adminUtilityService.makeQueryParams([
        ...this.globalQueries,
        {
          order: sharedConfig.defaultOrder,
        },
        ...this.selectedRows.map((item) => ({ ids: item.id })),
        { type: 'ROOM_TYPE', entityId: this.hotelId },
      ]),
    };
    this.$subscription.add(
      this.manageReservationService.exportCSV(config).subscribe(
        (res) => {
          FileSaver.saveAs(
            res,
            `${this.tableName.toLowerCase()}_export_${new Date().getTime()}.csv`
          );
        },
        this.handleError,
        this.handleFinal
      )
    );
  }

  /**
   * @function handleError to show the error
   * @param param network error
   */
  handleError = ({ error }): void => {
    this.loading = false;
  };

  handleFinal = () => {
    this.loading = false;
  };

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
    this.destroy$.next();
    this.destroy$.complete();
  }
}
