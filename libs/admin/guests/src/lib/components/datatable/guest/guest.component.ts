import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogConfig } from '@angular/material/dialog';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { DetailsComponent } from '@hospitality-bot/admin/reservation';
import {
  AdminUtilityService,
  BaseDatatableComponent,
  FeedbackService,
  ModuleNames,
  TableNames,
  TableService,
} from '@hospitality-bot/admin/shared';
import { ModalService } from '@hospitality-bot/shared/material';
import * as FileSaver from 'file-saver';
import { SnackBarService } from 'libs/shared/material/src';
import { LazyLoadEvent } from 'primeng/api/public_api';
import { SortEvent } from 'primeng/api/sortevent';
import { Observable, Subscription } from 'rxjs';
import { guest } from '../../../constants/guest';
import { GuestTable } from '../../../data-models/guest-table.model';
import { GuestTableService } from '../../../services/guest-table.service';
import { SelectedEntityState } from '../../../types/guest.type';

@Component({
  selector: 'hospitality-bot-guest-datatable',
  templateUrl: './guest.component.html',
  styleUrls: [
    '../../../../../../shared/src/lib/components/datatable/datatable.component.scss',
    './guest.component.scss',
  ],
})
export class GuestDatatableComponent extends BaseDatatableComponent
  implements OnInit, OnDestroy {
  @Input() tableName = 'Guest List';
  @Input() tabFilterItems = guest.tabFilterItems.datatable;
  actionButtons = true;
  isQuickFilters = true;
  isTabFilters = true;
  isResizableColumns = true;
  isAutoLayout = false;
  isCustomSort = true;
  triggerInitialData = false;
  hotelId: string;
  cols = guest.cols.datatable;
  tabFilterIdx = 0;
  globalQueries = [];
  $subscription = new Subscription();

  constructor(
    public fb: FormBuilder,
    protected _guestTableService: GuestTableService,
    protected _adminUtilityService: AdminUtilityService,
    protected globalFilterService: GlobalFilterService,
    protected snackbarService: SnackBarService,
    protected _modal: ModalService,
    protected tabFilterService: TableService,
    public feedbackService: FeedbackService
  ) {
    super(fb, tabFilterService);
  }

  ngOnInit(): void {
    this.registerListeners();
    this.getSubscribedFilters(
      ModuleNames.GUESTS,
      TableNames.GUEST,
      this.tabFilterItems
    );
  }

  registerListeners(): void {
    this.listenForGlobalFilters();
  }

  /**
   * @function listenForGlobalFilters To listen for global filters and load data when filter value is changed.
   */
  listenForGlobalFilters(): void {
    this.$subscription.add(
      this.globalFilterService.globalFilter$.subscribe((data) => {
        this.globalQueries = [
          ...data['filter'].queryValue,
          ...data['dateRange'].queryValue,
        ];
        this.hotelId = this.globalFilterService.hotelId;
        this.loadInitialData([
          ...this.globalQueries,
          {
            order: 'DESC',
            entityType: this.tabFilterItems[this.tabFilterIdx].value,
          },
          ...this.getSelectedQuickReplyFilters(),
        ]);
      })
    );
  }

  /**
   *
   * @param globalQueries
   */

  /**
   * @function loadInitialData To load the initial data for datatable.
   * @param queries The filter list with date and hotel filters.
   * @param loading The loading status.
   * @param props The table props to control data fetching.
   */
  loadInitialData(queries = [], loading = true): void {
    this.loading = loading && true;
    this.$subscription.add(
      this.fetchDataFrom(queries).subscribe(
        (data) => {
          this.initialLoading = false;
          this.setRecords(data);
          data.entityTypeCounts &&
            this.updateTabFilterCount(data.entityTypeCounts, this.totalRecords);
        },
        ({ error }) => {
          this.loading = false;
          this.snackbarService
            .openSnackBarWithTranslate({
              translateKey: 'messages.error.some_thing_wrong',
              priorityMessage: error?.message,
            })
            .subscribe();
        }
      )
    );
  }

  /**
   * @function setRecords To set the data table records.
   * @param data The api response data.
   */
  setRecords(data): void {
    this.values = new GuestTable().deserialize(data).records;
    this.totalRecords = data.total;
    this.loading = false;
    data.entityStateCounts &&
      this.updateQuickReplyFilterCount(data.entityStateCounts);
  }

  /**
   * @function getSelectedQuickReplyFilters To return the selected chip list
   * @returns The selected chips.
   */
  getSelectedQuickReplyFilters(): SelectedEntityState[] {
    return this.tabFilterItems[this.tabFilterIdx].chips
      .filter((item) => item.isSelected)
      .map((item) => ({
        entityState: item.value,
      }));
  }

  /**
   * @function updateTabFilterCount To update the count for the tabs.
   * @param countObj The object with count for all the tab.
   * @param currentTabCount The count for current selected tab.
   */
  updateTabFilterCount(countObj, currentTabCount): void {
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
  updateQuickReplyFilterCount(countObj): void {
    if (countObj) {
      this.tabFilterItems[this.tabFilterIdx].chips.forEach((chip) => {
        if (chip.value !== 'ALL') chip.total = countObj[chip.value];
      });
    }
  }

  /**
   * @function fetchDataFrom Returns an observable for the reservation list api call.
   * @param queries The filter list with date and hotel filters.
   * @param defaultProps The default table props to control data fetching.
   * @returns The observable with reservation list.
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
  loadData(event: LazyLoadEvent): void {
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
          this.setRecords(data);
        },
        ({ error }) => {
          this.loading = false;
          this.snackbarService
            .openSnackBarWithTranslate({
              translateKey: 'messages.error.some_thing_wrong',
              priorityMessage: error?.message,
            })
            .subscribe();
        }
      )
    );
  }

  /**
   * @function updatePaginations To update the pagination variable values.
   * @param event The lazy load event for the table.
   */
  updatePaginations(event): void {
    this.first = event.first;
    this.rowsPerPage = event.rows;
    this.tempFirst = this.first;
    this.tempRowsPerPage = this.rowsPerPage;
  }

  updatePaginationForFilterItems(pageEvent): void {
    this.tabFilterItems[this.tabFilterIdx].lastPage = pageEvent;
  }

  /**
   * @function customSort To sort the rows of the table.
   * @param event The event for sort click action.
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

  onSelectedTabFilterChange(event): void {
    this.tabFilterIdx = event.index;
    this.changePage(+this.tabFilterItems[event.index].lastPage);
  }

  onFilterTypeTextChange(value, field, matchMode = 'contains'): void {
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

  exportCSV(): void {
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
            `${this.tableName.toLowerCase()}_export_${new Date().getTime()}.csv`
          );
          this.loading = false;
        },
        ({ error }) => {
          this.loading = false;
          this.snackbarService
            .openSnackBarWithTranslate(
              {
                translateKey: 'messages.error.some_thing_wrong',
                priorityMessage: error?.message,
              },
              ''
            )
            .subscribe();
        }
      )
    );
  }

  toggleQuickReplyFilter(quickReplyTypeIdx, quickReplyType): void {
    if (quickReplyTypeIdx === 0) {
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

  openDetailPage(event, rowData?, tabKey?): void {
    event.stopPropagation();
    if (rowData) {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.width = '100%';
      const detailCompRef = this._modal.openDialog(
        DetailsComponent,
        dialogConfig
      );

      detailCompRef.componentInstance.guestId = rowData.id;
      detailCompRef.componentInstance.bookingNumber =
        rowData.booking.bookingNumber;
      tabKey && (detailCompRef.componentInstance.tabKey = tabKey);

      this.$subscription.add(
        detailCompRef.componentInstance.onDetailsClose.subscribe((res) => {
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
