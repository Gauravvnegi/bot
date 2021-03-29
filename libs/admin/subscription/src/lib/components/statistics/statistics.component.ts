import { Component, OnInit } from '@angular/core';
import { GlobalFilterService } from 'apps/admin/src/app/core/theme/src/lib/services/global-filters.service';
import { AdminUtilityService } from 'libs/admin/shared/src/lib/services/admin-utility.service';
import { SnackBarService } from 'libs/shared/material/src';
import { Subscription } from 'rxjs';
import {
  PlanUsage,
  PlanUsageCharts,
  SubscriptionPlan,
} from '../../data-models/subscription.model';
import { SubscriptionPlanService } from 'apps/admin/src/app/core/theme/src/lib/services/subscription-plan.service';

@Component({
  selector: 'hospitality-bot-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss'],
})
export class StatisticsComponent implements OnInit {
  $subscription = new Subscription();
  subscriptionPlanUsage;
  globalQueries;
  planUsageChartData: PlanUsageCharts;

  constructor(
    private _globalFilterService: GlobalFilterService,
    private adminUtilityService: AdminUtilityService,
    private subscriptionService: SubscriptionPlanService,
    private snackBarService: SnackBarService
  ) {}

  ngOnInit(): void {
    this.registerListeners();
  }

  registerListeners(): void {
    this.listenForGlobalFilters();
    this.listenForSubscriptionPlan();
  }

  listenForGlobalFilters(): void {
    this.$subscription.add(
      this._globalFilterService.globalFilter$.subscribe((data) => {
        this.globalQueries = [...data['dateRange'].queryValue];
        this.getSubscriptionUsage(data['filter'].queryValue[0].hotelId);
      })
    );
  }

  listenForSubscriptionPlan(): void {
    this.$subscription.add(
      this.subscriptionService.subscription$.subscribe((response) => {
        this.subscriptionPlanUsage = new PlanUsage().deserialize(response);
      })
    );
  }

  getSubscriptionUsage(hotelId: string): void {
    const config = {
      queryObj: this.adminUtilityService.makeQueryParams(this.globalQueries),
    };

    this.$subscription.add(
      this.subscriptionService.getSubscriptionUsage(hotelId, config).subscribe(
        (response) => {
          this.planUsageChartData = new PlanUsageCharts().deserialize(response);
          console.log(new PlanUsageCharts().deserialize(response));
        },
        ({ error }) => {
          this.snackBarService.openSnackBarAsText(error.message);
        }
      )
    );
  }
}
