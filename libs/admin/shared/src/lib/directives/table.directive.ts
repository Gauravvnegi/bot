import { Directive, Input, OnInit, ElementRef } from '@angular/core';
import { SubscriptionPlanService } from 'apps/admin/src/app/core/theme/src/lib/services/subscription-plan.service';
import { CardDirective } from './card.directive';

@Directive({ selector: '[tableSubscribed]' })
export class TableDirective extends CardDirective implements OnInit {
  @Input() path: string;
  constructor(
    protected subscriptionService: SubscriptionPlanService,
    protected elementRef: ElementRef
  ) {
    super(subscriptionService, elementRef);
  }
}
