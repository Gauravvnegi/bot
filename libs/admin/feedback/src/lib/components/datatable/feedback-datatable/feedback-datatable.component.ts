import {
  Component,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatDialogConfig } from '@angular/material/dialog';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { feedback } from '@hospitality-bot/admin/feedback';
import { FeedbackNotificationComponent } from '@hospitality-bot/admin/notification';
import {
  AdminUtilityService,
  BaseDatatableComponent,
  ConfigService,
  FeedbackService,
  HotelDetailService,
  sharedConfig,
  StatisticsService,
  TableService,
  UserService,
} from '@hospitality-bot/admin/shared';
import {
  ModalService,
  SnackBarService,
} from '@hospitality-bot/shared/material';
import { TranslateService } from '@ngx-translate/core';
import * as FileSaver from 'file-saver';
import { LazyLoadEvent, SortEvent } from 'primeng/api';
import { Observable, Subscription } from 'rxjs';
import {
  FeedbackTable,
  StayFeedbackTable,
} from '../../../data-models/feedback-datatable.model';
import { FeedbackTableService } from '../../../services/table.service';
import { EntityState, SelectedChip } from '../../../types/feedback.type';
import { FeedbackDetailModalComponent } from '../../modals/feedback-detail-modal/feedback-detail.component';
import {
  Departmentpermission,
  Departmentpermissions,
} from '../../../data-models/feedback-card.model';
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
  @Input() globalFeedbackFilterType: string;
  @Input() tableName = feedback.table.name;
  @Input() tabFilterIdx = 0;
  @Input() tabFilterItems = [];
  globalFeedbackConfig = feedback;
  outlets = [];
  actionButtons = true;
  isQuickFilters = true;
  isTabFilters = true;
  isResizableColumns = true;
  isAutoLayout = false;
  isCustomSort = true;
  triggerInitialData = false;
  hotelId: string;
  rowsPerPage = 25;
  colorMap;
  cols = feedback.cols.feedbackDatatable.transactional;
  stayCols = feedback.cols.feedbackDatatable.stay;
  tableTypes = [feedback.tableTypes.table, feedback.tableTypes.card];
  chips = feedback.chips.feedbackDatatable;
  globalQueries = [];
  $subscription = new Subscription();
  userPermissions: Departmentpermission[];
  constructor(
    public fb: FormBuilder,
    protected _adminUtilityService: AdminUtilityService,
    protected _globalFilterService: GlobalFilterService,
    protected _snackbarService: SnackBarService,
    protected _modal: ModalService,
    public feedbackService: FeedbackService,
    protected tabFilterService: TableService,
    protected tableService: FeedbackTableService,
    protected statisticService: StatisticsService,
    protected _hotelDetailService: HotelDetailService,
    protected _translateService: TranslateService,
    protected configService: ConfigService,
    protected userService: UserService
  ) {
    super(fb, tabFilterService);
  }

  ngOnInit(): void {
    this.tableFG?.addControl('tableType', new FormControl('table'));
    this.registerListeners();
    this.documentActionTypes.push({
      label: `Export Summary`,
      value: 'summary',
      type: '',
      defaultLabel: 'Export Summary',
    });
  }

  registerListeners(): void {
    this.listenForFeedbackTypeChanged();
    this.listenForGlobalFilters();
    this.listenForOutletChanged();
    this.getConfig();
  }

  getUserPermission(feedbackType) {
    this.$subscription.add(
      this.userService.getUserPermission(feedbackType).subscribe((response) => {
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
      this.loadInitialData([
        ...this.globalQueries,
        { order: sharedConfig.defaultOrder },
        ...this.getSelectedQuickReplyFilters(),
      ]);
      this.getUserPermission(this.tabFilterItems[this.tabFilterIdx]?.value);
    } else this.selectedRows = [];
  }

  getConfig() {
    this.$subscription.add(
      this.configService.$config.subscribe((response) => {
        if (response) this.colorMap = response?.feedbackColorMap;
      })
    );
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
        ];
        this.getHotelId(this.globalQueries);
        this.getOutlets(data['filter'].value.property.branchName);
        const feedbackType = data['filter'].value.feedback.feedbackType;

        if (this.tableFG?.get('tableType').value !== 'card') {
          if (this.tabFilterItems.length === 0)
            this.setTabFilters(
              feedbackType === feedback.types.transactional
                ? feedback.types.transactional
                : feedback.types.stay
            );
          this.loadInitialData([
            ...this.globalQueries,
            { order: sharedConfig.defaultOrder },
            ...this.getSelectedQuickReplyFilters(),
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
          this.loadInitialData([
            ...this.globalQueries,
            { order: sharedConfig.defaultOrder },
            ...this.getSelectedQuickReplyFilters(),
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
      this.tableService.$feedbackType.subscribe((response) =>
        this.setTabFilters(response)
      )
    );
  }

  /**
   * @function setTabFilters To set tab filters based on feedback type  .
   * @param feedbackType The current feedback type.
   */
  setTabFilters(feedbackType): void {
    if (feedbackType === feedback.types.transactional)
      this.tabFilterItems = feedback.tabFilterItems.datatable.transactional;
    else this.tabFilterItems = feedback.tabFilterItems.datatable.stay;
    this.setTableCols();
    this.getUserPermission(this.tabFilterItems[this.tabFilterIdx].value);
  }

  /**
   * @function setTableCols To set table columns header
   */
  setTableCols(): void {
    this.cols =
      this.tabFilterItems[this.tabFilterIdx]?.value ===
      this.globalFeedbackConfig.types.stay
        ? this.globalFeedbackConfig.cols.feedbackDatatable.stay
        : this.globalFeedbackConfig.cols.feedbackDatatable.transactional;
  }

  /**
   * @function getOutlets To get outlets for a hotel.
   * @param branchId The branch id.
   */
  getOutlets(branchId: string): void {
    this.outlets = this._hotelDetailService.hotelDetails.brands[0].branches.find(
      (branch) => branch['id'] === branchId
    ).outlets;
    this.outlets = [
      ...this.outlets,
      ...this._hotelDetailService.hotelDetails.brands[0].branches.filter(
        (branch) => branch['id'] === branchId
      ),
    ];
  }

  /**
   * @function getHotelId To get hotel id from the filter data.
   * @param globalQueries The filter list data.
   */
  getHotelId(globalQueries): void {
    globalQueries.forEach((element) => {
      if (element.hasOwnProperty('hotelId')) {
        this.hotelId = element.hotelId;
      }
    });
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
          this.setRecords(data);
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
        entityType: item.value,
      }));
  }

  /**
   * @function updateTabFilterCount To update tab data count.
   * @param countObj The Tab count object.
   * @param currentTabCount The current tab data count.
   */
  updateTabFilterCount(countObj, currentTabCount: number): void {
    if (countObj) {
      this.tabFilterItems.forEach((tab) => {
        tab.total = countObj[tab.value];
      });
    } else {
      this.tabFilterItems[this.tabFilterIdx].total = currentTabCount;
    }
  }

  /**
   * @function updateQuickReplyFilterCount To update chip count.
   * @param countObj The chip count data.
   */
  updateQuickReplyFilterCount(countObj: EntityState): void {
    if (countObj) {
      this.tabFilterItems.forEach((tab) => {
        tab.chips.forEach((chip) => {
          chip.total = countObj[chip.value];
        });
      });
    }
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
          feedbackType: this.tabFilterItems[this.tabFilterIdx].value,
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
      this.tabFilterItems[this.tabFilterIdx].value ===
      this.globalFeedbackConfig.types.transactional
    )
      return this.statisticService.outletIds;
    else return this.hotelId;
  }

  /**
   * @function loadData To load table data on a page change.
   * @param event The lazy load event.
   */
  loadData(event: LazyLoadEvent): void {
    this.loading = true;
    this.updatePaginations(event);
    this.$subscription.add(
      this.fetchDataFrom(
        [
          ...this.globalQueries,
          { order: sharedConfig.defaultOrder },
          ...this.getSelectedQuickReplyFilters(),
        ],
        { offset: this.first, limit: this.rowsPerPage }
      ).subscribe(
        (data) => {
          this.setRecords(data);
        },
        ({ error }) => {
          this.loading = false;
          this.showErrorMessage(error);
        }
      )
    );
  }

  /**
   * @function setRecords To set the table row data.
   * @param data The api response data for feedback.
   */
  setRecords(data): void {
    if (
      this.tabFilterItems[this.tabFilterIdx].value ===
      this.globalFeedbackConfig.types.transactional
    )
      this.values = new FeedbackTable().deserialize(data, this.outlets).records;
    else
      this.values = new StayFeedbackTable().deserialize(
        data,
        this.outlets,
        this.colorMap
      ).records;
    this.totalRecords =
      data.entityTypeCounts[
        this.tabFilterItems[this.tabFilterIdx].chips.filter(
          (item) => item.isSelected
        )[0].value
      ];
    this.tabFilterItems[this.tabFilterIdx].total = data.total;
    data.entityTypeCounts &&
      this.updateQuickReplyFilterCount(data.entityTypeCounts);

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
        this._snackbarService
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
        this._snackbarService
          .openSnackBarWithTranslate(
            {
              translateKey: error.message,
              priorityMessage: error.message,
            },
            ''
          )
          .subscribe();
      }
    );
  }

  /**
   * @function updatePaginations To handle page change event.
   * @param event The lazy load event.
   */
  updatePaginations(event: LazyLoadEvent): void {
    this.first = event.first;
    this.rowsPerPage = event.rows;
  }

  /**
   * @function updatePaginationForFilterItems To update the page number for a tab.
   * @param pageEvent The page number.
   */
  updatePaginationForFilterItems(pageEvent: number): void {
    this.tabFilterItems[this.tabFilterIdx].lastPage = pageEvent;
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
   * @function onSelectedTabFilterChange To handle tab filter selection.
   * @param event The material tab change event.
   */
  onSelectedTabFilterChange(event: MatTabChangeEvent): void {
    this.tabFilterIdx = event.index;
    if (this.tableFG?.get('tableType').value !== 'card') {
      this.setTableCols();
      this.values = [];
      this.changePage(+this.tabFilterItems[event.index].lastPage);
    }
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
    matchMode = 'startsWith'
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
        // entityType: this.tabFilterItems[this.tabFilterIdx].value,
        feedbackType: this.tabFilterItems[this.tabFilterIdx].value,
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
          feedbackType: this.tabFilterItems[this.tabFilterIdx].value,
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
          this.refreshTableData();
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
   * @function toggleQuickReplyFilter To toggle chip selection.
   * @param quickReplyTypeIdx The selected chip index.
   * @param quickReplyType The selected chip.
   */
  toggleQuickReplyFilter(quickReplyTypeIdx: number, quickReplyType): void {
    if (quickReplyTypeIdx === 0) {
      this.tabFilterItems[this.tabFilterIdx].chips.forEach((chip) => {
        if (chip.value !== 'GTM') {
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

  /**
   * @function downloadFeedbackPdf To download feedback pdf of a feedback.
   * @param event The mouse click event.
   * @param id The outlet id.
   */
  downloadFeedbackPdf(event: MouseEvent, id: string): void {
    event.stopPropagation();

    this.$subscription.add(
      this.tableService.getFeedbackPdf(id).subscribe(
        (response) => {
          const link = document.createElement('a');
          link.href = response.fileDownloadUri;
          link.target = '_blank';
          link.download = response.fileName;
          link.click();
          link.remove();
        },
        (error) => this.showErrorMessage(error)
      )
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
    detailCompRef.componentInstance.hotelId = this.hotelId;
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
   * @function showErrorMessage To show error message via snackbar.
   * @param error The error object from api.
   */
  showErrorMessage(error): void {
    this._snackbarService
      .openSnackBarWithTranslate(
        {
          translateKey: 'messages.error.some_thing_wrong',
          priorityMessage: error?.message,
        },
        ''
      )
      .subscribe();
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
      feedbackType: this.tabFilterItems[this.tabFilterIdx].value,
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
        ...this.getSelectedQuickReplyFilters(),
      ],
      false
    );
  }

  filterServices(services) {
    return services.filter((service) => !service.label.includes('COMMENT'));
  }

  getRowDataNegativeServices(rowData) {
    if (this.tabFilterItems[this.tabFilterIdx]?.value && !this.loading) {
      if (
        this.tabFilterItems[this.tabFilterIdx]?.value ===
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
