import { Component } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatDialogConfig } from '@angular/material/dialog';
import { NavigationEnd, Router } from '@angular/router';
import {
  GlobalFilterService,
  RoutesConfigService,
  SubscriptionPlanService,
} from '@hospitality-bot/admin/core/theme';
import {
  AdminUtilityService,
  BaseDatatableComponent as BaseDatableComponent,
  BookingDetailService,
  EntitySubType,
  EntityType,
  ModuleNames,
  Option,
  QueryConfig,
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
  ReservationFormData,
  ReservationList,
  RoomReservation,
} from '../../models/reservations.model';
import { ManageReservationService } from '../../services/manage-reservation.service';
import {
  ReservationListResponse,
  RoomReservationResponse,
} from '../../types/response.type';
import { FormService } from '../../services/form.service';
import { SelectedEntity } from '../../types/reservation.type';
import { InvoiceService } from 'libs/admin/invoice/src/lib/services/invoice.service';
import { distinctUntilChanged, takeUntil, tap } from 'rxjs/operators';
import { tableTypes } from 'libs/admin/dashboard/src/lib/constants/cols';
import { Clipboard } from '@angular/cdk/clipboard';

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

  entityId!: string;

  selectedTab: ReservationTableValue = ReservationTableValue.ALL;

  selectedEntity: SelectedEntity;

  reservationLists!: ReservationList;

  $subscription = new Subscription();
  $selectedEntitySubscription = new Subscription();

  globalQueries = [];
  configData: BookingConfig;

  isAllTabFilterRequired: boolean = true;
  isSelectedEntityChanged = false;

  menuOptions: Option[] = MenuOptions;

  tableTypes = [tableTypes.calendar, tableTypes.table];

  selectedTableType: string;
  showCalendarView = false;

  roomReservationList: RoomReservationResponse[] = [];

  private cancelRequests$ = new Subject<void>();

  constructor(
    public fb: FormBuilder,
    private manageReservationService: ManageReservationService,
    private adminUtilityService: AdminUtilityService,
    private formService: FormService,
    private globalFilterService: GlobalFilterService,
    protected snackbarService: SnackBarService,
    private modalService: ModalService,
    private invoiceService: InvoiceService,
    private routesConfigService: RoutesConfigService,
    private router: Router,
    private _clipboard: Clipboard,
    private subscriptionPlanService: SubscriptionPlanService,
    private bookingDetailService: BookingDetailService
  ) {
    super(fb);
  }

  ngOnInit(): void {
    this.tableName = title;
    this.listenForGlobalFilters();
    this.checkReservationSubscription();
    this.listenForSelectedEntityChange();
    this.toggleCalendarView();
  }

  toggleCalendarView() {
    // Turn off full view on route change
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd && this.showCalendarView === true) {
        this.globalFilterService.toggleFullView.next(false);
      }
    });
    this.globalFilterService.toggleFullView.subscribe((res) => {
      this.showCalendarView = res;
    });
  }

  toggleFullView() {
    this.globalFilterService.toggleFullView.next(!this.showCalendarView);
  }

  checkReservationSubscription() {
    this.tableFG?.addControl('tableType', new FormControl(''));

    if (this.subscriptionPlanService.show().isCalenderView) {
      this.setTableType(this.tableTypes[0].value);
    } else {
      this.setTableType(this.tableTypes[1].value);
    }
  }

  setTableType(value: string) {
    this.selectedTableType = value;
    this.tableFG.patchValue({ tableType: value });
  }

  /**
   * @function listenForGlobalFilters To listen for global filters and load data when filter value is changed.
   */
  listenForGlobalFilters(): void {
    this.entityId = this.globalFilterService.entityId;
    let previousDateRange = {};
    this.globalFilterService.globalFilter$.subscribe((data) => {
      this.globalQueries = [...data['dateRange'].queryValue];
      if (
        JSON.stringify(data.dateRange) !== JSON.stringify(previousDateRange)
      ) {
        if (!this.isSelectedEntityChanged && this.selectedEntity) {
          this.initTableValue();
        }
      }
      previousDateRange = { ...data.dateRange };
    });
  }

  loadData(event: LazyLoadEvent): void {
    this.formService.selectedTab = this.selectedTab;
    if (!this.isSelectedEntityChanged && this.selectedEntity) {
      this.initTableValue();
    }
  }

  listenForSelectedEntityChange() {
    this.$selectedEntitySubscription.add(
      this.formService.selectedEntity
        .pipe(
          distinctUntilChanged((prev, curr) => prev?.id === curr?.id), // Compare subType property for changes
          tap((res) => {
            if (res) this.selectedEntity = res;
          })
        )
        .subscribe((res) => {
          if (res) {
            this.cancelRequests$.next();
            this.isSelectedEntityChanged = true; // Since we only get here when selectedEntity has changed
            // this.resetTableValues();
            this.initDetails(this.selectedEntity);
            this.initTableValue();
            if (this.selectedEntity?.subType !== 'ROOM_TYPE') {
              this.selectedTableType = 'table';
              this.tableFG.patchValue({ tableType: 'table' });
            }
          }
        })
    );
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
      .pipe(
        //to cancel api call between using take until
        takeUntil(this.cancelRequests$)
      )
      .subscribe(
        (res) => {
          // Process the response and update the data
          this.reservationLists = new ReservationList().deserialize(res);
          this.roomReservationList = res?.records;
          this.values = this.reservationLists.reservationData;
          // const statusDetails =
          //   this.selectedEntity.type === EntityType.HOTEL
          //     ? reservationStatusDetails
          //     : outletReservationStatusDetails;

          this.initFilters(
            this.reservationLists.entityTypeCounts,
            this.reservationLists.entityStateCounts,
            this.reservationLists.total,
            reservationStatusDetails
          );
        },
        (error) => {
          // Handle error if needed
          this.values = [];
          this.loading = false;
        },
        () => {
          this.loading = false;
          this.isSelectedEntityChanged = false;
        }
      );
  }

  initDetails(selectedEntity: SelectedEntity) {
    this.selectedTab = ReservationTableValue.ALL;
    if (selectedEntity.subType === EntitySubType.ROOM_TYPE) {
      this.cols = hotelCols;
      this.menuOptions = HotelMenuOptions;
    } else {
      this.cols = outletCols;
      this.menuOptions = MenuOptions;
      if (selectedEntity.subType === EntitySubType.RESTAURANT) {
        this.menuOptions = RestaurantMenuOptions;
      }
    }
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
        `Are you Sure?`,
        status === 'CANCELED' && reservationData?.totalPaidAmount
          ? ` A total of \u20B9 ${reservationData?.totalPaidAmount} is received for the reservation`
          : '',
      ],
      isRemarks: status === 'CANCELED',
    };

    togglePopupCompRef.componentInstance.actions = [
      {
        label: status === 'CANCELED' ? 'Cancel & Settlement' : 'Cancel',
        onClick: () => {
          status === 'CANCELED' &&
            this.routesConfigService.navigate({
              subModuleName: ModuleNames.INVOICE,
              additionalPath: reservationData.id,
              queryParams: {
                entityId: this.selectedEntity.id,
                type: this.selectedEntity.subType,
              },
            });

          this.modalService.close();
        },
        variant: 'outlined',
      },
      {
        label: 'Yes',
        onClick: (modelData) => {
          this.changeStatus(status, reservationData, modelData);
          this.modalService.close();
        },
        variant: 'contained',
      },
    ];

    togglePopupCompRef.componentInstance.onClose.subscribe(() => {
      this.modalService.close();
    });
  }

  changeStatus(
    status: ReservationStatusType,
    reservationData,
    additionalData?: any
  ) {
    let bookingType =
      this.selectedEntity.type === EntityType.HOTEL
        ? EntitySubType.ROOM_TYPE
        : EntityType.OUTLET;
    this.loading = true;
    this.$subscription.add(
      this.manageReservationService
        .updateBookingStatus(
          reservationData.id,
          this.selectedEntity.id,
          bookingType,
          {
            reservationType: status,
            remarks: additionalData?.remarks,
          }
        )
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
    this.routesConfigService.navigate({
      additionalPath: `${manageReservationRoutes.editReservation.route}/${id}`,
      queryParams: {
        entityId: this.selectedEntity.id,
      },
    });
  }

  openDetailsPage(reservationId: string) {
    this.bookingDetailService.openBookingDetailSidebar({
      tabKey: 'guest_details',
      bookingId: reservationId,
    });
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

  /**
   * @function handleMenuClick To handle click on menu button.
   */
  handleMenuClick(value: string, rowData: RoomReservation) {
    switch (value) {
      case 'MANAGE_INVOICE':
        this.routesConfigService.navigate({
          subModuleName: ModuleNames.INVOICE,
          additionalPath: rowData.id,
          queryParams: {
            entityId: this.selectedEntity.id,
            type: this.selectedEntity.subType,
          },
        });
        break;
      case 'EDIT_RESERVATION':
        this.editReservation(rowData.id);
        break;
      case 'PRINT_INVOICE':
        this.invoiceService.handleInvoiceDownload(rowData.id);
        break;
      case 'REINSTATE':
        this.handleStatus(ReservationStatusType.REINSTATE, rowData);
        break;
      case 'CLONE_RESERVATION':
        this.cloneReservation(rowData.id);
        break;
      // case 'ASSIGN_ROOM':
      // case 'ASSIGN_TABLE':
      //   this.formService.enableAccordion = true;
      //   this.editReservation(id);
      //   break;
    }
  }

  cloneReservation(reservationId: string) {
    const selectedReservation = this.roomReservationList.find(
      (item) => item.id === reservationId
    );
    const reservation = new ReservationFormData().deserialize(
      selectedReservation
    );
    const guestName =
      reservation.guestInformation?.firstName ||
      reservation.guestInformation?.lastName
        ? reservation.guestInformation?.firstName +
          ' ' +
          (reservation.guestInformation?.lastName ?? '')
        : '';
    reservation.reservationInformation.reservationType = ReservationType.DRAFT;
    let queryParams = {
      entityId: this.entityId,
      data: btoa(
        JSON.stringify({
          ...reservation,
          guestData: {
            label: guestName,
            value: selectedReservation.guest?.id,
          },
        })
      ),
    };

    this.routesConfigService.navigate({
      subModuleName: ModuleNames.ADD_RESERVATION,
      additionalPath: 'add-reservation',
      queryParams,
      openInNewWindow: true,
    });
  }

  createReservation() {
    this.routesConfigService.navigate({
      additionalPath: `${manageReservationRoutes.addReservation.route}`,
      queryParams: {
        entityId: this.selectedEntity.id,
      },
    });
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
        {
          type: EntitySubType.ROOM_TYPE,
          entityId: this.entityId,
          pagination: true,
          limit: this.totalRecords,
        },
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

  copyConfirmationNumber(number: string) {
    this._clipboard.copy(number);
    this.snackbarService.openSnackBarAsText('Booking number copied', '', {
      panelClass: 'success',
    });
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
    this.$selectedEntitySubscription.unsubscribe();
    // this.destroy$.next();
    // this.destroy$.complete();
  }
}
