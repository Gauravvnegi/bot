import {
  Component,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatDialogConfig } from '@angular/material/dialog';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { feedback, feedbackStatus } from '../../../constants/feedback';
import { FeedbackNotificationComponent } from '@hospitality-bot/admin/notification';
import {
  AdminUtilityService,
  BaseDatatableComponent,
  Cols,
  ConfigService,
  FeedbackService,
  HotelDetailService,
  sharedConfig,
  UserService,
} from '@hospitality-bot/admin/shared';
import {
  ModalService,
  SnackBarService,
} from '@hospitality-bot/shared/material';
import { TranslateService } from '@ngx-translate/core';
import * as FileSaver from 'file-saver';
import { SortEvent } from 'primeng/api';
import { Observable, Subscription } from 'rxjs';
import {
  FeedbackTable,
  StayFeedbackTable,
} from '../../../data-models/feedback-datatable.model';
import { FeedbackTableService } from '../../../services/table.service';
import { FeedbackDetailModalComponent } from '../../modals/feedback-detail-modal/feedback-detail.component';
import {
  Departmentpermission,
  Departmentpermissions,
} from '../../../data-models/feedback-card.model';
import { StatisticsService } from '../../../services/feedback-statistics.service';
import { MainComponent } from '../../card';
@Component({
  selector: 'hospitality-bot-feedback-datatable',
  templateUrl: './feedback-datatable.component.html',
  styleUrls: [
    '../../../../../../shared/src/lib/components/datatable/datatable.component.scss',
    './feedback-datatable.component.scss',
  ],
})
export class FeedbackDatatableComponent extends BaseDatatableComponent
  implements OnInit, OnDestroy {
  @ViewChild('cardComponent') cardComponent: MainComponent;
  @Input() globalFeedbackFilterType: string;
  @Input() tableName = feedback.table.name;
  // tabFilterIdx = 0;
  // @Input() tabFilterItems = [];
  readonly feedbackStatus = feedbackStatus;
  feedbackTypeFilterItem = [];
  feedbackTypeFilterIdx = 0;
  defaultFeedbackType;
  globalFeedbackConfig = feedback;
  outlets = [];
  actionButtons = true;
  isQuickFilters = true;
  isTabFilters = true;
  isResizableColumns = true;
  isAutoLayout = false;
  isCustomSort = true;
  triggerInitialData = false;
  entityId: string;
  colorMap;
  responseRate;
  cols: Cols[] = feedback.cols.feedbackDatatable.transactional;
  stayCols = feedback.cols.feedbackDatatable.stay;
  tableTypes = [feedback.tableTypes.card, feedback.tableTypes.table];
  chips = feedback.chips.feedbackDatatable;
  globalQueries = [];
  $subscription = new Subscription();
  userPermissions: Departmentpermission[];
  feedbackType = '';
  navRoutes = [{ label: 'Feedback', link: './' }];
  constructor(
    public fb: FormBuilder,
    protected _adminUtilityService: AdminUtilityService,
    protected globalFilterService: GlobalFilterService,
    protected snackbarService: SnackBarService,
    protected _modal: ModalService,
    public feedbackService: FeedbackService,
    protected tableService: FeedbackTableService,
    protected statisticService: StatisticsService,
    protected _hotelDetailService: HotelDetailService,
    protected _translateService: TranslateService,
    protected configService: ConfigService,
    protected userService: UserService
  ) {
    super(fb);
  }

  ngOnInit(): void {
    this.tableFG?.addControl('tableType', new FormControl('card'));
    this.registerListeners();
    this.documentActionTypes.push({
      label: `Export Summary`,
      value: 'summary',
      type: '',
      defaultLabel: 'Export Summary',
    });
    // this.selectedTab = this.feedbackTypeFilterItem[
    //   this.feedbackTypeFilterIdx
    // ]?.value;
  }

  registerListeners(): void {
    this.listenForFeedbackTypeChanged();
    this.listenForGlobalFilters();
    this.listenForOutletChanged();
    this.getConfig();
  }

  getUserPermission(feedbackType) {
    this.$subscription.add(
      this.userService
        .getUserPermission(
          feedbackType === '' ? feedback.types.stay : feedbackType
        )
        .subscribe((response) => {
          this.userPermissions = new Departmentpermissions().deserialize(
            response.userCategoryPermission
          );
          this.userService.userPermissions = response;
        })
    );
  }

  setTableType(value) {
    this.tableFG.patchValue({ tableType: value });
    if (value === feedback.tableTypes.table.value) {
      this.cardComponent.$subscription.unsubscribe();
      this.loadInitialData([
        ...this.globalQueries,
        { order: sharedConfig.defaultOrder },
        ...this.getSelectedQuickReplyFilters({ key: 'entityState' }),
      ]);
      this.getUserPermission(
        this.feedbackTypeFilterItem[this.feedbackTypeFilterIdx]?.value
      );
    } else this.selectedRows = [];
  }

  getConfig() {
    this.$subscription.add(
      this.configService.$config.subscribe((response) => {
        if (response) {
          this.colorMap = response?.feedbackColorMap;
          this.responseRate = response?.responseRate;
        }
      })
    );
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
        ];
        this.entityId = this.globalFilterService.entityId;
        this.getOutlets(data['filter'].value.property.entityName);
        const feedbackType = data['filter'].value.feedback.feedbackType;
        this.defaultFeedbackType =
          data['filter'].value.feedback.feedbackType === 'ALL'
            ? feedback.types.stay
            : data['filter'].value.feedback.feedbackType;

        this.setTabFilters(
          feedbackType === feedback.types.transactional
            ? feedback.types.transactional
            : feedback.types.stay
        );

        if (this.tableFG?.get('tableType').value !== 'card') {
          // if (this.feedbackTypeFilterItem.length === 0)
          // this.setTabFilters(
          //   feedbackType === feedback.types.transactional
          //     ? feedback.types.transactional
          //     : feedback.types.stay
          // );
          this.loadInitialData([
            ...this.globalQueries,
            { order: sharedConfig.defaultOrder },
            ...this.getSelectedQuickReplyFilters({ key: 'entityState' }),
          ]);
        }
      })
    );
  }

  /**
   * @function listenForOutletChanged To listen for outlet tab change.
   */
  listenForOutletChanged(): void {
    this.$subscription.add(
      this.statisticService.$outletChange.subscribe((response) => {
        if (response) {
          this.globalQueries.forEach((element) => {
            if (element.hasOwnProperty('entityIds')) {
              element.entityIds = this.statisticService.outletIds;
            }
          });
          if (this.tableFG.value.tableType !== feedback.tableTypes.card.value)
            this.loadInitialData([
              ...this.globalQueries,
              { order: sharedConfig.defaultOrder },
              ...this.getSelectedQuickReplyFilters({ key: 'entityState' }),
            ]);
        }
      })
    );
  }

  /**
   * @function listenForFeedbackTypeChanged To listen the local tab change.
   */
  listenForFeedbackTypeChanged(): void {
    this.$subscription.add(
      this.tableService.$feedbackType.subscribe((response) => {
        this.setTabFilters(response);
      })
    );
  }

  /**
   * @function setTabFilters To set tab filters based on feedback type  .
   * @param feedbackType The current feedback type.
   */
  setTabFilters(feedbackType): void {
    if (feedbackType === feedback.types.transactional)
      this.feedbackTypeFilterItem =
        feedback.tabFilterItems.datatable.transactional;
    else this.feedbackTypeFilterItem = feedback.tabFilterItems.datatable.stay;
    this.feedbackType = feedbackType || this.defaultFeedbackType;
    this.setTableCols();
    this.getUserPermission(
      this.feedbackTypeFilterItem[this.feedbackTypeFilterIdx].value
    );
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
   * @function getOutlets To get outlets for a hotel.
   * @param branchId The branch id.
   */
  getOutlets(branchId: string): void {
    this.outlets =
      this._hotelDetailService.hotels.find(
        (branch) => branch['id'] === branchId
      )?.entities ?? [];

    this.outlets = [
      ...this.outlets,
      ...this._hotelDetailService.hotels.filter(
        (branch) => branch['id'] === branchId
      ),
    ];
  }

  /**
   * @function loadInitialData To load initial feedback data.
   * @param queries The filter list data.
   * @param loading The table loading status.
   */
  loadInitialData(queries = [], loading = true): void {
    this.loading = loading && true;
    this.$subscription.add(
      this.fetchDataFrom(queries).subscribe(
        (data) => {
          this.initialLoading = false;
          this.setRecords(data);
        },
        ({ error }) => {
          this.values = [];
          this.loading = false;
        }
      )
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
          entityType: this.selectedTab ?? 'ALL',
          entityIds: this.setEntityId(),
        },
      ]),
    };
    return this.tableService.getBifurationGTMData(config);
  }

  /**
   * @function setEntityId To set entity id based on current table filter.
   * @returns The entityIds.
   */
  setEntityId() {
    if (
      this.feedbackTypeFilterItem[this.feedbackTypeFilterIdx].value ===
      this.globalFeedbackConfig.types.transactional
    )
      return this.statisticService.outletIds;
    else return this.entityId;
  }

  /**
   * @function loadData To load table data on a page change.
   * @param event The lazy load event.
   */
  loadData(): void {
    this.loading = true;
    this.$subscription.add(
      this.fetchDataFrom(
        [
          ...this.globalQueries,
          { order: sharedConfig.defaultOrder },
          ...this.getSelectedQuickReplyFilters({ key: 'entityState' }),
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

  /**
   * @function setRecords To set the table row data.
   * @param data The api response data for feedback.
   */
  setRecords(data): void {
    let modifiedData;
    if (
      this.feedbackTypeFilterItem[this.feedbackTypeFilterIdx].value ===
      this.globalFeedbackConfig.types.transactional
    )
      modifiedData = new FeedbackTable().deserialize(data, this.outlets);
    else
      modifiedData = new StayFeedbackTable().deserialize(
        data,
        this.outlets,
        this.colorMap
      );

    this.values = modifiedData.records;
    this.initFilters(
      modifiedData.entityTypeCounts,
      modifiedData.entityStateCounts,
      modifiedData.totalRecord,
      this.feedbackStatus
    );
    this.loading = false;
  }

  updateFeedbackState(event) {
    const data = {
      status: event.statusType,
      notes: event.comment,
    };
    const id = event.id;
    this.tableService.updateFeedbackState(id, data).subscribe((response) => {
      this.snackbarService
        .openSnackBarWithTranslate(
          {
            translateKey: 'messages.SUCCESS.STATUS_UPDATED',
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
        ...this.getSelectedQuickReplyFilters({ key: 'entityState' }),
      ]);
    });
  }

  /**
   * @function customSort To handle table sort click.
   * @param event The sort event for the table.
   */
  customSort(event: SortEvent): void {
    const col = this.cols.filter((data) => data.field === event.field)[0];
    const field =
      event.field[event.field.length - 1] === ')'
        ? event.field.substring(0, event.field.lastIndexOf('.') || 0)
        : event.field;
    event.data.sort((data1, data2) =>
      this.sortOrder(event, field, data1, data2, col)
    );
  }

  /**
   * @function onFilterTypeTextChange To handle filter field text change.
   * @param value The value for filter field.
   * @param field The field for which table is to be filtered.
   * @param matchMode The match mode for filter.
   */
  onFilterTypeTextChange(
    value: string,
    field: string,
    matchMode = 'contains'
  ): void {
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
        entityType: this.selectedTab,
        entityIds: this.setEntityId(),
      },
      ...this.getSelectedQuickReplyFilters({ key: 'entityState' }),
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
        }
      )
    );
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
          entityType: this.selectedTab,
        },
        ...this.getSelectedQuickReplyFilters({ key: 'entityState' }),
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
                translateKey: 'messages.SUCCESS.STATUS_UPDATED',
                priorityMessage: 'Status updated.',
              },
              '',
              {
                panelClass: 'success',
              }
            )
            .subscribe();
          this.refreshTableData();
          this.loading = false;
        },
        ({ error }) => {
          this.loading = false;
        }
      )
    );
  }

  /**
   * @function downloadFeedbackPdf To download feedback pdf of a feedback.
   * @param event The mouse click event.
   * @param id The outlet id.
   */
  downloadFeedbackPdf(event: MouseEvent, id: string): void {
    event.stopPropagation();

    this.$subscription.add(
      this.tableService.getFeedbackPdf(id).subscribe((response) => {
        const link = document.createElement('a');
        link.href = response.fileDownloadUri;
        link.target = '_blank';
        link.download = response.fileName;
        link.click();
        link.remove();
      })
    );
  }

  /**
   * @function getFeedbackOutlet To get outlet data for a outlet id.
   * @param id The outlet id.
   * @returns The outlet data for a particular id.
   */
  getFeedbackOutlet(id: string) {
    return this.outlets.filter((outlet) => outlet.id === id);
  }

  /**
   * @function openFeedbackRequestPage To open the request feedback modal.
   * @param event The mouse click event.
   */
  openFeedbackRequestPage(event: MouseEvent): void {
    event.stopPropagation();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    const detailCompRef = this._modal.openDialog(
      FeedbackNotificationComponent,
      dialogConfig
    );
    detailCompRef.componentInstance.entityId = this.entityId;
    detailCompRef.componentInstance.email = [
      ...new Set(this.selectedRows.map((item) => item.guest.emailId)),
    ];

    this.$subscription.add(
      detailCompRef.componentInstance.onModalClose.subscribe((res) => {
        detailCompRef.close();
      })
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

  refreshTableData() {
    this.loadInitialData(
      [
        ...this.globalQueries,
        { order: sharedConfig.defaultOrder },
        ...this.getSelectedQuickReplyFilters({ key: 'entityState' }),
      ],
      false
    );
  }

  filterServices(services) {
    return services.filter((service) => !service.label.includes('COMMENT'));
  }

  getRowDataNegativeServices(rowData) {
    if (
      this.feedbackTypeFilterItem[this.feedbackTypeFilterIdx]?.value &&
      !this.loading
    ) {
      if (
        this.feedbackTypeFilterItem[this.feedbackTypeFilterIdx]?.value ===
        feedback.types.transactional
      )
        return rowData.services.getNegativeRatedService();
      return rowData.getNegativeRatedService();
    }
    return [];
  }

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }

  @HostListener('document:click', ['$event'])
  clickout() {
    this.tableService.$disableContextMenus.next(true);
  }
}
