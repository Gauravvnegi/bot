import { Component, OnInit, OnDestroy } from '@angular/core';
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
  tableName = 'Reservations';
  actionButtons = true;
  isQuickFilters = true;
  isTabFilters = true;
  isResizableColumns = true;
  isAutoLayout = false;
  isCustomSort = true;
  triggerInitialData = false;

  cols = [
    { field: 'rooms.roomNumber', header: 'Rooms' },
    { field: 'booking.bookingNumber', header: 'Booking No./Feedback' },
    { field: 'guests.primaryGuest.firstName', header: 'Guest/company' },
    { field: 'arrivalAndDepartureDate', header: 'Arrival Date-Departure Date' },
    { field: 'amountDueAndTotal', header: 'Amount Due/Total(INR)' },
    { field: 'package', header: 'Package' },
    { field: 'stageAndourney', header: 'Stage/Journey' },
  ];

  tabFilterItems = [
    {
      label: 'Inhouse',
      content: '',
      value: 'INHOUSE',
      disabled: false,
      total: 0,
      chips: [],
    },
    {
      label: 'Arrival',
      content: '',
      value: 'ARRIVAL',
      disabled: false,
      total: 0,
      chips: [
        { label: 'All', icon: '', value: 'ALL', total: 0, isSelected: true },
        { label: 'New', icon: '', value: 'NEW', total: 0, isSelected: false },
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
    },
  ];
  tabFilterIdx: number = 1;

  globalQueries = [];
  $subscription = new Subscription();
  constructor(
    public fb: FormBuilder,
    private _reservationService: ReservationService,
    private _adminUtilityService: AdminUtilityService,
    private _globalFilterService: GlobalFilterService,
    private _snackbarService: SnackBarService,
    private _modal: ModalService,
    public feedbackService: FeedbackService
  ) {
    super(fb);
  }

  ngOnInit(): void {
    this.registerListeners();
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

  loadInitialData(queries = [], loading = true) {
    this.loading = loading && true;
    this.$subscription.add(
      this.fetchDataFrom(queries).subscribe(
        (data) => {
          this.values = new ReservationTable().deserialize(data).records;
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
      // this.tabFilterItems = this.tabFilterItems.map((tab) => {
      //   return {
      //     ...tab,
      //     chips: tab.chips.map((chip) => {
      //       return {
      //         ...chip,
      //         total: countObj[chip.value],
      //       };
      //     }),
      //   };
      // });
      this.tabFilterItems.forEach((tab) => {
        tab.chips.forEach((chip) => {
          chip.total = countObj[chip.value];
        });
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
          console.log('loadData', this.values);
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
  }

  customSort(event: SortEvent) {
    event.data.sort((data1, data2) => {
      let value1 = data1[event.field];
      let value2 = data2[event.field];
      let result = null;

      if (value1 == null && value2 != null) result = -1;
      else if (value1 != null && value2 == null) result = 1;
      else if (value1 == null && value2 == null) result = 0;
      else if (typeof value1 === 'string' && typeof value2 === 'string') {
        result = value1.localeCompare(value2);
      } else result = value1 < value2 ? -1 : value1 > value2 ? 1 : 0;

      return event.order * result;
    });
  }

  onSelectedTabFilterChange(event) {
    this.tabFilterIdx = event.index;
    this.loadInitialData([
      ...this.globalQueries,
      {
        order: 'DESC',
        entityType: this.tabFilterItems[this.tabFilterIdx].value,
      },
      ...this.getSelectedQuickReplyFilters(),
    ]);
  }

  onFilterTypeTextChange(value, field, matchMode = 'startsWith') {
    this.tempFirst = this.first;
    this.tempRowsPerPage = this.rowsPerPage;

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
    this.tabFilterItems[this.tabFilterIdx].chips[
      quickReplyTypeIdx
    ].isSelected = !this.tabFilterItems[this.tabFilterIdx].chips[
      quickReplyTypeIdx
    ].isSelected;

    this.loadInitialData([
      ...this.globalQueries,
      {
        order: 'DESC',
        entityType: this.tabFilterItems[this.tabFilterIdx].value,
      },
      ...this.getSelectedQuickReplyFilters(),
    ]);
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
          false
        );
        detailCompRef.close();
      })
    );
  }

  ngOnDestroy() {
    this.$subscription.unsubscribe();
  }
}
