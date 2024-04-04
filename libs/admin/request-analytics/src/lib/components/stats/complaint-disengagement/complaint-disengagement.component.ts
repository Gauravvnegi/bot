import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from '../../../services/analytics.service';
import {
  AdminUtilityService,
  QueryConfig,
  getCalendarType,
} from '@hospitality-bot/admin/shared';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { DateService } from '@hospitality-bot/shared/utils';
import { Subscription } from 'rxjs';
import {
  ComplaintBreakDown,
  ComplaintCategoryBreakDownStats,
  DistributionStats,
} from '../../../models/complaint.analytics.model';
import { ComplaintBreakDownResponse } from '../../../types/response.types';

@Component({
  selector: 'complaint-disengagement',
  templateUrl: './complaint-disengagement.component.html',
  styleUrls: ['./complaint-disengagement.component.scss'],
})
export class ComplaintDisengagementComponent implements OnInit {
  $subscription = new Subscription();
  constructor(
    private analyticsService: AnalyticsService,
    private adminUtilityService: AdminUtilityService,
    private globalFilterService: GlobalFilterService,
    private dateService: DateService
  ) {}

  globalQueries;
  complaintBreakDownData: ComplaintBreakDown;

  labels: string[] = [];
  selectedInterval: string;
  ngOnInit(): void {
    this.listenForGlobalFilters();
  }

  distributionStats: DistributionStats;

  initGraphStats(): void {
    this.$subscription.add(
      this.analyticsService
        .getComplaintBreakDown(this.getQueryConfig())
        .subscribe((res) => {
          this.initLabels(res);
          this.complaintBreakDownData = new ComplaintBreakDown().deserialize(
            res
          );

          this.analyticsService.$complaintBreakDownStatsData.next(
            this.complaintBreakDownData
          );
        })
    );
  }

  handelBreakDownStat(index: number) {
    const config: QueryConfig = {
      params: this.adminUtilityService.makeQueryParams([
        ...this.globalQueries,
        {
          categoryName: this.complaintBreakDownData?.complaintCategoryStats
            ?.labels?.[index],
        },
      ]),
    };

    this.$subscription.add(
      this.analyticsService.getBreakDownStat(config).subscribe((res) => {
        this.distributionStats = new DistributionStats().deserialize(res);
      })
    );
  }

  listenForGlobalFilters(): void {
    this.globalFilterService.globalFilter$.subscribe((data) => {
      const calenderType = {
        calenderType: this.dateService.getCalendarType(
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
      params: this.adminUtilityService.makeQueryParams([
        ...this.globalQueries,
        { entityType: 'ALL' },
      ]),
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
