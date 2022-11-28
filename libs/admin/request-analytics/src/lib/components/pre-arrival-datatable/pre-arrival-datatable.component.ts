import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { GlobalFilterService } from 'apps/admin/src/app/core/theme/src/lib/services/global-filters.service';
import { BaseDatatableComponent } from 'libs/admin/shared/src/lib/components/datatable/base-datatable.component';
import { AdminUtilityService } from 'libs/admin/shared/src/lib/services/admin-utility.service';
import { TableService } from 'libs/admin/shared/src/lib/services/table.service';
import { SnackBarService } from 'libs/shared/material/src';
import { DateService } from '@hospitality-bot/shared/utils';
import { LazyLoadEvent, SortEvent } from 'primeng/api';
import { Subscription, Observable } from 'rxjs';
import { InhouseTable } from '../../models/inhouse-datatable.model';
import { AnalyticsService } from '../../services/analytics.service';
import * as FileSaver from 'file-saver';
import { analytics } from '@hospitality-bot/admin/shared';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'hospitality-bot-pre-arrival-datatable',
  templateUrl: './pre-arrival-datatable.component.html',
  styleUrls: [
    '../../../../../shared/src/lib/components/datatable/datatable.component.scss',
    './pre-arrival-datatable.component.scss',
  ],
})
export class PreArrivalDatatableComponent extends BaseDatatableComponent
  implements OnInit, OnDestroy {
  @Input() entityType = 'Inhouse';
  @Input() optionLabels = [];
  @Input() packageId: string;
  @Output() onModalClose = new EventEmitter();
  globalQueries;
  $subscription = new Subscription();
  tabFilterIdx = 0;
  constructor(
    public fb: FormBuilder,
    private _adminUtilityService: AdminUtilityService,
    private globalFilterService: GlobalFilterService,
    private snackbarService: SnackBarService,
    private analyticsService: AnalyticsService,
    protected tabFilterService: TableService
  ) {
    super(fb, tabFilterService);
  }

  cols = analytics.preArrivalCols;

  tabFilterItems = analytics.PreArrivaltabFilterItems;
  hotelId: string;

  ngOnInit(): void {
    this.registerListeners();
  }

  registerListeners() {
    this.listenForGlobalFilters();
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
        this.hotelId = this.globalFilterService.hotelId;
        //fetch-api for records
        this.loadInitialData([
          ...this.globalQueries,
          {
            order: 'DESC',
            entityType: this.entityType,
            packageId: this.packageId,
          },
          ...this.getSelectedQuickReplyFilters(),
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
          this.snackbarService
            .openSnackBarWithTranslate(
              {
                translateKey: `messages.error.${error?.type}`,
                priorityMessage: error?.message,
              },
              ''
            )
            .subscribe();
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
        type: key,
      })
    );
  }

  getSelectedQuickReplyFilters() {
    return this.tabFilterItems[this.tabFilterIdx].chips
      .filter((item) => item.isSelected === true)
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
            entityType: this.entityType,
            packageId: this.packageId,
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
          this.snackbarService
            .openSnackBarWithTranslate(
              {
                translateKey: `messages.error.${error?.type}`,
                priorityMessage: error?.message,
              },
              ''
            )
            .subscribe();
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
    const field =
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
          packageId: this.packageId,
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
            `${this.tableName.toLowerCase()}_export_${new Date().getTime()}.csv`
          );
          this.loading = false;
        },
        ({ error }) => {
          this.loading = false;
          this.snackbarService
            .openSnackBarWithTranslate(
              {
                translateKey: `messages.error.${error?.type}`,
                priorityMessage: error?.message,
              },
              ''
            )
            .subscribe();
        }
      )
    );
  }

  handleStatusChange(data, event) {
    const requestData = {
      systemDateTime: DateService.currentDate('DD-MMM-YYYY HH:mm:ss'),
      action: event.value,
    };
    this.analyticsService
      .updatePreArrivalRequest(data.id, requestData)
      .subscribe(
        (response) => {
          this.loadInitialData(
            [
              ...this.globalQueries,
              {
                order: 'DESC',
                entityType: this.entityType,
                packageId: this.packageId,
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
          this.snackbarService.openSnackBarWithTranslate(
            {
              translateKey: `messages.SUCCESS.REQUEST_STATUS_UPDATED`,
              priorityMessage: 'Request status updated',
            },
            '',
            { panelClass: 'success' }
          );
        },
        ({ error }) =>
          this.snackbarService
            .openSnackBarWithTranslate(
              {
                translateKey: `messages.error.${error?.type}`,
                priorityMessage: error?.message,
              },
              ''
            )
            .subscribe()
      );
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

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}
