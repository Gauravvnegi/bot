import { Component, Input, OnInit } from '@angular/core';
import { Subscriptions } from '@hospitality-bot/admin/core/theme';
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
  constructor() {}

  ngOnInit(): void {
    this.setGraphSubscriptions();
  }

  setGraphSubscriptions() {
    this.featureData.features.MODULE.forEach((item) => {
      switch (item.name) {
        case 'FEEDBACK_TRANSACTIONAL':
          if (!this.graphSubscriptions.feedbackSubscribed)
            this.graphSubscriptions.feedbackSubscribed = item.active;
          break;
        case 'FEEDBACK':
          if (!this.graphSubscriptions.feedbackSubscribed)
            this.graphSubscriptions.feedbackSubscribed = item.active;
          break;
        case 'RESERVATION':
          this.graphSubscriptions.frontdeskSubscribed = item.active;
          break;
      }
    });
    this.graphSubscriptions.messagesSubscribed =
      this.featureData.features.CHANNELS.filter((item) => item.active).length >
      0;
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
