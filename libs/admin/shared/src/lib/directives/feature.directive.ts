import { Directive, Input, OnInit, ElementRef } from '@angular/core';
import { SubscriptionPlanService } from 'apps/admin/src/app/core/theme/src/lib/services/subscription-plan.service';
import { get } from 'lodash';

@Directive({ selector: '[featureSubscribed]' })
export class FeatureDirective implements OnInit {
  @Input() feature: string;
  constructor(
    protected subscriptionService: SubscriptionPlanService,
    protected elementRef: ElementRef
  ) {}

  ngOnInit() {
    this.checkSubscription();
  }

  checkSubscription(): void {
    this.feature += '.active';
    const subscription = this.subscriptionService.getModuleSubscription();
    console.log(get(subscription, this.feature.split('.')));
    this.elementRef.nativeElement.style.display = get(
      subscription,
      this.feature.split('.'),
      false
    )
      ? 'block'
      : 'none';
  }
}
