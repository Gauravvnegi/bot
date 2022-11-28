import { Component, OnInit } from '@angular/core';
import { SubscriptionPlanService } from '@hospitality-bot/admin/core/theme';
import { ModuleNames } from '@hospitality-bot/admin/shared';

@Component({
  selector: 'hospitality-bot-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.scss'],
})
export class TemplateComponent implements OnInit {
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
