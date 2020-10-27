import { Component, OnInit } from '@angular/core';
import { BaseDatatableComponent } from 'libs/admin/shared/src/lib/components/datatable/base-datatable.component';
import { MatDialogConfig } from '@angular/material/dialog';
import { FormBuilder } from '@angular/forms';
import { AdminUtilityService } from 'libs/admin/shared/src/lib/services/admin-utility.service';
import { GlobalFilterService } from 'apps/admin/src/app/core/theme/src/lib/services/global-filters.service';
import { ModalService } from 'libs/shared/material/src/lib/services/modal.service';
import { SnackBarService } from 'libs/shared/material/src';
import { Observable } from 'rxjs';
import { LazyLoadEvent, SortEvent } from 'primeng/api/public_api';
import * as FileSaver from 'file-saver';
import { RequestService } from '../../services/request.service';
import { DetailsComponent } from 'libs/admin/reservation/src/lib/components/details/details.component';
import { RequestTable } from '../../data-models/request-datatable.model';

@Component({
  selector: 'hospitality-bot-request-data-table',
  templateUrl: './request-data-table.component.html',
  styleUrls: [
    '../../../../../shared/src/lib/components/datatable/datatable.component.scss',
    './request-data-table.component.scss',
  ],
})
export class RequestDataTableComponent extends BaseDatatableComponent
  implements OnInit {
  tableName = 'Requests';
  actionButtons = true;
  isQuickFilters = true;
  isTabFilters = true;
  isResizableColumns = true;
  isAutoLayout = false;
  isCustomSort = true;
  triggerInitialData = false;

  cols = [
    { field: 'rooms.roomNumber', header: 'Rooms' },
    { field: 'booking.bookingNumber', header: 'Booking No.' },
    { field: 'guests.primaryGuest.firstName', header: 'Guest/company' },
    { field: 'arrivalAndDepartureDate', header: 'Category/Type' },
    { field: 'package', header: 'Message' },
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
    },
  ];
  tabFilterIdx: number = 0;

  globalQueries = [];
  constructor(
    public fb: FormBuilder,
    private _requestService: RequestService,
    private _adminUtilityService: AdminUtilityService,
    private _globalFilterService: GlobalFilterService,
    private _snackbarService: SnackBarService,
    private _modal: ModalService
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
    });
  }

  loadInitialData(queries = []) {
    this.loading = true;
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
    defaultProps = { offset: 0, limit: this.rowsPerPage }
  ): Observable<any> {
    queries.push(defaultProps);
    const config = {
      queryObj: this._adminUtilityService.makeQueryParams(queries),
    };

    return this._requestService.getAllRequests(config);
  }

  loadData(event: LazyLoadEvent) {
    this.loading = true;

    this.fetchDataFrom(
      [
        ...this.globalQueries,
        {
          order: 'DESC',
          entityType: this.tabFilterItems[this.tabFilterIdx].value,
        },
        ...this.getSelectedQuickReplyFilters(),
      ],
      { offset: event.first, limit: event.rows }
    ).subscribe(
      (data) => {
        this.values = new RequestTable().deserialize(data).records;

        //set pagination
        this.totalRecords = data.total;
        //check for update tabs and quick reply filters
        this.loading = false;
      },
      ({ error }) => {
        this.loading = false;
        this._snackbarService.openSnackBarAsText(error.message);
      }
    );
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
    this._requestService.exportCSV(config).subscribe(
      (res) => {
        FileSaver.saveAs(
          res,
          'reservation' + '_export_' + new Date().getTime() + '.csv'
        );
        this.loading = false;
      },
      ({ error }) => {
        this.loading = false;
        this._snackbarService.openSnackBarAsText(error.message);
      }
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

  openDetailPage(rowData) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.width = '100%';
    const detailCompRef = this._modal.openDialog(
      DetailsComponent,
      dialogConfig
    );

    detailCompRef.componentInstance.bookingId = rowData.booking.bookingId;
    detailCompRef.componentInstance.tabIndex = 4;

    detailCompRef.componentInstance.onDetailsClose.subscribe((res) => {
      this.loadInitialData([
        ...this.globalQueries,
        {
          order: 'DESC',
          entityType: this.tabFilterItems[this.tabFilterIdx].value,
        },
        ...this.getSelectedQuickReplyFilters(),
      ]);
      detailCompRef.close();
    });
  }
}
