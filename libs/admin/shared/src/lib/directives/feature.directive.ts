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
    const subscription = this.subscriptionService.getModuleSubscription();
    this.elementRef.nativeElement.style.display = get(
      subscription,
      ['modules', this.feature, 'active'],
      false
    )
      ? 'block'
      : 'none';
  }
}
