import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogConfig } from '@angular/material/dialog';
import { GlobalFilterService } from 'apps/admin/src/app/core/theme/src/lib/services/global-filters.service';
import * as FileSaver from 'file-saver';
import { FeedbackNotificationComponent } from 'libs/admin/notification/src/lib/components/feedback-notification/feedback-notification.component';
import { BaseDatatableComponent } from 'libs/admin/shared/src/lib/components/datatable/base-datatable.component';
import {
  ModuleNames,
  TableNames,
} from 'libs/admin/shared/src/lib/constants/subscriptionConfig';
import { AdminUtilityService } from 'libs/admin/shared/src/lib/services/admin-utility.service';
import { StatisticsService } from 'libs/admin/shared/src/lib/services/feedback-statistics.service';
import { FeedbackService } from 'libs/admin/shared/src/lib/services/feedback.service';
import { HotelDetailService } from 'libs/admin/shared/src/lib/services/hotel-detail.service';
import { TableService } from 'libs/admin/shared/src/lib/services/table.service';
import { SnackBarService } from 'libs/shared/material/src';
import { ModalService } from 'libs/shared/material/src/lib/services/modal.service';
import { LazyLoadEvent, SortEvent } from 'primeng/api';
import { Observable, Subscription } from 'rxjs';
import { FeedbackTable } from '../../data-models/feedback-datatable.model';
import { FeedbackTableService } from '../../services/table.service';
import { FeedbackNotesComponent } from '../feedback-notes/feedback-notes.component';

@Component({
  selector: 'hospitality-bot-feedback-datatable',
  templateUrl: './feedback-datatable.component.html',
  styleUrls: [
    '../../../../../shared/src/lib/components/datatable/datatable.component.scss',
    './feedback-datatable.component.scss',
  ],
})
export class FeedbackDatatableComponent extends BaseDatatableComponent
  implements OnInit, OnDestroy {
  tableName = 'Guest - Feedback';
  outlets = [];
  actionButtons = true;
  isQuickFilters = true;
  isTabFilters = true;
  isResizableColumns = true;
  isAutoLayout = false;
  isCustomSort = true;
  triggerInitialData = false;
  hotelId: string;

  cols = [
    {
      field: 'outlet',
      header: 'Outlet',
      isSort: true,
      sortType: 'string',
    },
    {
      field: 'guest.getFullName()',
      header: 'Name/Phone No.',
      isSort: true,
      sortType: 'string',
    },
    {
      field: 'getServiceTypeAndTime()',
      header: 'Service/ Feedback',
      isSort: true,
      sortType: 'string',
    },
    {
      field: `getCreatedDate()`,
      header: 'Visit Date/ curr. Living In',
      isSort: true,
      sortType: 'date',
    },
    {
      field: 'comments',
      header: 'Comment',
      isSort: true,
      sortType: 'string',
    },
    { field: 'stageAndourney', header: 'Actions' },
  ];

  chips = [
    { label: 'All', icon: '', value: 'ALL', total: 0, isSelected: true },
    {
      label: 'High Potential ',
      icon: '',
      value: 'HIGHPOTENTIAL',
      total: 0,
      isSelected: false,
      type: 'initiated',
    },
    {
      label: 'High Risk ',
      icon: '',
      value: 'HIGHRISK',
      total: 0,
      isSelected: false,
      type: 'initiated',
    },
    {
      label: 'Read ',
      icon: '',
      value: 'READ',
      total: 0,
      isSelected: false,
      type: 'initiated',
    },
    {
      label: 'Unread ',
      icon: '',
      value: 'UNREAD',
      total: 0,
      isSelected: false,
      type: 'initiated',
    },
    {
      label: 'Actioned ',
      icon: '',
      value: 'ACTIONED',
      total: 0,
      isSelected: false,
      type: 'initiated',
    },
  ];

  tabFilterItems = [
    {
      label: 'Transactional ',
      content: '',
      value: 'ALL',
      disabled: false,
      total: 0,
      chips: this.chips,
      lastPage: 0,
    },
  ];
  tabFilterIdx: number = 0;
  globalQueries = [];
  $subscription = new Subscription();
  constructor(
    public fb: FormBuilder,
    private _adminUtilityService: AdminUtilityService,
    private _globalFilterService: GlobalFilterService,
    private _snackbarService: SnackBarService,
    private _modal: ModalService,
    public feedbackService: FeedbackService,
    protected tabFilterService: TableService,
    protected tableService: FeedbackTableService,
    protected statisticService: StatisticsService,
    protected _hotelDetailService: HotelDetailService
  ) {
    super(fb, tabFilterService);
  }

  ngOnInit(): void {
    this.registerListeners();
    this.getSubscribedFilters(
      ModuleNames.FEEDBACK,
      TableNames.FEEDBACK,
      this.tabFilterItems
    );
    this.documentActionTypes.push({
      label: `Export Summary`,
      value: 'summary',
      type: '',
      defaultLabel: 'Export Summary',
    });
  }

  getOutlets(branchId) {
    this.outlets = this._hotelDetailService.hotelDetails.brands[0].branches.find(
      (branch) => branch['id'] == branchId
    ).outlets;
  }

  registerListeners(): void {
    this.listenForGlobalFilters();
  }

  listenForGlobalFilters(): void {
    this.$subscription.add(
      this._globalFilterService.globalFilter$.subscribe((data) => {
        //set-global query everytime global filter changes
        this.globalQueries = [
          ...data['filter'].queryValue,
          ...data['dateRange'].queryValue,
          { outletsIds: this.statisticService.outletIds },
        ];
        this.getHotelId(this.globalQueries);
        this.getOutlets(data['filter'].value.property.branchName);
        //fetch-api for records
        this.loadInitialData([
          ...this.globalQueries,
          {
            order: 'DESC',
            entityType: this.tabFilterItems[this.tabFilterIdx].value,
          },
          ...this.getSelectedQuickReplyFilters(),
          // { offset: this.first, limit: this.rowsPerPage },
        ]);
      })
    );
  }

  listenForOutletChanged() {
    this.statisticService.outletChange.subscribe((response) => {
      if (response) {
        this.globalQueries[this.globalQueries.length - 1] = {
          outletsIds: this.statisticService.outletIds,
        };
        this.loadInitialData([
          ...this.globalQueries,
          {
            order: 'DESC',
            entityType: this.tabFilterItems[this.tabFilterIdx].value,
          },
          ...this.getSelectedQuickReplyFilters(),
          // { offset: this.first, limit: this.rowsPerPage },
        ]);
      }
    });
  }

  getHotelId(globalQueries): void {
    //todo

    globalQueries.forEach((element) => {
      if (element.hasOwnProperty('hotelId')) {
        this.hotelId = element.hotelId;
      }
    });
  }

  loadInitialData(queries = [], loading = true) {
    this.loading = loading && true;
    this.$subscription.add(
      this.fetchDataFrom(queries).subscribe(
        (data) => {
          this.values = new FeedbackTable().deserialize(
            data,
            this.outlets
          ).records;
          //set pagination
          this.totalRecords = data.total;
          this.tabFilterItems[this.tabFilterIdx].total = data.total;
          data.entityStateCounts &&
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
      this.tabFilterItems.forEach((tab) => {
        tab.chips.forEach((chip) => {
          chip.total = countObj[chip.value];
        });
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

    return this.tableService.getGuestFeedbacks(config);
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
          this.values = new FeedbackTable().deserialize(
            data,
            this.outlets
          ).records;
          this.tabFilterItems[this.tabFilterIdx].total = data.total;
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
    const queries = [
      ...this.globalQueries,
      {
        order: 'DESC',
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

  updateFeedbackStatus(status: boolean) {
    if (!this.selectedRows.length) {
      this._snackbarService.openSnackBarAsText(
        `Please select a record to be marked as ${status ? 'read' : 'unread'}`
      );
      return;
    }
    this.loading = true;
    const config = {
      queryObj: this._adminUtilityService.makeQueryParams([
        ...this.globalQueries,
        {
          order: 'DESC',
          entityType: this.tabFilterItems[this.tabFilterIdx].value,
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
          this._snackbarService.openSnackBarAsText('Status updated', '', {
            panelClass: 'success',
          });
          this.loadInitialData(
            [
              ...this.globalQueries,
              {
                order: 'DESC',
                entityType: this.tabFilterItems[this.tabFilterIdx].value,
              },
              ...this.getSelectedQuickReplyFilters(),
              // { offset: this.first, limit: this.rowsPerPage },
            ],
            false
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

  openEditNotes(event, data, notes) {
    event.stopPropagation();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.width = '550';
    const detailCompRef = this._modal.openDialog(
      FeedbackNotesComponent,
      dialogConfig
    );

    detailCompRef.componentInstance.feedback = data;
    detailCompRef.componentInstance.notes = notes;
    detailCompRef.componentInstance.timezone = this._globalFilterService.timezone;

    this.$subscription.add(
      detailCompRef.componentInstance.onNotesClosed.subscribe((res) => {
        // remove loader for detail close
        if (res.status) {
          this.$subscription.add(
            this.tableService.updateNotes(res.id, res.data).subscribe(
              (response) => {
                detailCompRef.close();
                this._snackbarService.openSnackBarAsText(
                  'Feedback Closed successfully',
                  '',
                  {
                    panelClass: 'success',
                  }
                );
                this.loadInitialData(
                  [
                    ...this.globalQueries,
                    {
                      order: 'DESC',
                      entityType: this.tabFilterItems[this.tabFilterIdx].value,
                    },
                    ...this.getSelectedQuickReplyFilters(),
                    // { offset: this.first, limit: this.rowsPerPage },
                  ],
                  false
                );
              },
              ({ error }) =>
                this._snackbarService.openSnackBarAsText(error.message)
            )
          );
        } else detailCompRef.close();
      })
    );
  }

  downloadFeedbackPdf(event, id) {
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
        (error) => this._snackbarService.openSnackBarAsText(error.message)
      )
    );
  }

  getFeedbackOutlet(id) {
    return this.outlets.filter((outlet) => outlet.id === id);
  }

  openFeedbackRequestPage(event) {
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
        // remove loader for detail close
        detailCompRef.close();
      })
    );
  }

  ngOnDestroy() {
    this.$subscription.unsubscribe();
  }
}
