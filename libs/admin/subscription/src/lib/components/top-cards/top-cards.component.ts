import { Component, Input, OnInit } from '@angular/core';
import { TechSupport } from 'libs/admin/shared/src/lib/constants/subscriptionConfig';
import { SubscriptionPlan } from '../../data-models/subscription.model';

@Component({
  selector: 'hospitality-bot-top-cards',
  templateUrl: './top-cards.component.html',
  styleUrls: ['./top-cards.component.scss'],
})
export class TopCardsComponent implements OnInit {
  @Input() featureData;
  techSupport = TechSupport;
  data: SubscriptionPlan;
  constructor() {}

  ngOnInit(): void {
    this.initSubscriptionPlan();
  }

  initSubscriptionPlan(): void {
    this.data = new SubscriptionPlan().deserialize(this.featureData);
  }
}
