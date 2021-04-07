import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalFilterService } from 'apps/admin/src/app/core/theme/src/lib/services/global-filters.service';
import * as FileSaver from 'file-saver';
import { DetailsComponent } from 'libs/admin/reservation/src/lib/components/details/details.component';
import { BaseDatatableComponent } from 'libs/admin/shared/src/lib/components/datatable/base-datatable.component';
import { AdminUtilityService } from 'libs/admin/shared/src/lib/services/admin-utility.service';
import { SnackBarService } from 'libs/shared/material/src';
import { ModalService } from 'libs/shared/material/src/lib/services/modal.service';
import { LazyLoadEvent, SortEvent } from 'primeng/api/public_api';
import { Observable, Subscription } from 'rxjs';
import { RequestTable } from '../../data-models/request-datatable.model';
import { RequestService } from '../../services/request.service';
import { get } from 'lodash';
import { TableService } from 'libs/admin/shared/src/lib/services/table.service';
import {
  FeatureNames,
  TableNames,
} from 'libs/admin/shared/src/lib/constants/subscriptionConfig';

@Component({
  selector: 'hospitality-bot-request-data-table',
  templateUrl: './request-data-table.component.html',
  styleUrls: [
    '../../../../../shared/src/lib/components/datatable/datatable.component.scss',
    './request-data-table.component.scss',
  ],
})
export class RequestDataTableComponent extends BaseDatatableComponent
  implements OnInit, OnDestroy {
  tableName = 'Requests';
  actionButtons = true;
  isQuickFilters = true;
  isTabFilters = true;
  isResizableColumns = true;
  isAutoLayout = false;
  isCustomSort = true;
  triggerInitialData = false;
  tables = TableNames;

  cols = [
    {
      field: 'rooms.roomNumber',
      header: 'Rooms',
      isSort: true,
      sortType: 'number',
    },
    {
      field: 'booking.bookingNumber',
      header: 'Booking No.',
      isSort: true,
      sortType: 'number',
    },
    {
      field: 'guests.primaryGuest.getFullName()',
      header: 'Guest/company',
      isSort: true,
      sortType: 'string',
    },
    {
      field: 'journey',
      header: 'Category/Type',
      isSort: true,
      sortType: 'string',
    },
    { field: 'remarks', header: 'Message', isSort: true, sortType: 'string' },
  ];

  tabFilterItems = [
    {
      label: 'Reservations',
      content: '',
      value: 'RESERVATION',
      disabled: false,
      total: 0,
      chips: [
        { label: 'All', icon: '', value: 'ALL', total: 0, isSelected: true },
        {
          label: 'Early-CheckIn-Request',
          icon: '',
          value: 'EARLYCHECKINPENDING',
          total: 0,
          isSelected: false,
          type: 'pending',
        },
        {
          label: 'Early-CheckIn-Accept',
          icon: '',
          value: 'EARLYCHECKINACCEPT',
          total: 0,
          isSelected: false,
          type: 'completed',
        },
        {
          label: 'Early-CheckIn-Reject',
          icon: '',
          value: 'EARLYCHECKINREJECT',
          total: 0,
          isSelected: false,
          type: 'failed',
        },
        {
          label: 'Late-Checkout-Pending',
          icon: '',
          value: 'LATECHECKOUTPENDING',
          total: 0,
          isSelected: false,
          type: 'pending',
        },
        {
          label: 'Late-Checkout-Accept',
          icon: '',
          value: 'LATECHECKOUTACCEPT',
          total: 0,
          isSelected: false,
          type: 'completed',
        },
        {
          label: 'Late-Checkout-Reject',
          icon: '',
          value: 'LATECHECKOUTREJECT',
          total: 0,
          isSelected: false,
          type: 'failed',
        },

        {
          label: 'Early-Checkout-Pending',
          icon: '',
          value: 'EARLYCHECKOUTPENDING',
          total: 0,
          isSelected: false,
          type: 'pending',
        },
        {
          label: 'Early-Checkout-Accept',
          icon: '',
          value: 'EARLYCHECKOUTACCEPT',
          total: 0,
          isSelected: false,
          type: 'completed',
        },
        {
          label: 'Early-CHeckout-Reject',
          icon: '',
          value: 'EARLYCHECKOUTREJECT',
          total: 0,
          isSelected: false,
          type: 'failed',
        },
      ],
      lastPage: 0,
    },
    {
      label: 'In-House',
      content: '',
      value: 'INHOUSE',
      disabled: false,
      total: 0,
      chips: [
        { label: 'All', icon: '', value: 'ALL', total: 0, isSelected: true },
        {
          label: 'Open-Request',
          icon: '',
          value: 'OPENREQUEST',
          total: 0,
          isSelected: false,
          type: 'pending',
        },
        {
          label: 'Closed-Request',
          icon: '',
          value: 'CLOSEDREQUEST',
          total: 0,
          isSelected: false,
          type: 'completed',
        },
      ],
      lastPage: 0,
    },
  ];
  tabFilterIdx: number = 0;

  globalQueries = [];
  $subscription = new Subscription();

  constructor(
    public fb: FormBuilder,
    private _requestService: RequestService,
    private _adminUtilityService: AdminUtilityService,
    private _globalFilterService: GlobalFilterService,
    private _snackbarService: SnackBarService,
    private _modal: ModalService,
    private router: Router,
    private route: ActivatedRoute,
    protected tabFilterService: TableService
  ) {
    super(fb, tabFilterService);
  }

  ngOnInit(): void {
    this.registerListeners();
    this.getSubscribedFilters(
      FeatureNames.REQUEST,
      TableNames.REQUEST,
      this.tabFilterItems
    );
  }

  registerListeners() {
    this.listenForQueryParams();
  }

  listenForQueryParams() {
    this.$subscription.add(
      this.route.queryParams.subscribe((params) => {
        if (params.filter) {
          this.tabFilterIdx = this.tabFilterItems.findIndex(
            (data) => data.value === params.filter
          );
          if (params.subFilter) {
            this.tabFilterItems[this.tabFilterIdx].chips = this.tabFilterItems[
              this.tabFilterIdx
            ].chips.map((data) => {
              return data.value === params.subFilter
                ? {
                    ...data,
                    isSelected: true,
                  }
                : {
                    ...data,
                    isSelected: false,
                  };
            });
          }
        }
        this.listenForGlobalFilters();
      })
    );
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
        ]);
      })
    );
  }

  loadInitialData(queries = [], loading = true) {
    this.loading = loading && true;
    this.$subscription.add(
      this.fetchDataFrom(queries).subscribe(
        (data) => {
          this.values = new RequestTable().deserialize(data).records;
          //set pagination
          this.totalRecords = data.total;
          this.updateTabFilterCount(data.entityTypeCounts, this.totalRecords);
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

    return this._requestService.getAllRequests(config);
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
          this.values = new RequestTable().deserialize(data).records;
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
    // if(this.tabFilterItems.length){
    //   this.updatePaginationForFilterItems(event.page)
    // }
  }

  updatePaginationForFilterItems(pageEvent) {
    this.tabFilterItems[this.tabFilterIdx].lastPage = pageEvent;
  }

  // customSort(event: SortEvent) {
  //   event.data.sort((data1, data2) => {
  //     let value1 = data1[event.field];
  //     let value2 = data2[event.field];
  //     let result = null;

  //     if (value1 == null && value2 != null) result = -1;
  //     else if (value1 != null && value2 == null) result = 1;
  //     else if (value1 == null && value2 == null) result = 0;
  //     else if (typeof value1 === 'string' && typeof value2 === 'string') {
  //       result = value1.localeCompare(value2);
  //     } else result = value1 < value2 ? -1 : value1 > value2 ? 1 : 0;

  //     return event.order * result;
  //   });
  // }

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
    // value = value && value.trim();
    // this.table.filter(value, field, matchMode);

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
      this._requestService.exportCSV(config).subscribe(
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
    // this.tabFilterItems[this.tabFilterIdx].chips[
    //   quickReplyTypeIdx
    // ].isSelected = !this.tabFilterItems[this.tabFilterIdx].chips[
    //   quickReplyTypeIdx
    // ].isSelected;
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

  openDetailPage(rowData) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.width = '100%';
    const detailCompRef = this._modal.openDialog(
      DetailsComponent,
      dialogConfig
    );

    detailCompRef.componentInstance.bookingId = rowData.booking.bookingId;
    detailCompRef.componentInstance.tabKey = 'request_details';
    this.$subscription.add(
      detailCompRef.componentInstance.onDetailsClose.subscribe((res) => {
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

  updateRequest(event, reservationId, status, journey) {
    event.stopPropagation();

    this._requestService
      .updateRequest(reservationId, {
        journey,
        state: status,
      })
      .subscribe(
        (res) => {
          //update rows
          this.values = this.values.map((row) => {
            if (row.booking.bookingId == reservationId) {
              row.status = 'COMPLETED';
            }
            return row;
          });

          this._snackbarService.openSnackBarAsText(
            'Request updated successfully',
            '',
            {
              panelClass: 'success',
            }
          );
        },
        ({ error }) => {
          this._snackbarService.openSnackBarAsText(error.message);
        }
      );
  }

  openAddRequest() {
    this.router.navigate(['add-request'], {
      relativeTo: this.route,
      queryParams: { hotelId: this.globalQueries[0].hotelId },
    });
  }

  ngOnDestroy() {
    this.$subscription.unsubscribe();
  }
}
