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
import { MatDialogConfig, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import {
  AdminUtilityService,
  ConfigService,
  FeedbackService,
  HotelDetailService,
  sharedConfig,
  TableService,
  UserService,
} from '@hospitality-bot/admin/shared';
import {
  ModalService,
  SnackBarService,
} from '@hospitality-bot/shared/material';
import { TranslateService } from '@ngx-translate/core';
import * as FileSaver from 'file-saver';
import { Observable } from 'rxjs';
import {
  FeedbackTable,
  StayFeedbackTable,
} from '../../../data-models/feedback-datatable.model';
import { StatisticsService } from '../../../services/feedback-statistics.service';
import { FeedbackTableService } from '../../../services/table.service';
import { SelectedChip } from '../../../types/feedback.type';
import { FeedbackDatatableComponent } from '../../datatable/feedback-datatable/feedback-datatable.component';
import { FeedbackDetailModalComponent } from '../feedback-detail-modal/feedback-detail.component';

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
  feedbackGraph: string;
  constructor(
    public fb: FormBuilder,
    _adminUtilityService: AdminUtilityService,
    globalFilterService: GlobalFilterService,
    snackbarService: SnackBarService,
    _modal: ModalService,
    public feedbackService: FeedbackService,
    tabFilterService: TableService,
    tableService: FeedbackTableService,
    statisticService: StatisticsService,
    _hotelDetailService: HotelDetailService,
    _translateService: TranslateService,
    protected configService: ConfigService,
    userService: UserService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    super(
      fb,
      _adminUtilityService,
      globalFilterService,
      snackbarService,
      _modal,
      feedbackService,
      tabFilterService,
      tableService,
      statisticService,
      _hotelDetailService,
      _translateService,
      configService,
      userService
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
    this.getConfig();
    this.getUserPermission(this.data.feedbackType);
  }

  initData() {
    this.tableName = this.data.tableName;
    this.tabFilterItems = this.data.tabFilterItems;
    this.tabFilterIdx = this.data.tabFilterIdx;
    this.globalFeedbackFilterType = this.data.globalFeedbackFilterType;
    this.config = this.data.config;
    this.feedbackGraph = this.config[0].feedbackGraph;
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
      this.globalFilterService.globalFilter$.subscribe((data) => {
        this.globalQueries = [
          ...data['filter'].queryValue,
          ...data['dateRange'].queryValue,
          ...this.config,
        ];
        this.hotelId = this.globalFilterService.hotelId;
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
    if (
      this.feedbackGraph === 'GUESTTOMEET' ||
      this.feedbackGraph === 'BIFURCATIONS'
    ) {
      return this.tableService.getBifurationGTMData(config);
    } else {
      return this.tableService.getGuestFeedbacks(config);
    }
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
        this.outlets,
        this.colorMap
      ).records;
    this.totalRecords = data.total;
    data.entityTypeCounts &&
      this.updateTabFilterCount(data.entityTypeCounts, this.totalRecords);
    data.entityStateCounts &&
      this.updateQuickReplyFilterCount(data.entityStateCounts);

    this.loading = false;
  }

  updateFeedbackState(event) {
    const data = {
      status: event.statusType,
      notes: event.comment,
    };
    const id = event.id;
    this.tableService.updateFeedbackState(id, data).subscribe(
      (response) => {
        this.snackbarService
          .openSnackBarWithTranslate(
            {
              translateKey: 'Status Updated Successfully.',
              priorityMessage: 'Status Updated Successfully..',
            },
            '',
            {
              panelClass: 'success',
            }
          )
          .subscribe();
        this.tableService.$disableContextMenus.next(true);
        this.loadInitialData([
          ...this.globalQueries,
          { order: sharedConfig.defaultOrder },
          ...this.getSelectedQuickReplyFilters(),
        ]);
      },
      ({ error }) => {
        this.snackbarService
          .openSnackBarWithTranslate(
            {
              translateKey: `messages.error.${error?.type}`,
              priorityMessage: error.message,
            },
            ''
          )
          .subscribe();
      }
    );
  }

  /**
   * @function setEntityId To set entity id based on current table filter.
   * @returns The entityIds.
   */
  setEntityId() {
    if (
      this.feedbackType === this.globalFeedbackConfig.types.transactional ||
      this.feedbackType === ''
    )
      return this.statisticService.outletIds;
    else return this.hotelId;
  }

  /**
   * @function updateFeedbackStatus To update the read status of a feedback.
   * @param status The feedback status.
   */
  updateFeedbackStatus(status: boolean): void {
    if (!this.selectedRows.length) {
      this.snackbarService.openSnackBarAsText(
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
          this.snackbarService
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
   * @function getSelectedQuickReplyFilters To get the selected chips.
   * @returns The selected chips.
   */
  getSelectedQuickReplyFilters(): SelectedChip[] {
    return this.tabFilterItems[this.tabFilterIdx].chips
      .filter((item) => item.isSelected === true)
      .map((item) => ({
        entityState: item.value,
      }));
  }

  /**
   * @function onSelectedTabFilterChange To handle tab filter selection.
   * @param event The material tab change event.
   */
  onSelectedTabFilterChange(event: MatTabChangeEvent): void {
    this.tabFilterIdx = event.index;
    this.setTableCols();
    this.values = [];
    this.changePage(+this.tabFilterItems[event.index].lastPage);
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
        entityIds: this.setEntityId(),
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
            `${this.tableName.toLowerCase()}_export_${new Date().getTime()}.csv`
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
   * @function openDetailPage To open the detail modal for a reservation.
   * @param event The mouse click event.
   * @param rowData The data of the clicked row.
   * @param tabKey The key of the tab to be opened in detail modal.
   */
  openDetailPage(event: MouseEvent, rowData?, tabKey?: string): void {
    event.stopPropagation();
    if (!rowData) return;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.width = '100%';
    dialogConfig.data = {
      feedback: rowData,
      colorMap: this.colorMap,
      feedbackType: this.feedbackType,
      isModal: true,
      globalQueries: this.globalQueries,
      outlets: this.outlets,
    };

    const detailCompRef = this._modal.openDialog(
      FeedbackDetailModalComponent,
      dialogConfig
    );
    this.$subscription.add(
      detailCompRef.componentInstance.onDetailsClose.subscribe((res) => {
        // remove loader for detail close
        this.refreshTableData();
        detailCompRef.close();
      })
    );
  }

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
    this.tabFilterItems[this.tabFilterIdx].chips.forEach((chip) => {
      if (chip.value !== 'ALL') {
        chip.isSelected = false;
      } else chip.isSelected = true;
    });
  }
}
