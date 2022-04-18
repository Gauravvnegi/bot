import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Router, ActivatedRoute } from '@angular/router';
import { GlobalFilterService } from 'apps/admin/src/app/core/theme/src/lib/services/global-filters.service';
import { AdminUtilityService } from 'libs/admin/shared/src/lib/services/admin-utility.service';
import * as FileSaver from 'file-saver';

import {
  BaseDatatableComponent,
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
import { assetConfig } from '../../constants/asset';
import { AssetService } from '../../../services/asset.service';
import { Assets } from '../../../data-models/assetConfig.model';

@Component({
  selector: 'hospitality-bot-asset-datatable',
  templateUrl: './asset-datatable.component.html',
  styleUrls: [
    '../../../../../../shared/src/lib/components/datatable/datatable.component.scss',
    './asset-datatable.component.scss',
  ],
})
export class AssetDatatableComponent extends BaseDatatableComponent
  implements OnInit {
  @Input() tableName = 'Asset';
  @Input() tabFilterItems;
  @Input() tabFilterIdx: number = 0;
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
  // cols=assetConfig.datatable.cols;

  cols = [
    { field: 'name', header: 'Name', sortType: 'string', isSort: true },
    {
      field: 'description',
      header: 'Description',
      sortType: 'string',
      isSort: true,
    },
    { field: 'type', header: 'Type', sortType: 'string', isSort: true },
    { field: 'url', header: 'url', sortType: 'string', isSort: true },
    { field: 'active', header: 'Active', isSort: false },
  ];

  constructor(
    private _router: Router,
    private route: ActivatedRoute,
    public fb: FormBuilder,
    private adminUtilityService: AdminUtilityService,
    private globalFilterService: GlobalFilterService,
    protected _snackbarService: SnackBarService,
    protected _modal: ModalService,
    protected tabFilterService: TableService,
    private assetService: AssetService
  ) {
    super(fb, tabFilterService);
  }

  copyToClipboard(input){
    input.select();
    document.execCommand('copy');
    input.setSelectRange(0,0);
  }


  ngOnInit(): void {
    this.tabFilterItems = assetConfig.datatable.tabFilterItems;
    this.listenForGlobalFilters();
  }

  listenForGlobalFilters(): void {
    this.globalFilterService.globalFilter$.subscribe((data) => {
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
        },
      ]);
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

/**
 * 
 * @param queries 
 * @param loading 
 * Loading Data
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
          this.loading = false;
          this._snackbarService.openSnackBarAsText(error.message);
        }
      )
    );
  }


/**
 * 
 * @param queries 
 * @param defaultProps 
 * @returns hotel id
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
            order: 'DESC',
          },
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
          this.loading = false;
          this._snackbarService.openSnackBarAsText(error.message);
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
      let field =
        event.field[event.field.length - 1] === ')'
          ? event.field.substring(0, event.field.lastIndexOf('.') || 0)
          : event.field;
      event.data.sort((data1, data2) =>
        this.sortOrder(event, field, data1, data2, col)
      );
    }


  /**
   * @function getSelectedQuickReplyFilters To return the selected chip list
   * @returns The selected chips.
   */
  getSelectedQuickReplyFilters(): SelectedEntityState[] {
    return this.tabFilterItems[this.tabFilterIdx].chips
      .filter((item) => item.isSelected == true)
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
            order: 'DESC',
          },
          ...this.selectedRows.map((item) => ({ ids: item.id })),
        ]),
      };
      this.$subscription.add(
        this.assetService.exportCSV(config,this.hotelId).subscribe(
          (res) => {
            FileSaver.saveAs(
              res,
              `${this.tableName.toLowerCase()}_export_${new Date().getTime()}.csv`
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
   *
   * @param event
   * @param assetId
   * updating asset status on active and deactive
   */
   updateAssetStatus(event, assetId): void {
    let data = {
      active: event.checked,
    };
    this.assetService.updateAssetStatus(this.hotelId, data, assetId).subscribe(
      (response) => {
        this._snackbarService.openSnackBarAsText(
          'Status updated successfully',
          '',
          { panelClass: 'success' }
        );
        this.changePage(this.currentpage);
      },
      ({ error }) => {
        this._snackbarService.openSnackBarAsText(error.message);
      }
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
   * @function toggleQuickReplyFilter To handle the chip click for a tab.
   * @param quickReplyTypeIdx The chip index.
   * @param quickReplyType The chip type.
   */
  toggleQuickReplyFilter(quickReplyTypeIdx: number, quickReplyType): void {
    //toggle isSelected
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

  get assetConfiguration() {
    return assetConfig;
  }

  openCreateAsset() {
    this._router.navigate(['create'], { relativeTo: this.route });
  }

  openAssetDetails(amenity): void {
    this._router.navigate([`edit/${amenity.id}`], { relativeTo: this.route });
  }

  /**
   *
   * @param queries
   * @param defaultProps
   * @returns hotel id
   * fetching hotel id data from api
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

  updateQuickReplyFilterCount(countObj: EntityState): void {
    if (countObj) {
      this.tabFilterItems[this.tabFilterIdx].chips.forEach((chip) => {
        chip.total = countObj[chip.value];
      });
    }
  }


  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }

}
