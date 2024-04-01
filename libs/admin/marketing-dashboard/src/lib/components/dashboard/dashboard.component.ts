import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  GlobalFilterService,
  SubscriptionPlanService,
} from '@hospitality-bot/admin/core/theme';
import {
  AdminUtilityService,
  PermissionModuleNames,
  ProductNames,
  QueryConfig,
  StatCard,
} from '@hospitality-bot/admin/shared';
import { DateService } from '@hospitality-bot/shared/utils';
import { Subscription } from 'rxjs';
import { eMarketTabFilterOptions } from '../../constants/emarket-stats.constants';
import { MarketingService } from '../../services/stats.service';
import { dashboardConfig } from '../constants/dashboard';
import { GraphData } from '../types/stats';
import { EMarketStatsResponse } from '../types/campaign.response.type';

@Component({
  selector: 'hospitality-bot-marketing-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class MarketingDashboardComponent implements OnInit, OnDestroy {
  welcomeMessage = 'Welcome To your dashboard';
  navRoutes = [{ label: 'eMark-IT Dashboard', link: './' }];
  eMarketStatsData: EMarketStatsResponse;
  $subscription = new Subscription();
  entityId: string;
  labels: string[] = [];
  selectedTabIndex: number = 0;
  tabOptions = eMarketTabFilterOptions;

  config: any;
  loading = false;
  globalQueries;
  globalQueryConfig: QueryConfig;

  selectedInterval: string;

  constructor(
    private _adminUtilityService: AdminUtilityService,
    private globalFilterService: GlobalFilterService,
    private dateService: DateService,
    public statsService: MarketingService,
    private subscriptionPlanService: SubscriptionPlanService
  ) {}

  ngOnInit(): void {
    //check for permission
    this.tabOptions.forEach((option) => {
      if (
        !this.subscriptionPlanService.checkViewPermission(option.moduleName)
      ) {
        this.tabOptions = this.tabOptions.filter(
          (item) => item.value !== option.value
        );
      }
    });

    this.listenForGlobalFilters();
  }

  onTabFilterChange(event) {
    this.selectedTabIndex = event.index;
    this.getComplaintStats();
  }

  /**
   * @function listenForGlobalFilters To listen for global filters.
   */
  listenForGlobalFilters(): void {
    this.$subscription.add(
      this.globalFilterService.globalFilter$.subscribe((data) => {
        const calenderType = {
          calenderType: this.dateService.getCalendarType(
            data['dateRange'].queryValue[0].toDate,
            data['dateRange'].queryValue[1].fromDate,
            this.globalFilterService.timezone
          ),
        };

        this.selectedInterval = calenderType.calenderType;

        this.globalQueries = [
          ...data['filter'].queryValue,
          ...data['dateRange'].queryValue,
          calenderType,
        ];

        this.entityId = this.globalFilterService.entityId;
        this.getComplaintStats();
      })
    );
  }

  getQueryConfig(): QueryConfig {
    return {
      params: this._adminUtilityService.makeQueryParams([
        ...this.globalQueries,
        {
          channel: this.tabOptions[this.selectedTabIndex].value,
        },
      ]),
    };
  }

  getComplaintStats() {
    this.globalQueryConfig = this.getQueryConfig();
    this.$subscription.add(
      this.statsService
        .getEMarketStats(this.entityId, this.globalQueryConfig)
        .subscribe((res) => {
          this.eMarketStatsData = res;
          this.initLabels(res.deliveredEventStats);
        })
    );
  }

  initLabels(data: { [key: string]: number }) {
    this.labels = [];

    Object.keys(data).forEach((key) => {
      this.labels.push(
        this.dateService.convertTimestampToLabels(
          this.selectedInterval,
          key,
          this.globalFilterService.timezone,
          this._adminUtilityService.getDateFormatFromInterval(
            this.selectedInterval
          ),
          this.selectedInterval === 'week'
            ? this._adminUtilityService.getToDate(this.globalQueries)
            : null
        )
      );
    });
  }

  handleError = ({ error }) => {
    this.loading = false;
  };

  /**
   * @function ngOnDestroy to unsubscribe subscription
   */
  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}
