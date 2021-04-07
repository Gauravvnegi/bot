import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { GlobalFilterService } from 'apps/admin/src/app/core/theme/src/lib/services/global-filters.service';
import * as FileSaver from 'file-saver';
import { BaseDatatableComponent } from 'libs/admin/shared/src/lib/components/datatable/base-datatable.component';
import { AdminUtilityService } from 'libs/admin/shared/src/lib/services/admin-utility.service';
import { LazyLoadEvent, SortEvent } from 'primeng/api/public_api';
import { Observable, Subscription } from 'rxjs';
import { ReservationTable } from '../../data-models/reservation-table.model';
import { ReservationService } from '../../services/reservation.service';
import { SnackBarService } from 'libs/shared/material/src';
import { MatDialogConfig } from '@angular/material/dialog';
import { ModalService } from 'libs/shared/material/src/lib/services/modal.service';
import { DetailsComponent } from 'libs/admin/reservation/src/lib/components/details/details.component';
import { FeedbackService } from 'libs/admin/shared/src/lib/services/feedback.service';
import { TableService } from 'libs/admin/shared/src/lib/services/table.service';

@Component({
  selector: 'hospitality-bot-reservation-datatable',
  templateUrl: './reservation-datatable.component.html',
  styleUrls: [
    '../../../../../shared/src/lib/components/datatable/datatable.component.scss',
    './reservation-datatable.component.scss',
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

  cols = [
    {
      field: 'rooms.roomNumber',
      header: 'Rooms',
      isSort: true,
      sortType: 'number',
    },
    {
      field: 'booking.bookingNumber',
      header: 'Booking No./Feedback',
      isSort: true,
      sortType: 'number',
    },
    {
      field: `guests.primaryGuest.getFullName()`,
      header: 'Guest/company',
      isSort: true,
      sortType: 'string',
    },
    {
      field: 'booking.getArrivalTimeStamp()',
      header: 'Arrival/ Departure',
      isSort: true,
      sortType: 'date',
    },
    {
      field: 'payment.totalAmount',
      header: 'Amount Due/Total(INR)',
      isSort: true,
      sortType: 'number',
    },
    { field: 'package', header: 'Package', isSort: false, sortType: 'number' },
    {
      field: 'stageAndourney',
      header: 'Stage/Journey',
      isSort: false,
      sortType: 'number',
    },
  ];

  @Input() tabFilterItems = [
    {
      label: 'Inhouse',
      content: '',
      value: 'INHOUSE',
      disabled: false,
      total: 0,
      chips: [],
      lastPage: 0,
    },
    {
      label: 'Arrival',
      content: '',
      value: 'ARRIVAL',
      disabled: false,
      total: 0,
      chips: [
        { label: 'All', icon: '', value: 'ALL', total: 0, isSelected: true },
        {
          label: 'New',
          icon: '',
          value: 'NEW',
          total: 0,
          isSelected: false,
          type: 'new',
        },
        {
          label: 'Precheckin_Pending ',
          icon: '',
          value: 'PRECHECKINPENDING',
          total: 0,
          isSelected: false,
          type: 'pending',
        },
        {
          label: 'Precheckin_Initiated ',
          icon: '',
          value: 'PRECHECKININITIATED',
          total: 0,
          isSelected: false,
          type: 'initiated',
        },
        {
          label: 'Precheckin_Complete ',
          icon: '',
          value: 'PRECHECKINCOMPLETE',
          total: 0,
          isSelected: false,
          type: 'completed',
        },
        {
          label: 'Precheckin_Failed',
          icon: '',
          value: 'PRECHECKINFAILED',
          total: 0,
          isSelected: false,
          type: 'failed',
        },
        {
          label: 'CheckIn_Pending',
          icon: '',
          value: 'CHECKINPENDING',
          total: 0,
          isSelected: false,
          type: 'pending',
        },
        {
          label: 'CheckIn_Initiated',
          icon: '',
          value: 'CHECKININITIATED',
          total: 0,
          isSelected: false,
          type: 'initiated',
        },
        {
          label: 'CheckIn_Complete',
          icon: '',
          value: 'CHECKINCOMPLETE',
          total: 0,
          isSelected: false,
          type: 'completed',
        },
        {
          label: 'CheckIn_Failed',
          icon: '',
          value: 'CHECKINFAILED',
          total: 0,
          isSelected: false,
          type: 'failed',
        },
      ],
      lastPage: 0,
    },
    {
      label: 'Departure',
      content: '',
      value: 'DEPARTURE',
      disabled: false,
      total: 0,
      chips: [
        { label: 'All', icon: '', value: 'ALL', total: 0, isSelected: true },
        {
          label: 'Checkout_Pending',
          icon: '',
          value: 'CHECKOUTPENDING',
          total: 0,
          isSelected: false,
          type: 'pending',
        },
        {
          label: 'Checkout_Initiated',
          icon: '',
          value: 'CHECKOUTINITIATED',
          total: 0,
          isSelected: false,
          type: 'initiated',
        },
        {
          label: 'CheckOut_Completed',
          icon: '',
          value: 'CHECKOUTCOMPLETED',
          total: 0,
          isSelected: false,
          type: 'completed',
        },
        {
          label: 'Checkout_Failed',
          icon: '',
          value: 'CHECKOUTFAILED',
          total: 0,
          isSelected: false,
          type: 'failed',
        },
      ],
      lastPage: 0,
    },
  ];
  @Input() tabFilterIdx: number = 1;

  globalQueries = [];
  $subscription = new Subscription();
  constructor(
    public fb: FormBuilder,
    protected _reservationService: ReservationService,
    protected _adminUtilityService: AdminUtilityService,
    protected _globalFilterService: GlobalFilterService,
    protected _snackbarService: SnackBarService,
    protected _modal: ModalService,
    public feedbackService: FeedbackService,
    protected tabFilterService: TableService
  ) {
    super(fb, tabFilterService);
  }

  ngOnInit(): void {
    this.registerListeners();
    this.getSubscribedFilters('dashboard', 'Reservations', this.tabFilterItems);
  }

  registerListeners() {
    this.listenForGlobalFilters();
  }

  listenForGlobalFilters() {
    this.$subscription.add(
      this._globalFilterService.globalFilter$.subscribe((data) => {
        //set-global query everytime global filter changes
        this.globalQueries = [
          ...data['filter'].queryValue,
          ...data['dateRange'].queryValue,
        ];
        //fetch-api for records
        this.loadInitialData([
          ...this.globalQueries,
          {
            order: 'DESC',
            entityType: this.tabFilterItems[this.tabFilterIdx].value,
          },
          ...this.getSelectedQuickReplyFilters(),
          // { offset: this.first, limit: this.rowsPerPage },
        ]);
      })
    );
  }

  loadInitialData(
    queries = [],
    loading = true,
    props?: { offset: number; limit: number }
  ) {
    this.loading = loading && true;
    this.$subscription.add(
      this.fetchDataFrom(queries, props).subscribe(
        (data) => {
          this.values = new ReservationTable().deserialize(data).records;
          this.initialLoading = false;
          //set pagination
          this.totalRecords = data.total;
          data.entityTypeCounts &&
            this.updateTabFilterCount(data.entityTypeCounts, this.totalRecords);
          data.entityStateCounts &&
            this.updateQuickReplyFilterCount(data.entityStateCounts);

          this.loading = false;
        },
        ({ error }) => {
          this.loading = false;
          this._snackbarService.openSnackBarAsText(error.message);
        }
      )
    );
  }

  getSelectedQuickReplyFilters() {
    return this.tabFilterItems[this.tabFilterIdx].chips
      .filter((item) => item.isSelected == true)
      .map((item) => ({
        entityState: item.value,
      }));
  }

  updateTabFilterCount(countObj, currentTabCount) {
    if (countObj) {
      this.tabFilterItems.forEach((tab) => {
        tab.total = countObj[tab.value];
      });
    } else {
      this.tabFilterItems[this.tabFilterIdx].total = currentTabCount;
    }
  }

  updateQuickReplyFilterCount(countObj) {
    if (countObj) {
      this.tabFilterItems[this.tabFilterIdx].chips.forEach((chip) => {
        chip.total = countObj[chip.value];
      });
    }
  }

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

  loadData(event: LazyLoadEvent) {
    this.loading = true;
    this.updatePaginations(event);
    this.$subscription.add(
      this.fetchDataFrom(
        [
          ...this.globalQueries,
          {
            order: 'DESC',
            entityType: this.tabFilterItems[this.tabFilterIdx].value,
          },
          ...this.getSelectedQuickReplyFilters(),
        ],
        { offset: this.first, limit: this.rowsPerPage }
      ).subscribe(
        (data) => {
          this.values = new ReservationTable().deserialize(data).records;
          data.entityStateCounts &&
            this.updateQuickReplyFilterCount(data.entityStateCounts);
          //set pagination
          this.totalRecords = data.total;
          //check for update tabs and quick reply filters
          this.loading = false;
        },
        ({ error }) => {
          this.loading = false;
          this._snackbarService.openSnackBarAsText(error.message);
        }
      )
    );
  }

  updatePaginations(event) {
    this.first = event.first;
    this.rowsPerPage = event.rows;
    this.tempFirst = this.first;
    this.tempRowsPerPage = this.rowsPerPage;

    // if(this.tabFilterItems.length){
    //   this.updatePaginationForFilterItems(event.page)
    // }
  }

  updatePaginationForFilterItems(pageEvent) {
    this.tabFilterItems[this.tabFilterIdx].lastPage = pageEvent;
  }

  customSort(event: SortEvent) {
    const col = this.cols.filter((data) => data.field === event.field)[0];
    let field =
      event.field[event.field.length - 1] === ')'
        ? event.field.substring(0, event.field.lastIndexOf('.') || 0)
        : event.field;
    event.data.sort((data1, data2) =>
      this.sortOrder(event, field, data1, data2, col)
    );
  }

  onSelectedTabFilterChange(event) {
    this.tabFilterIdx = event.index;
    this.changePage(+this.tabFilterItems[event.index].lastPage);
  }

  onFilterTypeTextChange(value, field, matchMode = 'startsWith') {
    // this.tempFirst = this.first;
    // this.tempRowsPerPage = this.rowsPerPage;

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

  exportCSV() {
    this.loading = true;

    const config = {
      queryObj: this._adminUtilityService.makeQueryParams([
        ...this.globalQueries,
        {
          order: 'DESC',
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
            this.tableName.toLowerCase() +
              '_export_' +
              new Date().getTime() +
              '.csv'
          );
          this.loading = false;
        },
        ({ error }) => {
          this.loading = false;
          this._snackbarService.openSnackBarAsText(error.message);
        }
      )
    );
  }

  toggleQuickReplyFilter(quickReplyTypeIdx, quickReplyType) {
    //toggle isSelected
    if (quickReplyTypeIdx == 0) {
      this.tabFilterItems[this.tabFilterIdx].chips.forEach((chip) => {
        if (chip.value !== 'ALL') {
          chip.isSelected = false;
        }
      });
      this.tabFilterItems[this.tabFilterIdx].chips[
        quickReplyTypeIdx
      ].isSelected = !this.tabFilterItems[this.tabFilterIdx].chips[
        quickReplyTypeIdx
      ].isSelected;
    } else {
      this.tabFilterItems[this.tabFilterIdx].chips[0].isSelected = false;
      this.tabFilterItems[this.tabFilterIdx].chips[
        quickReplyTypeIdx
      ].isSelected = !this.tabFilterItems[this.tabFilterIdx].chips[
        quickReplyTypeIdx
      ].isSelected;
    }

    this.changePage(0);
  }

  openDetailPage(event, rowData, tabKey?) {
    event.stopPropagation();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.width = '100%';
    const detailCompRef = this._modal.openDialog(
      DetailsComponent,
      dialogConfig
    );

    detailCompRef.componentInstance.bookingId = rowData.booking.bookingId;
    tabKey && (detailCompRef.componentInstance.tabKey = tabKey);

    this.$subscription.add(
      detailCompRef.componentInstance.onDetailsClose.subscribe((res) => {
        // remove loader for detail close
        this.loadInitialData(
          [
            ...this.globalQueries,
            {
              order: 'DESC',
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
        detailCompRef.close();
      })
    );
  }

  ngOnDestroy() {
    this.$subscription.unsubscribe();
  }
}
