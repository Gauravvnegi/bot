import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Router, ActivatedRoute } from '@angular/router';
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
  EntityType,
  EntityState,
  SelectedEntityState,
} from 'libs/admin/dashboard/src/lib/types/dashboard.type';
import { LazyLoadEvent, SortEvent } from 'primeng/api';
import { Observable, Subscription } from 'rxjs';
import { campaignConfig } from '../../../constant/campaign';
import { Campaigns } from '../../../data-model/campaign.model';
import * as FileSaver from 'file-saver';
import { CampaignService } from '../../../services/campaign.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'hospitality-bot-campaign-datatable',
  templateUrl: './campaign-datatable.component.html',
  styleUrls: [
    '../../../../../../shared/src/lib/components/datatable/datatable.component.scss',
    './campaign-datatable.component.scss',
  ],
})
export class CampaignDatatableComponent extends BaseDatatableComponent
  implements OnInit, OnDestroy {
  tableName = campaignConfig.datatable.title;
  @Input() tabFilterItems = campaignConfig.datatable.tabFilterItems;
  @Input() tabFilterIdx = 0;
  actionButtons = true;
  isQuickFilters = true;
  isTabFilters = true;
  isResizableColumns = true;
  isAutoLayout = false;
  isCustomSort = true;
  triggerInitialData = false;
  rowsPerPageOptions = [5, 10, 25, 50, 200];
  rowsPerPage = campaignConfig.rowsPerPage.rows;
  cols = campaignConfig.datatable.cols;
  globalQueries = [];
  $subscription = new Subscription();
  hotelId: string;
  constructor(
    public fb: FormBuilder,
    private adminUtilityService: AdminUtilityService,
    private globalFilterService: GlobalFilterService,
    protected _snackbarService: SnackBarService,
    protected tabFilterService: TableService,
    protected _modal: ModalService,
    private _router: Router,
    private route: ActivatedRoute,
    private campaignService: CampaignService,
    protected _translateService: TranslateService
  ) {
    super(fb, tabFilterService);
  }

  ngOnInit(): void {
    this.tabFilterItems = campaignConfig.datatable.tabFilterItems;
    this.listenForGlobalFilters();
  }

  /**
   * @function listenForGlobalFilters To listen for global filters and load data when filter value is changed.
   */
  listenForGlobalFilters(): void {
    this.globalFilterService.globalFilter$.subscribe((data) => {
      this.globalQueries = [
        ...data['filter'].queryValue,
        ...data['dateRange'].queryValue,
      ];
      this.getHotelId(this.globalQueries);
      this.loadInitialData([
        ...this.globalQueries,
        {
          order: sharedConfig.defaultOrder,
        },
        ...this.getSelectedQuickReplyFilters(),
      ]);
    });
  }

  /**
   * @function getHotelId To set the hotel id after extracting from filter array.
   * @param globalQueries The filter list with date and hotel filters.
   */
  getHotelId(globalQueries): void {
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
   */
  loadInitialData(queries = [], loading = true): void {
    this.loading = loading && true;
    this.$subscription.add(
      this.fetchDataFrom(queries).subscribe(
        (data) => this.setRecords(data),
        ({ error }) =>
          this.showMessage({ ...error, key: 'messages.error.loadData' }),
        () => (this.loading = false)
      )
    );
  }

  /**
   * @function setRecords To set the datatable records.
   * @param data Campaign list response data.
   */
  setRecords(data): void {
    this.values = new Campaigns().deserialize(data).records;
    this.totalRecords = data.total;
    data.entityTypeCounts &&
      this.updateTabFilterCount(data.entityTypeCounts, this.totalRecords);
    data.entityStateCounts &&
      this.updateQuickReplyFilterCount(data.entityStateCounts);
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
   * @function fetchDataFrom Returns an observable for the Campaign list api call.
   * @param queries The filter list with date and hotel filters.
   * @param defaultProps The default table props to control data fetching.
   * @returns The observable with Campaign list.
   */
  fetchDataFrom(
    queries,
    defaultProps = { offset: this.first, limit: this.rowsPerPage }
  ): Observable<any> {
    queries.push(defaultProps);
    const config = {
      queryObj: this.adminUtilityService.makeQueryParams(queries),
    };
    return this.campaignService.getHotelCampaign(config, this.hotelId);
  }

  /**
   * @function updateCampaignStatus update status of a Campaign record.
   * @param event active & inactive event check.
   * @param campaignId The campaign id for which status update action will be done.
   */
  updateCampaignStatus(event, campaignId: string): void {
    const data = {
      active: event.checked,
    };
    this.loading = true;
    this.$subscription.add(
      this.campaignService
        .updateCampaignStatus(this.hotelId, data, campaignId)
        .subscribe(
          (response) => {
            this.showMessage(
              {
                key: 'messages.success.status_updated',
                message: 'Status updated successfully',
              },
              'success'
            );
            this.changePage(this.currentPage);
          },
          ({ error }) =>
            this.showMessage({ ...error, key: 'messages.error.loadData' }),
          () => (this.loading = false)
        )
    );
  }

  /**
   * @function cloneCampaign function to clone campaign.
   * @param campaignId campaign id of a particular campaign.
   * @param data campaign data.
   */
  cloneCampaign(campaignId, data): void {
    this.loading = true;
    this.$subscription.add(
      this.campaignService
        .cloneCampaign(this.hotelId, data, campaignId)
        .subscribe(
          (response) => {
            this.showMessage(
              {
                key: 'messages.success.campaignCloned',
                message: 'Campaign Cloned',
              },
              'success'
            );
            this.changePage(this.currentPage);
          },
          ({ error }) => this.showMessage(error),
          () => (this.loading = false)
        )
    );
  }

  /**
   * @function archiveCampaign function to archive campaign.
   * @param campaignId campaign id of a particular campaign.
   * @param data campaign data.
   */
  archiveCampaign(campaignId, data): void {
    this.loading = true;
    this.$subscription.add(
      this.campaignService
        .archiveCampaign(this.hotelId, data, campaignId)
        .subscribe(
          (response) => {
            this.showMessage(
              {
                key: 'messages.success.campaignArchived',
                message: 'Campaign Archived.',
              },
              'success'
            );
            this.changePage(this.currentPage);
          },
          ({ error }) => this.showMessage({ ...error, key: '' }),
          () => (this.loading = false)
        )
    );
  }

  /**
   * @function openCreateCampaign to create campaign page.
   */
  openCreateCampaign(): void {
    this._router.navigate(['create'], { relativeTo: this.route });
  }

  /**
   * @function openCreateTemlplate navigate to edit campaign page.
   */
  openEditCampaign(campaign, event): void {
    event.stopPropagation();
    this._router.navigate(
      [`${campaign.isDraft ? 'edit' : 'view'}/${campaign.id}`],
      {
        relativeTo: this.route,
      }
    );
  }

  /**
   * @function handleDropdownClick function to handle dropdown.
   * @param event event object for stop propogation.
   */
  handleDropdownClick(event): void {
    event.stopPropagation();
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
          },
          ...this.getSelectedQuickReplyFilters(),
        ],
        {
          offset: this.first,
          limit: this.rowsPerPage,
        }
      ).subscribe(
        (data) => this.setRecords(data),
        ({ error }) => this.showMessage({ ...error, key: '' }),
        () => (this.loading = false)
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
  }

  /**
   * @function customSort To sort the rows of the table.
   * @param eventThe The event for sort click action.
   */
  customSort(event: SortEvent): void {
    const col = campaignConfig.datatable.cols.filter(
      (data) => data.field === event.field
    )[0];
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
      queryObj: this.adminUtilityService.makeQueryParams([
        ...this.globalQueries,
        {
          order: sharedConfig.defaultOrder,
        },
        ...this.getSelectedQuickReplyFilters(),
        ...this.selectedRows.map((item) => ({ ids: item.id })),
      ]),
    };
    this.$subscription.add(
      this.campaignService.exportCSV(this.hotelId, config).subscribe(
        (response) =>
          FileSaver.saveAs(
            response,
            `${this.tableName.toLowerCase()}_export_${new Date().getTime()}.csv`
          ),
        ({ error }) =>
          this.showMessage({ ...error, key: 'messages.error.exportCSV' }),
        () => (this.loading = false)
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
        if (chip.value !== campaignConfig.chipValue.all)
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
   * @function campaignConfiguration returns campaignConfig object.
   * @returns campaignConfig object.
   */
  get campaignConfiguration() {
    return campaignConfig;
  }

  /**
   * @function getStatsCampaignChips function to get stats campaign chips.
   * @param data campaign stats data.
   * @returns statsCampaign key object.
   */
  getStatsCampaignChips(data): string[] {
    return Object.keys(data.statsCampaign);
  }

  /**
   * @function showMessage To show the translated message.
   * @param messageObj The message object.
   */
  showMessage(messageObj, panelClass = 'danger'): void {
    this._snackbarService
      .openSnackBarWithTranslate(
        {
          translateKey: messageObj.key,
          priorityMessage: messageObj.message,
        },
        '',
        { panelClass }
      )
      .subscribe();
  }

  /**
   * @function ngOnDestroy to unsubscribe subscription.
   */
  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}
