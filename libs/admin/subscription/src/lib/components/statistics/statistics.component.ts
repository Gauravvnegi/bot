import { Component, Input, OnInit } from '@angular/core';
import {
  SubscriptionPlanService,
  Subscriptions,
} from '@hospitality-bot/admin/core/theme';
import { ModuleNames } from '@hospitality-bot/admin/shared';
import {
  PlanUsageCharts,
  PlanUsagePercentage,
} from '../../data-models/subscription.model';

@Component({
  selector: 'hospitality-bot-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss'],
})
export class StatisticsComponent implements OnInit {
  @Input() subscriptionPlanUsage;
  @Input() planUsageChartData: PlanUsageCharts;
  @Input() featureData: Subscriptions;
  @Input() planUsagePercentage: PlanUsagePercentage;
  graphSubscriptions = {
    feedbackSubscribed: false,
    messagesSubscribed: false,
    frontdeskSubscribed: false,
  };
  graphOrder = {
    frontdesk: -1,
    feedback: -1,
    message: -1,
  };
  constructor(private subscriptionService: SubscriptionPlanService) {}

  ngOnInit(): void {
    this.setGraphSubscriptions();
  }

  setGraphSubscriptions() {
    this.graphSubscriptions.feedbackSubscribed =
      this.subscriptionService.checkModuleSubscription(
        ModuleNames.FEEDBACK_TRANSACTIONAL
      ) ||
      this.subscriptionService.checkModuleSubscription(ModuleNames.FEEDBACK);

    this.graphSubscriptions.frontdeskSubscribed = this.subscriptionService.checkModuleSubscription(
      ModuleNames.FRONT_DESK
    );

    this.graphSubscriptions.messagesSubscribed = this.subscriptionService.checkModuleSubscription(
      ModuleNames.FREDDIE
    );

    this.setGraphOrder();
  }

  setGraphOrder() {
    if (this.graphSubscriptions.frontdeskSubscribed) {
      this.graphOrder.frontdesk = 0;
      if (this.graphSubscriptions.feedbackSubscribed) {
        this.graphOrder.feedback = 1;
        if (this.graphSubscriptions.messagesSubscribed)
          this.graphOrder.message = 2;
      } else if (this.graphSubscriptions.messagesSubscribed)
        this.graphOrder.message = 1;
    } else if (this.graphSubscriptions.feedbackSubscribed) {
      this.graphOrder.feedback = 0;
      if (this.graphSubscriptions.messagesSubscribed)
        this.graphOrder.message = 1;
    } else if (this.graphSubscriptions.messagesSubscribed)
      this.graphOrder.message = 0;
  }
}
