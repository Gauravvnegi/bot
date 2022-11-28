import { Component, OnInit } from '@angular/core';
import { SubscriptionPlanService } from 'apps/admin/src/app/core/theme/src/lib/services/subscription-plan.service';
import { ModuleNames } from 'libs/admin/shared/src/lib/constants/subscriptionConfig';

@Component({
  selector: 'hospitality-bot-topic',
  templateUrl: './topic.component.html',
  styleUrls: ['./topic.component.scss'],
})
export class TopicComponent implements OnInit {
  unsubscribe;
  constructor(private subscriptionPlanService: SubscriptionPlanService) {}

  ngOnInit(): void {
    this.getSubscriptionPlan();
  }

  getSubscriptionPlan() {
    this.unsubscribe = this.checkSubscriptionByPath(
      ModuleNames.MARKETING,
      this.subscriptionPlanService.getSubscription()['features'].MODULE
    );
  }
  checkSubscriptionByPath(path, subscription) {
    return subscription.filter((d) => ModuleNames[d.name] === path && d.active);
  }
}
