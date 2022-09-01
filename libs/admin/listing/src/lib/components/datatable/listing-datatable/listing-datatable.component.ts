import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import {
  AdminUtilityService,
  BaseDatatableComponent,
  sharedConfig,
  TableService,
} from '@hospitality-bot/admin/shared';
import {
  SnackBarService,
  ModalService,
} from '@hospitality-bot/shared/material';
import {
  SelectedEntityState,
  EntityType,
  EntityState,
} from 'libs/admin/dashboard/src/lib/types/dashboard.type';
import { LazyLoadEvent, SortEvent } from 'primeng/api';
import { Observable, Subscription } from 'rxjs';
import { listingConfig } from '../../../constants/listing';
import { ListingService } from '../../../services/listing.service';
import { ListTable } from '../../../data-models/listing.model';
import * as FileSaver from 'file-saver';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'hospitality-bot-listing-datatable',
  templateUrl: './listing-datatable.component.html',
  styleUrls: [
    '../../../../../../shared/src/lib/components/datatable/datatable.component.scss',
    './listing-datatable.component.scss',
  ],
})
export class ListingDatatableComponent extends BaseDatatableComponent
  implements OnInit, OnDestroy {
  @Input() tableName = listingConfig.datatable.title;
  @Input() tabFilterItems = listingConfig.datatable.tabFilterItems;
  @Input() tabFilterIdx = 0;
  actionButtons = true;
  isQuickFilters = true;
  isTabFilters = true;
  isResizableColumns = true;
  isAutoLayout = false;
  isCustomSort = true;
  triggerInitialData = false;
  rowsPerPageOptions = [5, 10, 25, 50, 200];
  rowsPerPage = listingConfig.datatable.limit;
  cols = listingConfig.datatable.cols;
  hotelId: string;
  $subscription = new Subscription();

  constructor(
    public fb: FormBuilder,
    protected _adminUtilityService: AdminUtilityService,
    protected globalFilterService: GlobalFilterService,
    protected snackbarService: SnackBarService,
    protected _modal: ModalService,
    protected tabFilterService: TableService,
    protected router: Router,
    private route: ActivatedRoute,
    protected _translateService: TranslateService,
    private listingService: ListingService
  ) {
    super(fb, tabFilterService);
  }

  ngOnInit(): void {
    this.registerListeners();
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
        this.hotelId = this.globalFilterService.hotelId;
        this.loadInitialData([
          {
            order: sharedConfig.defaultOrder,
            entityType: this.tabFilterItems[this.tabFilterIdx].value,
          },
          ...this.getSelectedQuickReplyFilters(),
        ]);
      })
    );
  }

  /**
   * @function loadInitialData To load the initial data for datatable.
   * @param queries The filter list with date and hotel filters.
   * @param loading The loading status.
   * @param props The table props to control data fetching.
   */
  loadInitialData(
    queries = [],
    loading = true,
    props?: { offset: number; limit: number }
  ): void {
    this.loading = loading && true;
    this.$subscription.add(
      this.fetchDataFrom(queries, props).subscribe(
        (data) => {
          this.initialLoading = false;
          this.setRecords(data);
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

  /**
   * @function setRecords To set records after getting reponse from an api.
   * @param data The data is a response which comes from an api call.
   */
  setRecords(data): void {
    this.values = new ListTable().deserialize(data).records;
    this.totalRecords = data.total;
    data.entityTypeCounts &&
      this.updateTabFilterCount(data.entityTypeCounts, this.totalRecords);
    data.entityStateCounts &&
      this.updateQuickReplyFilterCount(data.entityStateCounts);
    this.loading = false;
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
  updateTabFilterCount(countObj: EntityType, currentTabCount: number): void {
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
  updateQuickReplyFilterCount(countObj: EntityState): void {
    if (countObj) {
      this.tabFilterItems[this.tabFilterIdx].chips.forEach((chip) => {
        chip.total = countObj[chip.value];
      });
    }
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
          {
            order: sharedConfig.defaultOrder,
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

    return this.listingService.getListings(config, this.hotelId);
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

  /**
   * @function customSort To sort the rows of the table.
   * @param eventThe The event for sort click action.
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
   * @function onSelectedTabFilterChange To handle the tab filter change.
   * @param event The material tab change event.
   */
  onSelectedTabFilterChange(event: MatTabChangeEvent): void {
    this.tabFilterIdx = event.index;
    this.changePage(+this.tabFilterItems[event.index].lastPage);
  }

  /**
   * @function onFilterTypeTextChange To handle the search for each column of the table.
   * @param value The value of the search field.
   * @param field The name of the field across which filter is done.
   * @param matchMode The mode by which filter is to be done.
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
   * @function exportCSV To export CSV report of the table.
   */
  exportCSV(): void {
    this.loading = true;

    const config = {
      queryObj: this._adminUtilityService.makeQueryParams([
        {
          order: sharedConfig.defaultOrder,
          entityType: this.tabFilterItems[this.tabFilterIdx].value,
        },
        ...this.getSelectedQuickReplyFilters(),
        ...this.selectedRows.map((item) => ({ ids: item.id })),
      ]),
    };
    this.$subscription.add(
      this.listingService.exportListings(this.hotelId, config).subscribe(
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
                translateKey: 'message.error.exportCSV_fail',
                priorityMessage: error.message,
              },
              ''
            )
            .subscribe();
        }
      )
    );
  }

  /**
   * @function toggleQuickReplyFilter To handle the chip click for a tab.
   * @param quickReplyTypeIdx The chip index.
   * @param quickReplyType The chip type.
   */
  toggleQuickReplyFilter(quickReplyTypeIdx: number, quickReplyType): void {
    //toggle isSelected
    if (quickReplyTypeIdx === 0) {
      this.tabFilterItems[this.tabFilterIdx].chips.forEach((chip) => {
        if (chip.value !== listingConfig.list.chipValue.all)
          chip.isSelected = false;
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
   * @function openCreateListing To navigate to create listing page.
   */
  openCreateListing() {
    this.router.navigate(['create'], { relativeTo: this.route });
  }

  /**
   * @function updateStatus To update status of a existing record.
   * @param event Active & InActive event check.
   * @param rowData The data of row for which status update action will be done.
   */
  updateStatus(event, rowData) {
    event.stopPropagation();
    this.$subscription.add(
      this.listingService
        .updateListStatus(this.hotelId, rowData.id, { status: event.checked })
        .subscribe(
          (response) => {
            this.snackbarService
              .openSnackBarWithTranslate(
                {
                  translateKey: 'message.success.listing_status_updated',
                  priorityMessage: `${rowData.name}'s status changed.`,
                },
                '',
                {
                  panelClass: 'success',
                }
              )
              .subscribe();
            this.changePage(this.currentPage);
          },
          ({ error }) => {
            this.snackbarService
              .openSnackBarWithTranslate(
                {
                  translateKey: 'message.error.listing_status_updated_fail',
                  priorityMessage: error.message,
                },
                ''
              )
              .subscribe();
          }
        )
    );
  }

  /**
   * @function openList To navigate to edit listing page.
   * @param event To stop openCreateList navigation.
   * @param id The id for which edit action will be done.
   */
  openList(event, id) {
    event.stopPropagation();
    this.router.navigate([`edit/${id}`], { relativeTo: this.route });
  }

  /**
   * @function listingConfiguration To return listingConfig object.
   * @returns ListingConfig object.
   */
  get listingConfiguration() {
    return listingConfig;
  }

  /**
   * @function ngOnDestroy To unsubscribe subscription.
   */
  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}
