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
import { ChipType, inhouseStatus } from '../../constant/datatable';
import { RequestService } from 'libs/admin/request/src/lib/services/request.service';
import { convertToTitleCase } from 'libs/admin/shared/src/lib/utils/valueFormatter';
import { RequestStatus } from 'libs/admin/request/src/lib/constants/request';

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
  isAllTabFilterRequired = true;
  @Input() entityType = 'pre-arrival';
  optionLabels = [];
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
    protected tabFilterService: TableService,
    private _requestService: RequestService
  ) {
    super(fb, tabFilterService);
  }

  cols = analytics.preArrivalCols;

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
            packageId: this.packageId,
          },
          ...this.getSelectedQuickReplyFilters({
            key: 'actionType',
          }),
        ]);
      })
    );
  }

  reloadData() {
    this.loadInitialData(
      [
        ...this.globalQueries,
        {
          order: 'DESC',
          entityType: this.entityType,
          packageId: this.packageId,
        },
        ...this.getSelectedQuickReplyFilters({ key: 'actionType' }),
      ],
      false,
      {
        offset: this.tempFirst,
        limit: this.tempRowsPerPage ? this.tempRowsPerPage : this.rowsPerPage,
      }
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
    const preArrivalData = new InhouseTable().deserialize(data);
    this.values = preArrivalData.records;
    if (!this.optionLabels.length) {
      Object.keys(preArrivalData.entityStateCounts).forEach((item) => {
        if (item !== RequestStatus.TIMEOUT)
          this.optionLabels.push({
            label: convertToTitleCase(item),
            value: item,
          });
      });
    }
    this.initFilters(
      preArrivalData.entityTypeCounts,
      preArrivalData.entityStateCounts,
      preArrivalData.total,
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
    debugger;
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
          ...this.getSelectedQuickReplyFilters({
            key: 'actionType',
          }),
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
          packageId: this.packageId,
        },
        ...this.getSelectedQuickReplyFilters({ key: 'actionType' }),
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
    // if (event.value !== 'Closed') return;
    this.loading = true;
    const requestData = {
      jobID: data.id,
      roomNo: data.rooms[0]?.roomNumber,
      lastName: data.guestDetails.primaryGuest.lastName,
      systemDateTime: DateService.currentDate('DD-MMM-YYYY HH:mm:ss'),
    };

    const config = {
      queryObj: this._adminUtilityService.makeQueryParams([
        {
          cmsUserType: 'Admin',
          entityId: this.entityId,
          actionType: event.value,
          entityType: this.entityType,
        },
      ]),
    };
    this._requestService.updateJobRequestStatus(config, requestData).subscribe(
      (response) => {
        this.snackbarService.openSnackBarAsText(
          `Job: ${
            data.jobNo
          } status updated successfully to ${convertToTitleCase(event.value)}.`,
          '',
          { panelClass: 'success' }
        );

        this.reloadData();
      },
      (err) => {
        this.reloadData();
      }
    );
  }

  onFilterTypeTextChange(value, field, matchMode = 'startsWith') {
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
