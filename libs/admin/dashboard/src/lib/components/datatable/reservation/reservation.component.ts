import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogConfig } from '@angular/material/dialog';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
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
import { LazyLoadEvent, SortEvent } from 'primeng/api/public_api';
import { Observable, Subscription } from 'rxjs';
import { cols } from '../../../constants/cols';
import { dashboard } from '../../../constants/dashboard';
import { tabFilterItems } from '../../../constants/tabFilterItem';
import { ReservationService } from '../../../services/reservation.service';
import {
  EntityState,
  EntityType,
  SelectedEntityState,
} from '../../../types/dashboard.type';
import { ActivatedRoute } from '@angular/router';

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
  @Input() tableName = 'Reservations';
  actionButtons = true;
  isQuickFilters = true;
  isTabFilters = true;
  isResizableColumns = true;
  isAutoLayout = false;
  isCustomSort = true;
  triggerInitialData = false;
  rowsPerPageOptions = [5, 10, 25, 50, 200];
  rowsPerPage = 200;
  cols = cols.reservation;

  @Input() tabFilterItems = tabFilterItems.reservation;
  @Input() tabFilterIdx = 0;

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
    protected tabFilterService: TableService
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
    this.listenForGlobalFilters();
    this.listenInvoiceDetails();
  }

  /**
   * @function listenForGlobalFilters To listen for global filters and load data when filter value is changed.
   */
  listenForGlobalFilters(): void {
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
            entityType: this.tabFilterItems[this.tabFilterIdx].value,
          },
          ...this.getSelectedQuickReplyFilters(),
        ]);
      })
    );
  }

  listenInvoiceDetails() {
    let number = this._reservationService.bookingNumber;
    let id = this._reservationService.guestId;
    console.log('Guest Details - ', number, id);
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
   * @function getSelectedQuickReplyFilters To return the selected chip list
   * @returns The selected chips.
   */
  getSelectedQuickReplyFilters(): SelectedEntityState[] {
    return this.tabFilterItems[this.tabFilterIdx].chips
      .filter((item) => item.isSelected === true)
      .map((item) => ({
        entityState: item.value,
      }));
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
    this.values = new ReservationTable().deserialize(
      data,
      this.globalFilterService.timezone
    ).records;
    this.updateTabFilterCount(data.entityTypeCounts, data.total);
    this.updateQuickReplyFilterCount(data.entityStateCounts);
    this.updateTotalRecords();
    this.loading = false;
    this.initialLoading = false;
  }

  /**
   * @function loadData To load data for the table after any event.
   * @param event The lazy load event for the table.
   */
  loadData(event: LazyLoadEvent): void {
    this.loading = true;
    this.updatePaginations(event);
    this.$subscription.add(
      this.fetchDataFrom(
        [
          ...this.globalQueries,
          {
            order: sharedConfig.defaultOrder,
            entityType: this.tabFilterItems[this.tabFilterIdx].value,
          },
          ...this.getSelectedQuickReplyFilters(),
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
   * @function updatePaginations To update the pagination variable values.
   * @param event The lazy load event for the table.
   */
  updatePaginations(event): void {
    this.first = event.first;
    this.rowsPerPage = event.rows;
    this.tempFirst = this.first;
    this.tempRowsPerPage = this.rowsPerPage;
  }

  /**
   * @function customSort To sort the rows of the table.
   * @param eventThe The event for sort click action.
   */
  customSort(event: SortEvent): void {
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
   * @function onSelectedTabFilterChange To handle the tab filter change.
   * @param event The material tab change event.
   */
  onSelectedTabFilterChange(event: MatTabChangeEvent): void {
    this.tabFilterIdx = event.index;
    this.changePage(+this.tabFilterItems[event.index].lastPage);
  }

  /**
   * @function onFilterTypeTextChange To handle the search for each column of the table.
   * @param value The value of the search field.
   * @param field The name of the field across which filter is done.
   * @param matchMode The mode by which filter is to be done.
   */
  onFilterTypeTextChange(
    value: string,
    field: string,
    matchMode = 'contains'
  ): void {
    if (!!value && !this.isSearchSet) {
      this.tempFirst = this.first;
      this.tempRowsPerPage = this.rowsPerPage;
      this.isSearchSet = true;
    } else if (!!!value) {
      this.isSearchSet = false;
      this.first = this.tempFirst;
      this.rowsPerPage = this.tempRowsPerPage;
    }

    value = value && value.trim();
    this.table.filter(value, field, matchMode);
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
        ...this.getSelectedQuickReplyFilters(),
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
              ...this.getSelectedQuickReplyFilters(),
            ],
            false,
            {
              offset: this.tempFirst,
              limit: this.tempRowsPerPage
                ? this.tempRowsPerPage
                : this.rowsPerPage,
            }
          );
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

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }

  get dashboardConfig() {
    return dashboard;
  }
}
