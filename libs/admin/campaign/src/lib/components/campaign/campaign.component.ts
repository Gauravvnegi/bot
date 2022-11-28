import { Component, OnInit } from '@angular/core';
import { SubscriptionPlanService } from '@hospitality-bot/admin/core/theme';
import { ModuleNames } from '@hospitality-bot/admin/shared';

@Component({
  selector: 'hospitality-bot-campaign',
  templateUrl: './campaign.component.html',
  styleUrls: ['./campaign.component.scss'],
})
export class CampaignComponent implements OnInit {
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
