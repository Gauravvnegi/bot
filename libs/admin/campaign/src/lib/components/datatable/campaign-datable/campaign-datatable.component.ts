import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  GlobalFilterService,
  RoutesConfigService,
} from '@hospitality-bot/admin/core/theme';
import {
  AdminUtilityService,
  BaseDatatableComponent,
  NavRouteOption,
  sharedConfig,
} from '@hospitality-bot/admin/shared';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { TranslateService } from '@ngx-translate/core';
import * as FileSaver from 'file-saver';
import { LazyLoadEvent, MenuItem, SortEvent } from 'primeng/api';
import { Observable, Subscription } from 'rxjs';
import { campaignConfig } from '../../../constant/campaign';
import { Campaigns, Campaign } from '../../../data-model/campaign.model';
import { CampaignService } from '../../../services/campaign.service';
import { CampaignType, MessageObj } from '../../../types/campaign.type';
import { campaignStatus } from '../../../constants/response';
import { MenuOptions } from '../../../constants/camapign';

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
  campaignStatus = campaignStatus;
  actionButtons = true;
  isResizableColumns = true;
  isAutoLayout = false;
  isCustomSort = true;
  isAllTabFilterRequired = true;
  triggerInitialData = false;
  cols = campaignConfig.datatable.cols;
  globalQueries = [];
  $subscription = new Subscription();
  entityId: string;
  menuOptions = MenuOptions;
  navRoutes: NavRouteOption[] = [
    {
      label: 'Emark-it',
      link: './',
    },
  ];

  tableType: 'campaignType' | 'campaignDetails' = 'campaignType';

  campaignCta: MenuItem[] = [];

  constructor(
    public fb: FormBuilder,
    private adminUtilityService: AdminUtilityService,
    private globalFilterService: GlobalFilterService,
    protected snackbarService: SnackBarService,
    private router: Router,
    private route: ActivatedRoute,
    private campaignService: CampaignService,
    protected _translateService: TranslateService,
    private routesConfigService: RoutesConfigService
  ) {
    super(fb);
  }

  ngOnInit(): void {
    this.listenForGlobalFilters();
    this.initDetails();
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
      this.entityId = this.globalFilterService.entityId;
      this.loadInitialData([
        ...this.globalQueries,
        {
          order: sharedConfig.defaultOrder,
          entityType: this.selectedTab,
        },
        ...this.getSelectedQuickReplyFilters(),
      ]);
    });
  }

  initDetails() {
    this.campaignCta = [
      {
        label: 'Email',
        command: () => {
          this.openCreateCampaign('EMAIL');
        },
      },
      {
        label: 'Whatsapp',
        command: () => {
          this.openCreateCampaign('WHATSAPP');
        },
      },
    ];
  }

  setTableType(value: 'campaignType' | 'campaignDetails') {
    this.tableType = value;
    this.selectedTab = 'ALL';
    this.loadData();
  }

  /**
   * @function loadInitialData To load the initial data for datatable.
   * @param queries The filter list with date and hotel filters.
   * @param loading The loading status.
   */
  loadInitialData(queries = [], loading = true): void {
    this.loading = loading;
    this.$subscription.add(
      this.fetchDataFrom(queries).subscribe(
        (data) => this.setRecords(data),
        ({ error }) => {
          this.values = [];
          this.loading = false;
        }
      )
    );
  }

  /**
   * @function setRecords To set the datatable records.
   * @param data Campaign list response data.
   */
  setRecords(data: Record<string, any>): void {
    const modData = new Campaigns().deserialize(data);
    this.values = modData.records;
    let entityTypeCounts =
      this.tableType === 'campaignDetails'
        ? modData.entityTypeCounts
        : modData.entityChannelCounts;
    this.initFilters(
      entityTypeCounts,
      modData.entityStateCounts,
      modData.totalRecord,
      this.campaignStatus
    );
    this.loading = false;
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
    return this.campaignService.getHotelCampaign(config, this.entityId);
  }

  /**
   * @function updateCampaignStatus update status of a Campaign record.
   * @param event active & inactive event check.
   * @param campaignId The campaign id for which status update action will be done.
   */
  updateCampaignStatus(status: boolean, userData): void {
    const data = {
      active: status,
    };
    this.loading = true;
    this.$subscription.add(
      this.campaignService
        .updateCampaignStatus(this.entityId, data, userData.id)
        .subscribe(
          (_response) => {
            this.loadData();
            this.snackbarService.openSnackBarAsText(
              'Status changed successfully',
              '',
              {
                panelClass: 'success',
              }
            );
            this.changePage(this.currentPage);
          },
          ({ error }) => () => (this.loading = false)
        )
    );
  }

  /**
   * @function cloneCampaign function to clone campaign.
   * @param campaignId campaign id of a particular campaign.
   * @param data campaign data.
   */
  cloneCampaign(campaignId: string, data): void {
    this.loading = true;
    this.$subscription.add(
      this.campaignService
        .cloneCampaign(this.entityId, data, campaignId)
        .subscribe(
          (_response) => {
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
  archiveCampaign(campaignId: string, data): void {
    this.loading = true;
    this.$subscription.add(
      this.campaignService
        .archiveCampaign(this.entityId, data, campaignId)
        .subscribe(
          (_response) => {
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

  handleMenuClick(value: string, rowData): void {
    if (value === 'CLONE') {
      this.cloneCampaign(rowData.id, rowData);
    } else {
      this.archiveCampaign(rowData.id, rowData);
    }
  }

  /**
   * @function openCreateCampaign to create campaign page.
   */
  openCreateCampaign(campaignType: CampaignType): void {
    this.routesConfigService.navigate({
      additionalPath: 'create-campaign',
      queryParams: {
        campaignType: campaignType,
      },
    });
  }

  /**
   * @function openEditCampaign navigate to edit campaign page.
   */
  openEditCampaign(campaign: Campaign, event: MouseEvent): void {
    event.stopPropagation();
    this.routesConfigService.navigate({
      additionalPath: `edit-campaign/${campaign.id}`,
      queryParams: {
        campaignType: campaign.channel,
      },
    });
  }

  /**
   * @function handleDropdownClick function to handle dropdown.
   * @param event event object for stop propagation.
   */
  handleDropdownClick(event: MouseEvent): void {
    event.stopPropagation();
  }

  /**
   * @function loadData To load data for the table after any event.
   * @param event The lazy load event for the table.
   */
  loadData(): void {
    this.loading = true;
    // this.updatePaginations(event);

    let queryParams = [
      ...this.globalQueries,
      {
        order: sharedConfig.defaultOrder,
        entityType: this.selectedTab,
      },
      ...this.getSelectedQuickReplyFilters({ key: 'entityState' }),
    ];

    if (this.tableType === 'campaignType') {
      queryParams = queryParams.map((param) => {
        if (param.entityType) {
          return { ...param, channel: param.entityType, entityType: undefined };
        }
        return param;
      });
    }
    this.$subscription.add(
      this.fetchDataFrom(queryParams, {
        offset: this.first,
        limit: this.rowsPerPage,
      }).subscribe(
        (data) => this.setRecords(data),
        ({ error }) => {
          this.values = [];
          this.showMessage({ ...error, key: 'messages.error.fetch' });
        },
        () => (this.loading = false)
      )
    );
  }

  /**
   * @function updatePaginations To update the pagination variable values.
   * @param event The lazy load event for the table.
   */
  updatePaginations(event: LazyLoadEvent): void {
    this.first = event.first;
    this.rowsPerPage = event.rows;
  }

  /**
   * @function customSort To sort the rows of the table.
   * @param event The event for sort click action.
   */
  customSort(event: SortEvent): void {
    const col = campaignConfig.datatable.cols.find(
      (data) => data.field === event.field
    );

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
      queryObj: this.adminUtilityService.makeQueryParams([
        ...this.globalQueries,
        {
          order: sharedConfig.defaultOrder,
          entityType: this.selectedTab,
        },
        ...this.getSelectedQuickReplyFilters(),
        ...this.selectedRows.map((item) => ({ ids: item.id })),
      ]),
    };
    this.$subscription.add(
      this.campaignService.exportCSV(this.entityId, config).subscribe(
        (response) =>
          FileSaver.saveAs(
            response,
            `${this.tableName.toLowerCase()}_export_${new Date().getTime()}.csv`
          ),
        ({ error }) => (this.loading = false)
      )
    );
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
  getStatsCampaignChips(data: Campaign): string[] {
    return Object.keys(data.statsCampaign);
  }

  /**
   * @function showMessage To show the translated message.
   * @param messageObj The message object.
   */
  showMessage(messageObj: MessageObj, panelClass = 'error'): void {
    this.snackbarService
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
