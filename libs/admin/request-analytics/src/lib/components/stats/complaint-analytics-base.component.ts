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
  DistributionStats,
} from '../../models/complaint.analytics.model';

@Component({
  selector: 'hospitality-bot-outlet-base',
  template: '',
})
export class ComplaintBaseComponent {
  $subscription = new Subscription();
  constructor(
    private analyticsService: AnalyticsService,
    private adminUtilityService: AdminUtilityService,
    private globalFilterService: GlobalFilterService
  ) {}

  globalQueries;
  complaintBreakDownData: ComplaintBreakDown;
  distributionStatsData: DistributionStats;

  ngOnInit(): void {
    this.listenForGlobalFilters();
    this.initGraphStats();
  }

  initGraphStats(): void {
    this.$subscription.add(
      this.analyticsService
        .getComplaintBreakDown(this.getQueryConfig())
        .subscribe((res) => {
          this.complaintBreakDownData = new ComplaintBreakDown().deserialize(
            res
          );
          this.distributionStatsData = this.complaintBreakDownData.distributionStats;
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
}
