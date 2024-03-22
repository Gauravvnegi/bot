import { Component } from '@angular/core';
import { AnalyticsService } from '../../services/analytics.service';
import { Subscription } from 'rxjs';
import {
  AdminUtilityService,
  QueryConfig,
  getCalendarType,
} from '@hospitality-bot/admin/shared';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import {
  ComplaintBreakDown,
  ComplaintCategoryBreakDownStats,
  DistributionStats,
} from '../../models/complaint.analytics.model';
import { DateService } from '@hospitality-bot/shared/utils';
import { ComplaintBreakDownResponse } from '../../types/response.types';

@Component({
  selector: 'hospitality-bot-outlet-base',
  template: '',
})
export class ComplaintBaseComponent {
  $subscription = new Subscription();
  constructor(
    private analyticsService: AnalyticsService,
    private adminUtilityService: AdminUtilityService,
    private globalFilterService: GlobalFilterService,
    private dateService: DateService
  ) {}

  globalQueries;
  complaintBreakDownData: ComplaintBreakDown;
  distributionStatsData: DistributionStats;
  complaintCategoryBreakDownStats: ComplaintCategoryBreakDownStats;
  labels: string[] = [];
  selectedInterval: string;

  ngOnInit(): void {
    this.listenForGlobalFilters();
  }

  initGraphStats(): void {
    this.$subscription.add(
      this.analyticsService
        .getComplaintBreakDown(this.getQueryConfig())
        .subscribe((res) => {
          this.initLabels(res);
          this.complaintBreakDownData = new ComplaintBreakDown().deserialize(
            res
          );
          this.distributionStatsData = this.complaintBreakDownData.distributionStats;
          this.complaintCategoryBreakDownStats = this.complaintBreakDownData.complaintCategoryBreakDownStats;
        })
    );
  }

  listenForGlobalFilters(): void {
    this.globalFilterService.globalFilter$.subscribe((data) => {
      const calenderType = {
        calenderType: getCalendarType(
          data['dateRange'].queryValue[0].toDate,
          data['dateRange'].queryValue[1].fromDate,
          this.globalFilterService.timezone
        ),
      };
      this.selectedInterval = calenderType.calenderType;
      //set-global query every time global filter changes
      this.globalQueries = [
        ...data['filter'].queryValue,
        ...data['dateRange'].queryValue,
        calenderType,
      ];
      this.initGraphStats();
    });
  }

  getQueryConfig(): QueryConfig {
    const config = {
      params: this.adminUtilityService.makeQueryParams([...this.globalQueries]),
    };
    return config;
  }
  initLabels(data: ComplaintBreakDownResponse) {
    this.labels = [];
    Object.keys(
      data?.complaintsData?.closedComplaintsGraph.closedComplaintGraphStats
    ).forEach((key) => {
      this.labels.push(
        this.dateService.convertTimestampToLabels(
          this.selectedInterval,
          key,
          this.globalFilterService.timezone,
          this.adminUtilityService.getDateFormatFromInterval(
            this.selectedInterval
          ),
          this.selectedInterval === 'week'
            ? this.adminUtilityService.getToDate(this.globalQueries)
            : null
        )
      );
    });
  }

  ngOnDestroy() {
    this.$subscription.unsubscribe();
  }
}
