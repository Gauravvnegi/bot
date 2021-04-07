import { Component, OnInit } from '@angular/core';
import { Subscriptions } from 'apps/admin/src/app/core/theme/src/lib/data-models/subscription-plan-config.model';
import { GlobalFilterService } from 'apps/admin/src/app/core/theme/src/lib/services/global-filters.service';
import { SubscriptionPlanService } from 'apps/admin/src/app/core/theme/src/lib/services/subscription-plan.service';
import { AdminUtilityService } from 'libs/admin/shared/src/lib/services/admin-utility.service';
import { SnackBarService } from 'libs/shared/material/src';
import { Subscription } from 'rxjs';
import {
  PlanUsage,
  PlanUsageCharts,
} from '../../data-models/subscription.model';

@Component({
  selector: 'hospitality-bot-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.scss'],
})
export class SubscriptionComponent implements OnInit {
  $subscription = new Subscription();
  loading: boolean = false;
  subscriptionPlanUsage;
  globalQueries;
  hotelId: string;
  subscriptionData;
  planUsageChartData;

  constructor(
    private _globalFilterService: GlobalFilterService,
    private subscriptionService: SubscriptionPlanService,
    private adminUtilityService: AdminUtilityService,
    private snackBarService: SnackBarService
  ) {}

  ngOnInit(): void {
    this.registerListeners();
  }

  registerListeners(): void {
    this.listenForGlobalFilters();
  }

  listenForGlobalFilters(): void {
    this.$subscription.add(
      this._globalFilterService.globalFilter$.subscribe((data) => {
        this.hotelId = data['filter'].queryValue[0].hotelId;
        this.initSubscriptionPlan();
      })
    );
  }

  initSubscriptionPlan(): void {
    this.loading = true;
    this.subscriptionService.getSubscriptionPlan(this.hotelId).subscribe(
      (response) => {
        this.loading = false;
        this.subscriptionData = new Subscriptions().deserialize(response);
        this.subscriptionPlanUsage = new PlanUsage().deserialize(
          this.subscriptionData
        );
        this.getSubscriptionUsage(this.hotelId);
      },
      ({ error }) => {
        this.snackBarService.openSnackBarAsText(error.message);
      }
    );
  }

  getSubscriptionUsage(hotelId: string): void {
    this.loading = true;
    const config = {
      queryObj: this.adminUtilityService.makeQueryParams([
        {
          from: this.subscriptionData.startDate,
          to: this.subscriptionData.endDate,
        },
      ]),
    };

    this.$subscription.add(
      this.subscriptionService.getSubscriptionUsage(hotelId, config).subscribe(
        (response) => {
          this.loading = false;
          this.planUsageChartData = new PlanUsageCharts().deserialize(response);
        },
        ({ error }) => {
          this.snackBarService.openSnackBarAsText(error.message);
        }
      )
    );
  }
}
