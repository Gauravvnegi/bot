import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { QueryConfig } from '@hospitality-bot/admin/library';
import {
  AdminUtilityService,
  BaseDatatableComponent as BaseDatableComponent,
  ConfigService,
  EntitySubType,
  EntityType,
  Option,
  TableService,
  sharedConfig,
} from '@hospitality-bot/admin/shared';
import {
  ModalService,
  SnackBarService,
} from '@hospitality-bot/shared/material';
import * as FileSaver from 'file-saver';
import { ModalComponent } from 'libs/admin/shared/src/lib/components/modal/modal.component';
import { LazyLoadEvent } from 'primeng/api';
import { Subject, Subscription } from 'rxjs';
import {
  HotelMenuOptions,
  MenuOptions,
  ReservationStatusType,
  ReservationTableValue,
  ReservationType,
  RestaurantMenuOptions,
  hotelCols,
  outletCols,
  reservationStatusDetails,
  title,
} from '../../constants/reservation-table';
import { manageReservationRoutes } from '../../constants/routes';
import {
  BookingConfig,
  ReservationList,
} from '../../models/reservations.model';
import { ManageReservationService } from '../../services/manage-reservation.service';
import { ReservationListResponse } from '../../types/response.type';
import { FormService } from '../../services/form.service';
import { SelectedEntity } from '../../types/reservation.type';

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

  entityId!: string;

  selectedTab: ReservationTableValue = ReservationTableValue.ALL;

  // selectedOutlet: EntitySubType = EntitySubType.ROOM_TYPE;
  // previousOutlet: EntitySubType = EntitySubType.ROOM_TYPE;

  selectedEntity: SelectedEntity;
  previousSelectedEntity: SelectedEntity;

  reservationLists!: ReservationList;

  $subscription = new Subscription();

  globalQueries = [];
  configData: BookingConfig;

  isAllTabFilterRequired: boolean = true;
  isSelectedEntityChanged = false;
  isOutletChanged: boolean = false;

  private destroy$ = new Subject<void>();

  menuOptions: Option[] = MenuOptions;

  constructor(
    public fb: FormBuilder,
    protected tabFilterService: TableService,
    private manageReservationService: ManageReservationService,
    private adminUtilityService: AdminUtilityService,
    private formService: FormService,
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
    this.listenForSelectedEntityChange();
  }

  // initTableDetails = () => {
  //   this.selectedOutlet === EntityTabGroup.HOTEL
  //     ? (this.cols = hotelCols)
  //     : (this.cols = outletCols);
  // };

  getConfigData(): void {
    this.configService
      .getColorAndIconConfig(this.entityId)
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
    this.entityId = this.globalFilterService.entityId;
    this.globalQueries = [];
    this.globalFilterService.globalFilter$.subscribe((data) => {
      // set-global query everytime global filter changes
      this.globalQueries = [...data['dateRange'].queryValue];
      if (!this.isSelectedEntityChanged && this.selectedEntity) {
        this.initTableValue();
      }
    });
  }

  loadData(event: LazyLoadEvent): void {
    this.formService.selectedTab = this.selectedTab;
    if (!this.isSelectedEntityChanged && this.selectedEntity) {
      this.initTableValue();
    }
  }

  listenForSelectedEntityChange() {
    this.formService.selectedEntity.subscribe((res) => {
      this.selectedEntity = res;
      this.selectedEntity.id !== this.previousSelectedEntity?.id
        ? (this.isSelectedEntityChanged = true)
        : (this.isSelectedEntityChanged = false);
      this.previousSelectedEntity = { ...this.selectedEntity };
      if (this.selectedEntity && this.isSelectedEntityChanged) {
        this.initDetails(this.selectedEntity);
        this.initTableValue();
      }
    });
  }

  /**
   * @function initTableValue initializing data into value of table
   */
  initTableValue() {
    this.loading = true;
    this.manageReservationService
      .getReservationItems<ReservationListResponse>(
        this.getQueryConfig(),
        this.selectedEntity.id
      )
      .subscribe(
        (res) => {
          // Process the response and update the data
          this.reservationLists = new ReservationList().deserialize(res);
          if (this.selectedEntity.subType === EntitySubType.ROOM_TYPE) {
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
            this.values = new ReservationList().deserialize(
              res
            ).reservationData;
            this.initFilters(
              this.reservationLists.entityTypeCounts,
              this.reservationLists.entityStateCounts,
              this.reservationLists.total
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

  // listenForOutletChange(value: SelectedEntity) {
  //   this.selectedOutlets = value;
  //   // if (this.selectedOutlet !== this.previousOutlet) {
  //   //   this.resetTableValues();
  //   //   this.loading = true;
  //   //   this.isOutletChanged = true;
  //   // } else {
  //   //   this.isOutletChanged = false;
  //   // }
  //   this.resetTableValues();
  //   this.loading = true;
  //   // this.previousOutlet = this.selectedOutlet;
  //   this.initDetails(this.selectedOutlets);
  // }

  initDetails(selectedEntity: SelectedEntity) {
    if (selectedEntity.subType === EntitySubType.ROOM_TYPE) {
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
      if (selectedEntity.subType === EntitySubType.RESTAURANT) {
        this.menuOptions = RestaurantMenuOptions;
      }
    }
  }

  /**
   * To get query params
   */
  getOutletConfig(): QueryConfig {
    const config = {
      params: this.adminUtilityService.makeQueryParams([
        ...this.globalQueries,
        ...this.getSelectedQuickReplyFilters(),
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
        .updateBookingStatus(reservationData.id, this.entityId, {
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
  editReservation(id: string) {
    this.router.navigate([
      `/pages/efrontdesk/reservation/${manageReservationRoutes.editReservation.route}/${id}`,
    ]);
  }

  /**
   * @function getQueryConfig to configuration
   */
  getQueryConfig(): QueryConfig {
    const config = {
      params: this.adminUtilityService.makeQueryParams([
        ...this.globalQueries,
        ...this.getSelectedQuickReplyFilters({ key: 'entityState' }),
        {
          type:
            this.selectedEntity.subType === EntitySubType.ROOM_TYPE
              ? EntitySubType.ROOM_TYPE
              : EntityType.OUTLET,
          ...(this.selectedEntity.subType !== EntitySubType.ROOM_TYPE && {
            outletType: this.selectedEntity.subType,
          }),
          entityType: this.selectedTab,
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
        break;
      case 'ASSIGN_ROOM':
      case 'ASSIGN_TABLE':
        this.formService.enableAccordion = true;
        this.editReservation(id);
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
        { type: 'ROOM_TYPE', entityId: this.entityId },
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
