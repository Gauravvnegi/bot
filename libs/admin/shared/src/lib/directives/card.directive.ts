import { Directive, Input, OnInit, ElementRef } from '@angular/core';
import { SubscriptionPlanService } from 'apps/admin/src/app/core/theme/src/lib/services/subscription-plan.service';
import { get } from 'lodash';

@Directive({ selector: '[cardSubscribed]' })
export class CardDirective implements OnInit {
  @Input() paths: any[];
  constructor(
    protected subscriptionService: SubscriptionPlanService,
    protected elementRef: ElementRef
  ) {}

  ngOnInit() {
    this.checkSubscription();
  }

  checkSubscription(): void {
    const subscription = this.subscriptionService.getModuleSubscription();
    this.paths = this.paths.map((path) => [
      'modules',
      ...path.split('.'),
      'active',
    ]);

    const subscribedStatus = this.paths.map((path) =>
      get(subscription, path, false)
    );

    this.elementRef.nativeElement.style.display =
      subscribedStatus.filter(Boolean).length === subscribedStatus.length
        ? 'block'
        : 'none';
  }
}
