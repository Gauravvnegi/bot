import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import {
  AdminUtilityService,
  BaseDatatableComponent,
  TableService,
  sharedConfig,
} from '@hospitality-bot/admin/shared';
import {
  ModalService,
  SnackBarService,
} from '@hospitality-bot/shared/material';
import { TranslateService } from '@ngx-translate/core';
import * as FileSaver from 'file-saver';
import { SelectedEntityState } from 'libs/admin/dashboard/src/lib/types/dashboard.type';
import { LazyLoadEvent, SortEvent } from 'primeng/api';
import { Observable, Subscription } from 'rxjs';
import { listingConfig } from '../../../constants/listing';
import { listingRoutes } from '../../../constants/routes';
import { ListTable } from '../../../data-models/listing.model';
import { ListingService } from '../../../services/listing.service';

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
  actionButtons = true;

  isResizableColumns = true;
  isAutoLayout = false;
  isCustomSort = true;
  isAllTabFilterRequired = true;
  triggerInitialData = false;
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
    this.selectedTab = this.listingService.selectedTab;
    this.$subscription.add(
      this.globalFilterService.globalFilter$.subscribe((data) => {
        this.hotelId = this.globalFilterService.hotelId;
        this.loadInitialData([
          {
            order: sharedConfig.defaultOrder,
            entityType: this.selectedTab,
          },
          ...this.getSelectedQuickReplyFiltersV2(),
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
          this.values = [];
          this.loading = false;
        }
      )
    );
  }

  /**
   * @function setRecords To set records after getting reponse from an api.
   * @param data The data is a response which comes from an api call.
   */
  setRecords(data): void {
    const ListingData = new ListTable().deserialize(data);
    this.values = ListingData.records;
    this.initFilters(
      ListingData.entityTypeCounts,
      ListingData.entityStateCounts,
      ListingData.total
    );
    this.loading = false;
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
            entityType: this.selectedTab,
          },
          ...this.getSelectedQuickReplyFiltersV2(),
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
   * @function exportCSV To export CSV report of the table.
   */
  exportCSV(): void {
    this.loading = true;

    const config = {
      queryObj: this._adminUtilityService.makeQueryParams([
        {
          order: sharedConfig.defaultOrder,
          entityType: this.selectedTab,
        },
        ...this.getSelectedQuickReplyFiltersV2(),
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
        }
      )
    );
  }

  /**
   * @function openCreateListing To navigate to create listing page.
   */
  openCreateListing() {
    this.router.navigate([listingRoutes.createListing.route], {
      relativeTo: this.route,
    });
  }

  /**
   * @function updateStatus To update status of a existing record.
   * @param event Active & InActive event check.
   * @param rowData The data of row for which status update action will be done.
   */
  updateStatus(status, rowData) {
    this.$subscription.add(
      this.listingService
        .updateListStatus(this.hotelId, rowData.id, { status: status })
        .subscribe(
          (_) => {
            this.loadInitialData();
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
          ({ error }) => {}
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
    this.router.navigate([listingRoutes.editListing.route.replace(':id', id)], {
      relativeTo: this.route,
    });
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
