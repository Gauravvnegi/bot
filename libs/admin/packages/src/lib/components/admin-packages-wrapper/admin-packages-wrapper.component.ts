import { Component, OnInit } from '@angular/core';
import { SubscriptionPlanService } from '@hospitality-bot/admin/core/theme';
import {
  ModuleNames,
  TableNames,
} from 'libs/admin/shared/src/lib/constants/subscriptionConfig';

@Component({
  selector: 'hospitality-bot-admin-packages-wrapper',
  templateUrl: './admin-packages-wrapper.component.html',
  styleUrls: ['./admin-packages-wrapper.component.scss'],
})
export class AdminPackagesWrapperComponent implements OnInit {
  tables = TableNames;
  unsubscribe;
  constructor(private subscriptionPlanService: SubscriptionPlanService) {}

  ngOnInit(): void {
    this.getSubscriptionPlan();
  }

  getSubscriptionPlan() {
    this.unsubscribe = this.checkSubscriptionByPath(
      ModuleNames.PACKAGES,
      this.subscriptionPlanService.getSubscription()['features'].MODULE
    );
  }
  checkSubscriptionByPath(path, subscription) {
    return subscription.filter((d) => ModuleNames[d.name] === path && d.active);
  }
}
