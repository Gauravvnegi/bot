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
import { SortEvent } from 'primeng/api/sortevent';
import { Observable, Subscription } from 'rxjs';
import { chips, guest, guestStatusDetails } from '../../../constants/guest';
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
  readonly guestStatusDetails = guestStatusDetails;

  actionButtons = true;
  isQuickFilters = true;
  isTabFilters = true;
  isResizableColumns = true;
  isAutoLayout = false;
  isCustomSort = true;
  triggerInitialData = false;
  entityId: string;
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
        this.entityId = this.globalFilterService.entityId;
        this.loadInitialData([
          ...this.globalQueries,
          {
            order: 'DESC',
            entityType: this.tabFilterItems[this.tabFilterIdx].value,
          },
          ...this.getSelectedQuickReplyFiltersV2(),
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
        },
        ({ error }) => {
          this.values = [];
          this.loading = false;
        }
      )
    );
  }

  /**
   * @function setRecords To set the data table records.
   * @param data The api response data.
   */
  setRecords(data): void {
    const guestData = new GuestTable().deserialize(data);
    this.values = guestData.records;
    this.initFilters(
      guestData.entityTypeCounts,
      guestData.entityStateCounts,
      guestData.totalRecord,
      this.guestStatusDetails
    );
    this.loading = false;
  }

  /**
   * @function fetchDataFrom Returns an observable for the reservation list api call.
   * @param queries The filter list with date and hotel filters.
   * @param defaultProps The default table props to control data fetching.
   * @returns The observable with reservation list.
   */
  fetchDataFrom(
    queries,
    defaultProps = { offset: this.first, limit: this.rowsPerPage, type: 'GUEST' }
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
  loadData(): void {
    this.loading = true;
    this.$subscription.add(
      this.fetchDataFrom(
        [
          ...this.globalQueries,
          {
            order: 'DESC',
            entityType: this.tabFilterItems[this.tabFilterIdx].value,
          },
          ...this.getSelectedQuickReplyFiltersV2(),
        ],
        { offset: this.first, limit: this.rowsPerPage, type: 'GUEST' }
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
        ...this.getSelectedQuickReplyFiltersV2(),
        ...this.selectedRows.map((item) => ({ ids: item.booking.bookingId })),
        { type: 'GUEST' }
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
          this.values = [];
          this.loading = false;
        }
      )
    );
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
              ...this.getSelectedQuickReplyFiltersV2(),
            ],
            false
          );
          detailCompRef.close();
        })
      );
    }
  }

  getStatusStyle(type: string, state: string): string {
    switch (type) {
      case 'INITIATED':
        return `status-${state}-initiated`;
      case 'PENDING':
        return `status-${state}-pending`;
      case 'FAILED':
        return `status-${state}-reject`;
      case 'COMPLETED':
        return `status-${state}-success`;
    }
  }

  ngOnDestroy() {
    this.$subscription.unsubscribe();
  }
}
