import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Router, ActivatedRoute } from '@angular/router';
import { GlobalFilterService } from 'apps/admin/src/app/core/theme/src/lib/services/global-filters.service';
import { AdminUtilityService } from 'libs/admin/shared/src/lib/services/admin-utility.service';
import * as FileSaver from 'file-saver';

import {
  BaseDatatableComponent,
  Chip,
  sharedConfig,
  TableService,
} from '@hospitality-bot/admin/shared';
import { SnackBarService } from '@hospitality-bot/shared/material';
import {
  SelectedEntityState,
  EntityType,
  EntityState,
} from 'libs/admin/dashboard/src/lib/types/dashboard.type';
import { LazyLoadEvent, SortEvent } from 'primeng/api';
import { Observable, Subscription } from 'rxjs';
import { assetConfig } from '../../../constants/asset';
import { AssetService } from '../../../services/asset.service';
import { Assets } from '../../../data-models/assetConfig.model';
import { TranslateService } from '@ngx-translate/core';
import { AssetsRoutes } from '../../../constants/routes';

@Component({
  selector: 'hospitality-bot-asset-datatable',
  templateUrl: './asset-datatable.component.html',
  styleUrls: [
    '../../../../../../shared/src/lib/components/datatable/datatable.component.scss',
    './asset-datatable.component.scss',
  ],
})
export class AssetDatatableComponent extends BaseDatatableComponent
  implements OnInit, OnDestroy {
  tableName = assetConfig.datatable.title;
  @Input() tabFilterItems;
  @Input() tabFilterIdx = 0;
  actionButtons = true;
  isQuickFilters = true;
  isTabFilters = true;
  isResizableColumns = true;
  isAutoLayout = false;
  isCustomSort = true;
  triggerInitialData = false;
  rowsPerPageOptions = [5, 10, 25, 50, 200];
  rowsPerPage = 5;
  globalQueries = [];
  $subscription = new Subscription();
  hotelId: any;

  cols = assetConfig.datatable.cols;

  constructor(
    private _router: Router,
    private route: ActivatedRoute,
    public fb: FormBuilder,
    private adminUtilityService: AdminUtilityService,
    private globalFilterService: GlobalFilterService,
    protected snackbarService: SnackBarService,
    protected tabFilterService: TableService,
    private assetService: AssetService,
    protected _translateService: TranslateService
  ) {
    super(fb, tabFilterService);
  }

  ngOnInit(): void {
    this.tabFilterItems = assetConfig.datatable.tabFilterItems;
    this.listenForGlobalFilters();
  }

  /**
   * @function listenForGlobalFilters To listen for global filters and load data when filter value is changed.
   */
  listenForGlobalFilters(): void {
    this.globalFilterService.globalFilter$.subscribe((data) => {
      //set-global query everytime global filter changes
      this.globalQueries = [
        ...data['filter'].queryValue,
        ...data['dateRange'].queryValue,
      ];
      this.hotelId = this.globalFilterService.hotelId;
      //fetch-api for records
      this.loadInitialData([
        ...this.globalQueries,
        {
          order: sharedConfig.defaultOrder,
          entityType: this.tabFilterItems[this.tabFilterIdx].value,
        },
        ...this.getSelectedQuickReplyFilters(),
      ]);
    });
  }

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
          this.values = new Assets().deserialize(data).records;
          //set pagination
          this.totalRecords = data.total;
          data.entityTypeCounts &&
            this.updateTabFilterCount(data.entityTypeCounts, this.totalRecords);
          data.entityStateCounts &&
            this.updateQuickReplyFilterCount(data.entityStateCounts);
          this.loading = false;
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
    queries.push(defaultProps);
    const config = {
      queryObj: this.adminUtilityService.makeQueryParams(queries),
    };
    return this.assetService.getHotelAsset(config, this.hotelId);
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
            order: sharedConfig.defaultOrder,
            entityType: this.tabFilterItems[this.tabFilterIdx].value,
          },
          ...this.getSelectedQuickReplyFilters(),
        ],
        {
          offset: this.first,
          limit: this.rowsPerPage,
        }
      ).subscribe(
        (data) => {
          this.values = new Assets().deserialize(data).records;
          //set pagination
          this.totalRecords = data.total;
          data.entityTypeCounts &&
            this.updateTabFilterCount(data.entityTypeCounts, this.totalRecords);
          data.entityStateCounts &&
            this.updateQuickReplyFilterCount(data.entityStateCounts);
          this.loading = false;
        },
        ({ error }) => {
          this.values = [];
          this.loading = false;
        }
      )
    );
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
   * @function getSelectedQuickReplyFilters To return the selected chip list.
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
   * @function updatePaginations To update the pagination variable values.
   * @param event The lazy load event for the table.
   */
  updatePaginations(event): void {
    this.first = event.first;
    this.rowsPerPage = event.rows;
  }

  /**
   * @function exportCSV To export CSV report of the table.
   */
  exportCSV(): void {
    this.loading = true;

    const config = {
      queryObj: this.adminUtilityService.makeQueryParams([
        ...this.globalQueries,
        {
          order: sharedConfig.defaultOrder,
        },
        ...this.selectedRows.map((item) => ({ ids: item.id })),
      ]),
    };
    this.$subscription.add(
      this.assetService.exportCSV(config, this.hotelId).subscribe(
        (res) => {
          FileSaver.saveAs(
            res,
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
   * @function updateAssetStatus updating active and inactive status of form fields.
   * @param assetId Id of the asset being updated.
   * @param event active and inactive event check.
   */
  updateAssetStatus(event, assetId): void {
    const data = {
      active: event.checked,
    };
    this.assetService.updateAssetStatus(this.hotelId, data, assetId).subscribe(
      (response) => {
        this.snackbarService
          .openSnackBarWithTranslate(
            {
              translateKey: 'message.success.asset_status_updated',
              priorityMessage: 'Status Updated Successfully.',
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
   * @function assetConfiguration return asset config object.
   * @return assetConfig object.
   */
  get assetConfiguration() {
    return assetConfig;
  }

  /**
   * @function openCreateAsset navigate to create Asset form.
   */
  openCreateAsset() {
    this._router.navigate([AssetsRoutes.createAssets.route], {
      relativeTo: this.route,
    });
  }

  /**
   * @function openAssetDetails navigating to edit asset page.
   * @param event event object for stopping propogation.
   * @param asset The asset for which edit action will be done.
   */
  openAssetDetails(asset, event): void {
    event.stopPropagation();
    this._router.navigate(
      [AssetsRoutes.editAssets.route.replace(':id', asset.id)],
      {
        relativeTo: this.route,
      }
    );
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
   * @function handleCopyToClipboard handling copy to clipboard functionality of urls.
   * @param event event object for stoping propagation.
   */
  handleCopyToClipboard(event) {
    event.stopPropagation();
    this.snackbarService
      .openSnackBarWithTranslate(
        {
          translateKey: 'message.success.asset_url',
          priorityMessage: 'Asset Url Copied.',
        },
        '',
        {
          panelClass: 'success',
        }
      )
      .subscribe();
  }

  /**
   * @function ngOnDestroy unsubscribe subscriiption
   */
  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}
