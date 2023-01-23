import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import { SubscriptionPlanService } from 'apps/admin/src/app/core/theme/src/lib/services/subscription-plan.service';
import { get } from 'lodash';

@Directive({ selector: '[isFeatureSubscribed]' })
export class InternalSubscriptionDirective implements OnInit {
  isSubscribed: boolean;

  @Input() paths: string[];

  constructor(
    protected subscriptionService: SubscriptionPlanService,
    protected elementRef: ElementRef
  ) {}

  ngOnInit(): void {
    this.checkSubscription();
  }

  checkSubscription(): void {
    const subscription = this.subscriptionService.getProductSubscription();

    this.isSubscribed = this.paths
      .map((path) =>
        get(subscription, [...path.split('.'), 'isSubscribed'], false)
      )
      .reduce((prev, curr) => prev || curr, false);

    this.viewFeature();
  }

  viewFeature() {
    this.elementRef.nativeElement.style.display = this.isSubscribed
      ? 'block'
      : 'none';
  }
}
