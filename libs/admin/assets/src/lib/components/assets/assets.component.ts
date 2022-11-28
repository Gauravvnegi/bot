import { Component, OnInit } from '@angular/core';
import { SubscriptionPlanService } from '@hospitality-bot/admin/core/theme';
import { ModuleNames } from '@hospitality-bot/admin/shared';

@Component({
  selector: 'hospitality-bot-assets',
  templateUrl: './assets.component.html',
  styleUrls: ['./assets.component.scss'],
})
export class AssetsComponent implements OnInit {
  unsubscribe;
  constructor(private subscriptionPlanService: SubscriptionPlanService) {}

  ngOnInit(): void {
    this.getSubscriptionPlan();
  }

  getSubscriptionPlan() {
    this.unsubscribe =
      this.checkSubscriptionByPath(
        ModuleNames.MARKETING,
        this.subscriptionPlanService.getSubscription()['features'].MODULE
      ).length ||
      this.checkSubscriptionByPath(
        ModuleNames.PACKAGES,
        this.subscriptionPlanService.getSubscription()['features'].MODULE
      ).length;
  }
  checkSubscriptionByPath(path, subscription) {
    return subscription.filter((d) => ModuleNames[d.name] === path && d.active);
  }
}
