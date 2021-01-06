import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { FormBuilder } from '@angular/forms';
import { SnackBarService } from 'libs/shared/material/src';
import { ModalService } from 'libs/shared/material/src/lib/services/modal.service';
import { LazyLoadEvent } from 'primeng/api/public_api';
import { SortEvent } from 'primeng/api/sortevent';
import { MatDialogConfig } from '@angular/material/dialog';
import { GlobalFilterService } from 'apps/admin/src/app/core/theme/src/lib/services/global-filters.service';
import { FeedbackService } from 'libs/admin/shared/src/lib/services/feedback.service';
import { AdminUtilityService } from 'libs/admin/shared/src/lib/services/admin-utility.service';
import { BaseDatatableComponent } from 'libs/admin/shared/src/lib/components/datatable/base-datatable.component';
import { GuestTableService } from '../../services/guest-table.service';
import { GuestTable } from '../../data-models/guest-table.model';
import { DetailsComponent } from '../details/details.component';

@Component({
  selector: 'hospitality-bot-guest-datatable',
  templateUrl: './guest-datatable.component.html',
  styleUrls: [
    '../../../../../shared/src/lib/components/datatable/datatable.component.scss',
    './guest-datatable.component.scss',
  ]
})
export class GuestDatatableComponent  extends BaseDatatableComponent
  implements OnInit, OnDestroy {
  tableName = 'Guest List';
  actionButtons = true;
  isQuickFilters = true;
  isTabFilters = true;
  isResizableColumns = true;
  isAutoLayout = false;
  isCustomSort = true;
  triggerInitialData = false;

  cols = [
    { field: 'guests.primaryGuest.firstName', header: 'Guest/ Company' },
    { field: 'arrivalAndDepartureDate', header: 'Arrival/ Departure' },
    { field: 'booking.bookingNumber', header: 'Booking No./ Feedback' },
    { field: 'amountDueAndTotal', header: 'Amount Due/ Total Spend' },
    { field: 'guestAttributes.transactionUsage', header: 'Transaction Usage' },
    { field: 'guestAttributes.overAllNps', header: 'Overall NPS' },
    { field: 'guestAttributes.churnProbalilty', header: 'Churn Prob/ Prediction' },
    { field: 'stageAndourney', header: 'Stage/ Channels' },
  ];

  chips = [
    { label: 'All', icon: '', value: 'ALL', total: 0, isSelected: true },
    {
      label: 'VIP',
      icon: '',
      value: 'VIP',
      total: 0,
      isSelected: false,
      type: 'pending',
    },
    {
      label: 'High Potential ',
      icon: '',
      value: 'High Potential',
      total: 0,
      isSelected: false,
      type: 'initiated',
    },
    {
      label: 'High Risk ',
      icon: '',
      value: 'High Risk',
      total: 0,
      isSelected: false,
      type: 'completed',
    },
  ];

  tabFilterItems = [
    {
      label: 'Arrival',
      content: '',
      value: 'ARRIVAL',
      disabled: false,
      total: 0,
      chips: this.chips,
    },
    {
      label: 'Inhouse',
      content: '',
      value: 'INHOUSE',
      disabled: false,
      total: 0,
      chips: this.chips,
    },
    {
      label: 'Departure',
      content: '',
      value: 'DEPARTURE',
      disabled: false,
      total: 0,
      chips: this.chips,
    },
    {
      label: 'Out-Guest',
      content: '',
      value: 'OUTGUEST',
      disabled: false,
      total: 0,
      chips: this.chips,
    },
  ];
  tabFilterIdx: number = 0;

  globalQueries = [];
  $subscription = new Subscription();
  constructor(
    public fb: FormBuilder,
    private _guestTableService: GuestTableService,
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

  registerListeners(): void {
    this.listenForGlobalFilters();
  }

  listenForGlobalFilters(): void {
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
          this.values = new GuestTable().deserialize(data).records;
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

    return this._guestTableService.getGuestList(config);
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
          this.values = new GuestTable().deserialize(data).records;

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
    this.loading = false;
    // this.$subscription.add(
    //   this._guestTableService.exportCSV(config).subscribe(
    //     (res) => {
    //       FileSaver.saveAs(
    //         res,
    //         this.tableName.toLowerCase() +
    //           '_export_' +
    //           new Date().getTime() +
    //           '.csv'
    //       );
    //       this.loading = false;
    //     },
    //     ({ error }) => {
    //       this.loading = false;
    //       this._snackbarService.openSnackBarAsText(error.message);
    //     }
    //   )
    // );
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
    detailCompRef.componentInstance.guestId = rowData.guests.primaryGuest.id;
    detailCompRef.componentInstance.data = rowData;
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
