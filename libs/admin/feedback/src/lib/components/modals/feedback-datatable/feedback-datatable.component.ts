import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import {
  AdminUtilityService,
  FeedbackService,
  HotelDetailService,
  sharedConfig,
  StatisticsService,
  TableService,
} from '@hospitality-bot/admin/shared';
import {
  ModalService,
  SnackBarService,
} from '@hospitality-bot/shared/material';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import {
  FeedbackTable,
  StayFeedbackTable,
} from '../../../data-models/feedback-datatable.model';
import { FeedbackTableService } from '../../../services/table.service';
import { FeedbackDatatableComponent } from '../../datatable/feedback-datatable/feedback-datatable.component';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'hospitality-bot-feedback-datatable-modal',
  templateUrl: './feedback-datatable.component.html',
  styleUrls: [
    '../../../../../../shared/src/lib/components/datatable/datatable.component.scss',
    '../../datatable/feedback-datatable/feedback-datatable.component.scss',
    './feedback-datatable.component.scss',
  ],
})
export class FeedbackDatatableModalComponent extends FeedbackDatatableComponent
  implements OnInit, OnDestroy {
  @Input() config;
  @Input() feedbackType;
  @Input() tabFilterItems: any;
  @Output() onModalClose = new EventEmitter();
  constructor(
    public fb: FormBuilder,
    _adminUtilityService: AdminUtilityService,
    _globalFilterService: GlobalFilterService,
    _snackbarService: SnackBarService,
    _modal: ModalService,
    public feedbackService: FeedbackService,
    tabFilterService: TableService,
    tableService: FeedbackTableService,
    statisticService: StatisticsService,
    _hotelDetailService: HotelDetailService,
    _translateService: TranslateService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    super(
      fb,
      _adminUtilityService,
      _globalFilterService,
      _snackbarService,
      _modal,
      feedbackService,
      tabFilterService,
      tableService,
      statisticService,
      _hotelDetailService,
      _translateService
    );
  }

  ngOnInit(): void {
    this.initData();
    this.setTabFilters(this.feedbackType);
    this.registerListeners();
    this.documentActionTypes.push({
      label: `Export Summary`,
      value: 'summary',
      type: '',
      defaultLabel: 'Export Summary',
    });
  }

  initData() {
    this.tableName = this.data.tableName;
    this.tabFilterItems = this.data.tabFilterItems;
    this.tabFilterIdx = this.data.tabFilterIdx;
    this.globalFeedbackFilterType = this.data.globalFeedbackFilterType;
    this.config = this.data.config;
    this.feedbackType = this.data.feedbackType;
    this.rowsPerPage = 5;
  }

  /**
   * @function setTabFilters To set tab filters based on feedback type  .
   * @param feedbackType The current feedback type.
   */
  setTabFilters(feedbackType): void {
    this.tabFilterItems = this.data.tabFilterItems;
    this.setTableCols();
  }

  /**
   * @function setTableCols To set table columns header
   */
  setTableCols(): void {
    this.cols =
      this.feedbackType === this.globalFeedbackConfig.types.stay
        ? this.globalFeedbackConfig.cols.feedbackDatatable.stay
        : this.globalFeedbackConfig.cols.feedbackDatatable.transactional;
  }

  /**
   * @function closeModal Emits the close click event for the modal
   */
  closeModal(): void {
    this.onModalClose.emit(true);
  }

  /**
   * @function listenForGlobalFilters To listen for filter data change.
   */
  listenForGlobalFilters(): void {
    this.$subscription.add(
      this._globalFilterService.globalFilter$.subscribe((data) => {
        this.globalQueries = [
          ...data['filter'].queryValue,
          ...data['dateRange'].queryValue,
          ...this.config,
        ];
        this.getHotelId(this.globalQueries);
        this.getOutlets(data['filter'].value.property.branchName);
        //fetch-api for records
        this.loadInitialData([
          ...this.globalQueries,
          { order: sharedConfig.defaultOrder },
          ...this.getSelectedQuickReplyFilters(),
        ]);
      })
    );
  }

  /**
   * @function fetchDataFrom To fetch api data.
   * @param queries The filter data.
   * @param defaultProps The default page data.
   * @returns The observable with stream of feedback data.
   */
  fetchDataFrom(
    queries,
    defaultProps = { offset: this.first, limit: this.rowsPerPage }
  ): Observable<any> {
    this.resetRowSelection();
    queries.push(defaultProps);
    const config = {
      queryObj: this._adminUtilityService.makeQueryParams([
        ...queries,
        {
          feedbackType: this.feedbackType,
          entityIds: this.setEntityId(),
          entityType: this.tabFilterItems[this.tabFilterIdx].value,
        },
      ]),
    };

    return this.tableService.getGuestFeedbacks(config);
  }

  /**
   * @function setRecords To set the table row data.
   * @param data The api response data for feedback.
   */
  setRecords(data): void {
    if (this.feedbackType === this.globalFeedbackConfig.types.transactional)
      this.values = new FeedbackTable().deserialize(data, this.outlets).records;
    else
      this.values = new StayFeedbackTable().deserialize(
        data,
        this.outlets
      ).records;
    this.totalRecords = data.total;
    data.entityTypeCounts &&
      this.updateTabFilterCount(data.entityTypeCounts, this.totalRecords);
    data.entityStateCounts &&
      this.updateQuickReplyFilterCount(data.entityStateCounts);

    this.loading = false;
  }

  /**
   * @function setEntityId To set entity id based on current table filter.
   * @returns The entityIds.
   */
  setEntityId() {
    if (this.feedbackType === this.globalFeedbackConfig.types.transactional)
      return this.statisticService.outletIds;
    else return this.hotelId;
  }

  /**
   * @function updateFeedbackStatus To update the read status of a feedback.
   * @param status The feedback status.
   */
  updateFeedbackStatus(status: boolean): void {
    if (!this.selectedRows.length) {
      this._snackbarService.openSnackBarAsText(
        this._translateService.instant(
          'messages.validation.select_record_status',
          { status: status ? 'read' : 'unread' }
        )
      );
      return;
    }
    this.loading = true;
    const config = {
      queryObj: this._adminUtilityService.makeQueryParams([
        ...this.globalQueries,
        {
          order: sharedConfig.defaultOrder,
          feedbackType: this.feedbackType,
        },
        ...this.getSelectedQuickReplyFilters(),
      ]),
    };

    const reqData = {
      read: status,
      feedbackId: this.selectedRows.map((data) => data.id),
    };

    this.$subscription.add(
      this.tableService.updateFeedbackStatus(config, reqData).subscribe(
        (response) => {
          this.statisticService.markReadStatusChanged.next(true);
          this._snackbarService
            .openSnackBarWithTranslate(
              {
                translateKey: 'messages.success.feedback_status_updated',
                priorityMessage: 'Status updated.',
              },
              '',
              {
                panelClass: 'success',
              }
            )
            .subscribe();
          this.loadInitialData(
            [
              ...this.globalQueries,
              { order: sharedConfig.defaultOrder },
              ...this.getSelectedQuickReplyFilters(),
            ],
            false
          );
          this.loading = false;
        },
        ({ error }) => {
          this.loading = false;
          this.showErrorMessage(error);
        }
      )
    );
  }

  /**
   * @function exportCSV To export CSV report for feedback table.
   */
  exportCSV(): void {
    this.loading = true;
    const queries = [
      ...this.globalQueries,
      {
        order: sharedConfig.defaultOrder,
        feedbackType: this.feedbackType,
        entityType: this.tabFilterItems[this.tabFilterIdx].value,
      },
      ...this.getSelectedQuickReplyFilters(),
      ...this.selectedRows.map((item) => ({ ids: item.id })),
    ];
    if (
      this.tableFG.get('documentActions').get('documentActionType').value ===
      'summary'
    ) {
      queries.push({ type: 'summary' });
    }
    const config = {
      queryObj: this._adminUtilityService.makeQueryParams(queries),
    };
    this.$subscription.add(
      this.tableService.exportCSV(config).subscribe(
        (response) => {
          FileSaver.saveAs(
            response,
            this.tableName.toLowerCase() +
              '_Feedback_export_' +
              new Date().getTime() +
              '.csv'
          );
          this.loading = false;
        },
        ({ error }) => {
          this.loading = false;
          this.showErrorMessage(error);
        }
      )
    );
  }

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}
