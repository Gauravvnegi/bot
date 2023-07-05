import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscriptions } from 'apps/admin/src/app/core/theme/src/lib/data-models/subscription-plan-config.model';
import { GlobalFilterService } from 'apps/admin/src/app/core/theme/src/lib/services/global-filters.service';
import { SubscriptionPlanService } from 'apps/admin/src/app/core/theme/src/lib/services/subscription-plan.service';
import { AdminUtilityService } from 'libs/admin/shared/src/lib/services/admin-utility.service';
import { SnackBarService } from 'libs/shared/material/src';
import { forkJoin, Subscription } from 'rxjs';
import {
  PlanUsage,
  PlanUsageCharts,
  PlanUsagePercentage,
} from '../../data-models/subscription.model';

@Component({
  selector: 'hospitality-bot-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.scss'],
})
export class SubscriptionComponent implements OnInit, OnDestroy {
  welcomeMessage = 'Welcome To Subscription';
  navRoutes = [{ label: 'Subscription', link: './' }];
  $subscription = new Subscription();
  loading = false;
  subscriptionPlanUsage;
  globalQueries;
  entityId: string;
  subscriptionData;
  planUsageChartData;
  planUsagePercentage: PlanUsagePercentage;

  constructor(
    private globalFilterService: GlobalFilterService,
    private subscriptionService: SubscriptionPlanService,
    private adminUtilityService: AdminUtilityService,
    private snackbarService: SnackBarService
  ) {}

  ngOnInit(): void {
    this.registerListeners();
  }

  registerListeners(): void {
    this.listenForGlobalFilters();
  }

  /**
   * @function listenForGlobalFilters To listen for global filters and load data when filter value is changed.
   */
  listenForGlobalFilters(): void {
    this.$subscription.add(
      this.globalFilterService.globalFilter$.subscribe((data) => {
        this.entityId = data['filter'].queryValue[0].entityId;
        this.initSubscriptionPlan();
      })
    );
  }

  initSubscriptionPlan(): void {
    this.loading = true;
    this.subscriptionService.getSubscriptionPlan(this.entityId).subscribe(
      (response) => {
        this.loading = false;
        this.subscriptionData = new Subscriptions().deserialize(response);
        this.subscriptionPlanUsage = new PlanUsage().deserialize(
          this.subscriptionData
        );
        this.getSubscriptionUsage(this.entityId);
      }
    );
  }

  getSubscriptionUsage(entityId: string): void {
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
      forkJoin([
        // this.subscriptionService.getSubscriptionUsage(entityId, config),
        this.subscriptionService.getSubscriptionUsagePercentage(
          entityId,
          config
        ),
      ]).subscribe((response) => {
        this.loading = false;
        // this.planUsageChartData = new PlanUsageCharts().deserialize(
        //   response[0]
        // );
        this.planUsagePercentage = new PlanUsagePercentage().deserialize(
          response[0]
        );
      })
    );
  }

  getSubscriptionPlanUsagePercentage(entityId, config) {
    this.$subscription.add(
      this.subscriptionService
        .getSubscriptionUsagePercentage(entityId, config)
        .subscribe((response) => console.log(response))
    );
  }

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}
