import { Component, Input, OnInit } from '@angular/core';
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
import { Subscriptions } from 'apps/admin/src/app/core/theme/src/lib/data-models/subscription-plan-config.model';

@Component({
  selector: 'hospitality-bot-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss'],
})
export class StatisticsComponent implements OnInit {
  @Input() subscriptionPlanUsage;
  @Input() planUsageChartData: PlanUsageCharts;
  @Input() featureData;

  constructor() {}

  ngOnInit(): void {}
}
