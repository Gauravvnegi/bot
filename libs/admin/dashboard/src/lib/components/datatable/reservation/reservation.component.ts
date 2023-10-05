import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatDialogConfig } from '@angular/material/dialog';
import {
  GlobalFilterService,
  SubscriptionPlanService,
} from '@hospitality-bot/admin/core/theme';
import {
  DetailsComponent,
  Reservation,
  ReservationTable,
} from '@hospitality-bot/admin/reservation';
import {
  AdminUtilityService,
  BaseDatatableComponent,
  FeedbackService,
  ModuleNames,
  sharedConfig,
  TableNames,
  TableService,
} from '@hospitality-bot/admin/shared';
import {
  ModalService,
  SnackBarService,
} from '@hospitality-bot/shared/material';
import * as FileSaver from 'file-saver';
import { Observable, Subscription } from 'rxjs';
import { cols, tableTypes } from '../../../constants/cols';
import { dashboard } from '../../../constants/dashboard';
import { TableValue } from '../../../constants/tabFilterItem';
import { ReservationService } from '../../../services/reservation.service';
import { reservationStatus } from '../../../constants/response';
@Component({
  selector: 'hospitality-bot-reservation-datatable',
  templateUrl: './reservation.component.html',
  styleUrls: [
    '../../../../../../shared/src/lib/components/datatable/datatable.component.scss',
    './reservation.component.scss',
  ],
})
export class ReservationDatatableComponent extends BaseDatatableComponent
  implements OnInit, OnDestroy {
  readonly reservationStatus = reservationStatus;
  @Input() tableName = 'Reservations';
  actionButtons = true;
  isResizableColumns = true;
  isAutoLayout = false;
  isCustomSort = true;
  rowsPerPage = 100;
  triggerInitialData = false;
  cols = cols.reservation;
  selectedTab: TableValue;
  tableTypes = [tableTypes.calendar, tableTypes.table];

  globalQueries = [];
  $subscription = new Subscription();

  constructor(
    public fb: FormBuilder,
    protected _reservationService: ReservationService,
    protected _adminUtilityService: AdminUtilityService,
    protected globalFilterService: GlobalFilterService,
    protected snackbarService: SnackBarService,
    protected _modal: ModalService,
    public feedbackService: FeedbackService,
    protected tabFilterService: TableService,
    protected subscriptionPlanService: SubscriptionPlanService
  ) {
    super(fb, tabFilterService);
  }

  ngOnInit(): void {
    this.registerListeners();
    this.getSubscribedFilters(
      ModuleNames.FRONT_DESK_DASHBOARD,
      TableNames.RESERVATION,
      this.tabFilterItems
    );
  }

  registerListeners(): void {
    this.checkReservationSubscription();
    this.listenForGlobalFilters();
    this.listenGuestDetails();
  }

  checkReservationSubscription() {
    if (
      !this.subscriptionPlanService.checkModuleSubscription(
        ModuleNames.ADD_RESERVATION
      )
    ) {
      this.tableTypes = [tableTypes.table];
      this.tableFG?.addControl('tableType', new FormControl('table'));
      this.tableFG.patchValue({ tableType: 'table' });
    } else {
      this.tableFG?.addControl('tableType', new FormControl('calendar'));
      this.tableFG.patchValue({ tableType: 'calendar' });
    }
  }

  /**
   * @function listenForGlobalFilters To listen for global filters and load data when filter value is changed.
   */
  listenForGlobalFilters(): void {
    this.selectedTab = this._reservationService.selectedTable;
    this.$subscription.add(
      this.globalFilterService.globalFilter$.subscribe((data) => {
        //set-global query everytime global filter changes
        this.globalQueries = [
          ...data['filter'].queryValue,
          ...data['dateRange'].queryValue,
        ];
        //fetch-api for records
        this.loadInitialData([
          ...this.globalQueries,
          {
            order: sharedConfig.defaultOrder,
            entityType: this.selectedTab,
          },
          ...this.getSelectedQuickReplyFilters({ key: 'entityState' }),
        ]);
      })
    );
  }

  listenGuestDetails() {
    // this._reservationService.bookingNumber = this.bookingNumber;
    // this._reservationService.guestId = this.guestId;
    let number = this._reservationService.bookingNumber;
    let id = this._reservationService.guestId;
    if (id && number) {
      this.openDetailPage(undefined, undefined, 'payment_details', {
        id,
        number,
      });
    }
  }

  /**
   * @function loadInitialData To load the initial data for datatable.
   * @param queries The filter list with date and hotel filters.
   * @param loading The loading status.
   * @param props The table props to control data fetching.
   */
  loadInitialData(
    queries = [],
    loading = true,
    props?: { offset: number; limit: number }
  ): void {
    this.loading = loading && true;
    this.$subscription.add(
      this.fetchDataFrom(queries, props).subscribe(
        (data) => {
          this.setRecords(data);
        },
        ({ error }) => {
          this.loading = false;
          this.values = [];
        }
      )
    );
  }

  /**
   * @function fetchDataFrom Returns an observable for the reservation list api call.
   * @param queries The filter list with date and hotel filters.
   * @param defaultProps The default table props to control data fetching.
   * @returns The observable with reservation list.
   */
  fetchDataFrom(
    queries,
    defaultProps = { offset: this.first, limit: this.rowsPerPage }
  ): Observable<any> {
    this.resetRowSelection();
    queries.push(defaultProps);
    const config = {
      queryObj: this._adminUtilityService.makeQueryParams(queries),
    };

    return this._reservationService.getReservationDetails(config);
  }

  setRecords(data): void {
    const modData = new ReservationTable().deserialize(
      data,
      this.globalFilterService.timezone
    );
    this.values = modData.records;
    this.initFilters(
      modData.entityTypeCounts,
      modData.entityStateCounts,
      modData.totalRecord,
      this.reservationStatus
    );
    this.loading = false;
    this.initialLoading = false;
  }

  /**
   * @function loadData To load data for the table after any event.
   * @param event The lazy load event for the table.
   */
  loadData(): void {
    this.getDataTableValue();
  }

  getDataTableValue() {
    this.loading = true;
    this.$subscription.add(
      this.fetchDataFrom(
        [
          ...this.globalQueries,
          {
            order: sharedConfig.defaultOrder,
            entityType: this.selectedTab,
          },
          ...this.getSelectedQuickReplyFilters({ key: 'entityState' }),
        ],
        { offset: this.first, limit: this.rowsPerPage }
      ).subscribe(
        (data) => {
          this.setRecords(data);
        },
        ({ error }) => {
          this.loading = false;
          this.values = [];
        }
      )
    );
  }

  /**
   * @function customSort To sort the rows of the table.
   * @param eventThe The event for sort click action.
   */
  customSort(event): void {
    const col = this.cols.filter((data) => data.field === event.field)[0];
    const field =
      event.field[event.field.length - 1] === ')'
        ? event.field.substring(0, event.field.lastIndexOf('.') || 0)
        : event.field;
    event.data.sort((data1, data2) =>
      this.sortOrder(event, field, data1, data2, col)
    );
  }

  /**
   * @function exportCSV To export CSV report of the table.
   */
  exportCSV(): void {
    this.loading = true;

    const config = {
      queryObj: this._adminUtilityService.makeQueryParams([
        ...this.globalQueries,
        {
          order: sharedConfig.defaultOrder,
          entityType: this.tabFilterItems[this.tabFilterIdx].value,
        },
        ...this.getSelectedQuickReplyFilters({ key: 'entityState' }),
        ...this.selectedRows.map((item) => ({ ids: item.booking.bookingId })),
      ]),
    };
    this.$subscription.add(
      this._reservationService.exportCSV(config).subscribe(
        (res) => {
          FileSaver.saveAs(
            res,
            `${this.tableName.toLowerCase()}_export_${new Date().getTime()}.csv`
          );
          this.loading = false;
        },
        ({ error }) => {
          this.loading = false;
        }
      )
    );
  }

  /**
   * @function openDetailPage To open the detail modal for a reservation.
   * @param event The mouse click event.
   * @param rowData The data of the clicked row.
   * @param tabKey The key of the tab to be opened in detail modal.
   */
  openDetailPage(
    event?: MouseEvent,
    rowData?: Reservation,
    tabKey?: string,
    guestData?
  ): void {
    event?.stopPropagation();
    if (!rowData && !guestData) return;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.width = '100%';
    const detailCompRef = this._modal.openDialog(
      DetailsComponent,
      dialogConfig
    );

    this._reservationService.bookingNumber =
      rowData?.booking?.bookingNumber ?? guestData?.number;
    this._reservationService.guestId =
      rowData?.guests?.primaryGuest?.id ?? guestData?.id;

    detailCompRef.componentInstance.guestId =
      rowData?.guests?.primaryGuest?.id ?? guestData?.id;
    detailCompRef.componentInstance.bookingNumber =
      rowData?.booking?.bookingNumber ?? guestData?.number;
    tabKey && (detailCompRef.componentInstance.tabKey = tabKey);
    this.$subscription.add(
      detailCompRef.componentInstance.onDetailsClose.subscribe((res) => {
        // remove loader for detail close
        if (res) {
          this.loadInitialData(
            [
              ...this.globalQueries,
              {
                order: sharedConfig.defaultOrder,
                entityType: this.tabFilterItems[this.tabFilterIdx].value,
              },
              ...this.getSelectedQuickReplyFilters({ key: 'entityState' }),
            ],
            false,
            {
              offset: this.tempFirst,
              limit: this.tempRowsPerPage
                ? this.tempRowsPerPage
                : this.rowsPerPage,
            }
          );
          this._reservationService.bookingNumber = '';
          this._reservationService.guestId = '';
        }
        detailCompRef.close();
      })
    );
  }

  getStatusStyle(type: string, state: string): string {
    switch (type) {
      case 'INITIATED':
        return `status-${state}-initiated`;
      case 'PENDING':
        return `status-${state}-pending`;
      case 'FAILED':
        return `status-${state}-reject`;
      case 'COMPLETED':
        return `status-${state}-success`;
    }
  }

  getRoomStatus(type: string): string {
    switch (type) {
      case 'CL':
        return 'status-text-success';
      case 'DI':
        return 'status-text-reject';
      case 'IN':
        return 'status-text-initiated';
      case 'PI':
        return 'status-text-pending';
    }
  }

  setTableType(value) {
    this.tableFG.patchValue({ tableType: value });
    // if (value === tableTypes.table.value) {
    //   this.cardComponent.$subscription.unsubscribe();
    //   this.loadInitialData([
    //     ...this.globalQueries,
    //     { order: sharedConfig.defaultOrder },
    //     ...this.getSelectedQuickReplyFilters({ key: 'entityState' }),
    //   ]);
    //   this.getUserPermission(
    //     this.feedbackTypeFilterItem[this.feedbackTypeFilterIdx]?.value
    //   );
    // } else this.selectedRows = [];
  }

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }

  get dashboardConfig() {
    return dashboard;
  }
}
