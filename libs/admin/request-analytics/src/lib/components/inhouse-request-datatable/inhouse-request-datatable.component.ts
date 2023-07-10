import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { analytics } from '@hospitality-bot/admin/shared';
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
import { inhouseStatus } from '../../constant/datatable';

@Component({
  selector: 'hospitality-bot-inhouse-request-datatable',
  templateUrl: './inhouse-request-datatable.component.html',
  styleUrls: [
    '../../../../../shared/src/lib/components/datatable/datatable.component.scss',
    './inhouse-request-datatable.component.scss',
  ],
})
export class InhouseRequestDatatableComponent extends BaseDatatableComponent
  implements OnInit, OnDestroy {
  isAllTabFilterRequired = true;
  @Input() entityType = 'Inhouse';
  @Input() optionLabels = [];
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
  cols = analytics.cols;
  tabFilterItems = analytics.tabFilterItems;

  entityId: string;

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
        this.entityId = this.globalFilterService.entityId;
        //fetch-api for records
        this.loadInitialData([
          ...this.globalQueries,
          {
            order: 'DESC',
            entityType: this.entityType,
          },
          ...this.getSelectedQuickReplyFiltersV2(),
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
          this.setRecords(data);
        },
        ({ error }) => {
          this.values = [];
          this.loading = false;
        }
      )
    );
  }

  setRecords(data): void {
    const inhouseData = new InhouseTable().deserialize(data);
    this.values = inhouseData.records;
    this.initFilters(
      inhouseData.entityTypeCounts,
      inhouseData.entityStateCounts,
      inhouseData.total,
      inhouseStatus
    );
    this.loading = false;
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
          },
          ...this.getSelectedQuickReplyFiltersV2(),
        ],
        { offset: this.first, limit: this.rowsPerPage }
      ).subscribe(
        (data) => {
          this.setRecords(data);
        },
        ({ error }) => {
          this.values = [];
          this.loading = false;
        }
      )
    );
  }

  updatePaginations(event) {
    this.first = event.first;
    this.rowsPerPage = event.rows;
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
        },
        ...this.getSelectedQuickReplyFiltersV2(),
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
        }
      )
    );
  }

  handleStatusChange(data, event) {
    if (event.value !== 'Closed') return;
    const requestData = {
      jobID: data.jobID,
      roomNo: data.rooms[0].roomNumber,
      lastName: data.guestDetails.primaryGuest.lastName,
    };

    const config = {
      queryObj: this._adminUtilityService.makeQueryParams([
        {
          cmsUserType: 'Bot',
          entityId: this.entityId,
        },
      ]),
    };
    this.analyticsService
      .closeRequest(config, requestData)
      .subscribe((response) => {
        this.loadInitialData(
          [
            ...this.globalQueries,
            {
              order: 'DESC',
              entityType: this.entityType,
            },
            ...this.getSelectedQuickReplyFiltersV2(),
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
      });
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
