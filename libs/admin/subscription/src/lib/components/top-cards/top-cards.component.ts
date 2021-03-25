import { Component, Input, OnInit } from '@angular/core';
import { SubscriptionPlanService } from 'apps/admin/src/app/core/theme/src/lib/services/subscription-plan.service';
import { Subscription } from 'rxjs';
import { SubscriptionPlan } from '../../data-models/subscription.model';

@Component({
  selector: 'hospitality-bot-top-cards',
  templateUrl: './top-cards.component.html',
  styleUrls: ['./top-cards.component.scss'],
})
export class TopCardsComponent implements OnInit {
  private $subscription = new Subscription();
  data: SubscriptionPlan;
  constructor(private subscriptionService: SubscriptionPlanService) {}

  ngOnInit(): void {
    this.registerListeners();
  }

  registerListeners(): void {
    this.listenForSubscriptionPlan();
  }

  listenForSubscriptionPlan(): void {
    this.$subscription.add(
      this.subscriptionService.subscription$.subscribe((response) => {
        this.data = new SubscriptionPlan().deserialize(response);
      })
    );
  }
}
