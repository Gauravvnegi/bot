import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { GlobalFilterService } from 'apps/admin/src/app/core/theme/src/lib/services/global-filters.service';
import * as FileSaver from 'file-saver';
import { BaseDatatableComponent } from 'libs/admin/shared/src/lib/components/datatable/base-datatable.component';
import { AdminUtilityService } from 'libs/admin/shared/src/lib/services/admin-utility.service';
import { TableService } from 'libs/admin/shared/src/lib/services/table.service';
import { SnackBarService } from 'libs/shared/material/src';
import { LazyLoadEvent, SortEvent } from 'primeng/api';
import { Observable, Subscription } from 'rxjs';
import { InhouseTable } from '../../models/inhouse-datatable.model';
import { AnalyticsService } from '../../services/analytics.service';

@Component({
  selector: 'hospitality-bot-inhouse-request-datatable',
  templateUrl: './inhouse-request-datatable.component.html',
  styleUrls: [
    '../../../../../shared/src/lib/components/datatable/datatable.component.scss',
    './inhouse-request-datatable.component.scss',
  ],
})
export class InhouseRequestDatatableComponent extends BaseDatatableComponent
  implements OnInit {
  @Input() entityType = 'Inhouse';
  @Output() onModalClose = new EventEmitter();
  globalQueries;
  $subscription = new Subscription();
  tabFilterIdx = 0;
  constructor(
    public fb: FormBuilder,
    private _adminUtilityService: AdminUtilityService,
    private _globalFilterService: GlobalFilterService,
    private _snackbarService: SnackBarService,
    private analyticsService: AnalyticsService,
    protected tabFilterService: TableService
  ) {
    super(fb, tabFilterService);
  }

  cols = [
    {
      field: 'rooms.roomNumber',
      header: 'Item & Priority Code / Qty',
      isSort: false,
      sortType: 'number',
    },
    {
      field: 'booking.bookingNumber',
      header: 'Booking No. / Rooms',
      isSort: false,
      sortType: 'number',
    },
    {
      field: 'guests.primaryGuest.getFullName()',
      header: 'Guest/ company',
      isSort: false,
      sortType: 'string',
    },
    {
      field: 'journey',
      header: 'Phone No./ Email',
      isSort: false,
      sortType: 'string',
    },
    {
      field: 'journey',
      header: 'Item Name/ Desc./ Status/ Job Duration',
      isSort: false,
      sortType: 'string',
    },
    {
      field: 'remarks',
      header: 'Assigned To/ Op & CI - Dt & Tm',
      isSort: false,
      sortType: 'string',
    },
    {
      field: '',
      header: 'Actions',
      isSort: false,
      sortType: '',
    },
  ];

  tabFilterItems = [
    {
      label: 'All',
      content: '',
      value: '',
      disabled: false,
      total: 0,
      chips: [
        {
          label: 'All',
          icon: '',
          value: 'ALL',
          total: 0,
          isSelected: true,
          type: '',
        },
      ],
    },
  ];

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
            entityType: 'Inhouse',
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
          this.values = new InhouseTable().deserialize(data).records;
          //set pagination
          this.totalRecords = data.total;
          this.updateTabFilterCount(data.entityTypeCounts, this.totalRecords);
          if (this.tabFilterItems[this.tabFilterIdx].chips.length === 1)
            this.addQuickReplyFilter(data.entityStateCounts, this.totalRecords);
          else this.updateQuickReplyFilterCount(data.entityStateCounts);
          this.loading = false;
        },
        ({ error }) => {
          this.loading = false;
          this._snackbarService.openSnackBarAsText(error.message);
        }
      )
    );
  }

  addQuickReplyFilter(entityStateCounts, total) {
    this.tabFilterItems[this.tabFilterIdx].chips[0].total = total;
    Object.keys(entityStateCounts).forEach((key) =>
      this.tabFilterItems[this.tabFilterIdx].chips.push({
        label: key,
        icon: '',
        value: key,
        total: entityStateCounts[key],
        isSelected: false,
        type: 'pending',
      })
    );
  }

  getSelectedQuickReplyFilters() {
    return this.tabFilterItems[this.tabFilterIdx].chips
      .filter((item) => item.isSelected == true)
      .map((item) => ({
        actionType: item.value,
      }));
  }

  updateTabFilterCount(countObj, currentTabCount) {
    if (countObj) {
      this.tabFilterItems.forEach((tab) => (tab.total = countObj[tab.value]));
    } else {
      this.tabFilterItems[this.tabFilterIdx].total = currentTabCount;
    }
  }

  updateQuickReplyFilterCount(countObj) {
    if (countObj) {
      this.tabFilterItems[this.tabFilterIdx].chips.forEach(
        (chip) => (chip.total = countObj[chip.value])
      );
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

    return this.analyticsService.getInhouseRequest(config);
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
            entityType: 'Inhouse',
          },
          ...this.getSelectedQuickReplyFilters(),
        ],
        { offset: this.first, limit: this.rowsPerPage }
      ).subscribe(
        (data) => {
          this.values = new InhouseTable().deserialize(data).records;
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
  }

  toggleQuickReplyFilter(quickReplyTypeIdx, quickReplyType) {
    if (quickReplyTypeIdx === 0) {
      this.tabFilterItems[this.tabFilterIdx].chips.forEach((chip) => {
        if (chip.value !== 'ALL') chip.isSelected = false;
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

  closeModal() {
    this.onModalClose.emit(true);
  }

  exportCSV() {
    this.loading = true;
    const config = {
      queryObj: this._adminUtilityService.makeQueryParams([
        ...this.globalQueries,
        {
          order: 'DESC',
          entityType: this.entityType,
        },
        ...this.getSelectedQuickReplyFilters(),
        ...this.selectedRows.map((item) => ({ ids: item.id })),
      ]),
    };
    this.$subscription.add(
      this.analyticsService.exportInhouseRequestCSV(config).subscribe(
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
}