import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogConfig } from '@angular/material/dialog';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import {
  DetailsComponent,
  GuestDetailService,
} from '@hospitality-bot/admin/guest-detail';
import { Guest, GuestTable } from '@hospitality-bot/admin/guests';
import {
  AdminUtilityService,
  BaseDatatableComponent,
  FeedbackService,
  ModuleNames,
  TableNames,
  TableService,
} from '@hospitality-bot/admin/shared';
import {
  ModalService,
  SnackBarService,
} from '@hospitality-bot/shared/material';
import * as FileSaver from 'file-saver';
import { LazyLoadEvent, SortEvent } from 'primeng/api';
import { Observable, Subscription } from 'rxjs';
import { feedback } from '../../constants/feedback';

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
  tableName = 'Customers - Feedback';
  actionButtons = true;
  isQuickFilters = true;
  isTabFilters = true;
  isResizableColumns = true;
  isAutoLayout = false;
  isCustomSort = true;
  triggerInitialData = false;
  hotelId: string;

  cols = feedback.cols.feedbackDatatable;

  chips = feedback.chips.feedbackDatatable;

  tabFilterItems = [
    {
      label: 'Journey/ Reservation',
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
    private _guestTableService: GuestDetailService,
    private _adminUtilityService: AdminUtilityService,
    private _globalFilterService: GlobalFilterService,
    private _snackbarService: SnackBarService,
    private _modal: ModalService,
    public feedbackService: FeedbackService,
    protected tabFilterService: TableService
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
        ];
        this.getHotelId(this.globalQueries);
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

  /**
   * @function getHotelId Gets the hotel id from the array of object.
   * @param globalQueries The global filter array list.
   */
  getHotelId(globalQueries): void {
    //todo

    globalQueries.forEach((element) => {
      if (element.hasOwnProperty('hotelId')) {
        this.hotelId = element.hotelId;
      }
    });
  }

  /**
   * @function loadInitialData To load the initial data for datatable.
   * @param queries The filter list with date and hotel filters.
   * @param loading The loading status.
   * @param props The table props to control data fetching.
   */
  loadInitialData(queries = [], loading = true) {
    this.loading = loading && true;
    this.$subscription.add(
      this.fetchDataFrom(queries).subscribe(
        (data) => {
          this.values = new GuestTable().deserialize(data).records;
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

  /**
   * @function getSelectedQuickReplyFilters To return the selected chip list
   * @returns The selected chips.
   */
  getSelectedQuickReplyFilters() {
    return this.tabFilterItems[this.tabFilterIdx].chips
      .filter((item) => item.isSelected == true)
      .map((item) => ({
        entityState: item.value,
      }));
  }

  /**
   * @function updateTabFilterCount To update the count for the tabs.
   * @param countObj The object with count for all the tab.
   * @param currentTabCount The count for current selected tab.
   */
  updateTabFilterCount(countObj, currentTabCount) {
    if (countObj) {
      this.tabFilterItems.forEach((tab) => {
        tab.total = countObj[tab.value];
      });
    } else {
      this.tabFilterItems[this.tabFilterIdx].total = currentTabCount;
    }
  }

  /**
   * @function updateQuickReplyFilterCount To update the count for chips.
   * @param countObj The object with count for all the chip.
   */
  updateQuickReplyFilterCount(countObj) {
    if (countObj) {
      this.tabFilterItems.forEach((tab) => {
        tab.chips.forEach((chip) => {
          chip.total = countObj[chip.value];
        });
      });
    }
  }

  /**
   * @function fetchDataFrom Returns an observable for the feedback list api call.
   * @param queries The filter list with date and hotel filters.
   * @param defaultProps The default table props to control data fetching.
   * @returns The observable with feedback list.
   */
  fetchDataFrom(
    queries,
    defaultProps = { offset: this.first, limit: this.rowsPerPage }
  ): Observable<any> {
    this.resetRowSelection();
    queries.push(defaultProps);
    const config = {
      queryObj: this._adminUtilityService.makeQueryParams(queries),
    };

    return this._guestTableService.getGuestList(config);
  }

  /**
   * @function loadData To load data for the table after any event.
   * @param event The lazy load event for the table.
   */
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
          this.values = new GuestTable().deserialize(data).records;
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

  /**
   * @function updatePaginations To update the pagination variable values.
   * @param event The lazy load event for the table.
   */
  updatePaginations(event) {
    this.first = event.first;
    this.rowsPerPage = event.rows;
    this.tempFirst = this.first;
    this.tempRowsPerPage = this.rowsPerPage;
  }

  updatePaginationForFilterItems(pageEvent) {
    this.tabFilterItems[this.tabFilterIdx].lastPage = pageEvent;
  }

  /**
   * @function customSort To sort the rows of the table.
   * @param eventThe The event for sort click action.
   */
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

  /**
   * @function onSelectedTabFilterChange To handle the tab filter change.
   * @param event The material tab change event.
   */
  onSelectedTabFilterChange(event) {
    this.tabFilterIdx = event.index;
    this.changePage(+this.tabFilterItems[event.index].lastPage);
  }

  /**
   * @function onFilterTypeTextChange To handle the search for each column of the table.
   * @param value The value of the search field.
   * @param field The name of the field across which filter is done.
   * @param matchMode The mode by which filter is to be done.
   */
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

  /**
   * @function exportCSV To export CSV report of the table.
   */
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
    this.$subscription.add(
      this._guestTableService.exportCSV(config).subscribe(
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

  /**
   * @function toggleQuickReplyFilter To handle the chip click for a tab.
   * @param quickReplyTypeIdx The chip index.
   * @param quickReplyType The chip type.
   */
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

  /**
   * @function openDetailPage To open the detail modal for a reservation.
   * @param event The mouse click event.
   * @param rowData The data of the clicked row.
   * @param tabKey The key of the tab to be opened in detail modal.
   */
  openDetailPage(event: MouseEvent, rowData?: Guest, tabKey?: string) {
    event.stopPropagation();

    if (rowData) {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.width = '100%';
      const detailCompRef = this._modal.openDialog(
        DetailsComponent,
        dialogConfig
      );

      detailCompRef.componentInstance.bookingId = rowData.booking.bookingId;
      detailCompRef.componentInstance.guestId = rowData.id;
      detailCompRef.componentInstance.hotelId = this.hotelId;
      tabKey && (detailCompRef.componentInstance.tabKey = tabKey);

      this.$subscription.add(
        detailCompRef.componentInstance.onDetailsClose.subscribe((res) => {
          // remove loader for detail close
          this.loadInitialData(
            [
              ...this.globalQueries,
              {
                order: 'DESC',
                entityType: this.tabFilterItems[this.tabFilterIdx].value,
              },
              ...this.getSelectedQuickReplyFilters(),
            ],
            false
          );
          detailCompRef.close();
        })
      );
    }
  }

  ngOnDestroy() {
    this.$subscription.unsubscribe();
  }
}
