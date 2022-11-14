import { Component, OnInit } from '@angular/core';
import { SubscriptionPlanService } from '@hospitality-bot/admin/core/theme';
import { ModuleNames } from '@hospitality-bot/admin/shared';

@Component({
  selector: 'hospitality-bot-feedback-container',
  templateUrl: './feedback-container.component.html',
  styleUrls: ['./feedback-container.component.scss'],
})
export class FeedbackContainerComponent implements OnInit {
  unsubscribe;
  constructor(private subscriptionPlanService: SubscriptionPlanService) {}

  ngOnInit(): void {
    this.getSubscriptionPlan();
  }

  getSubscriptionPlan() {
    this.unsubscribe = this.checkSubscription(
      this.subscriptionPlanService.getSubscription()['features'].MODULE
    );
  }
  checkSubscription(subscription) {
    return subscription.filter(
      (d) =>
        (ModuleNames[d.name] === ModuleNames.FEEDBACK && d.active) ||
        (ModuleNames.FEEDBACK_TRANSACTIONAL === d.name && d.active)
    );
  }
}
