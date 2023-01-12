import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import { ModuleNames } from '@hospitality-bot/admin/shared';
import { SubscriptionPlanService } from 'apps/admin/src/app/core/theme/src/lib/services/subscription-plan.service';

@Directive({ selector: '[featureSubscribed]' })
export class FeatureDirective implements OnInit {
  isActive = false;
  @Input() feature: ModuleNames;
  constructor(
    private subscriptionPlanService: SubscriptionPlanService,
    protected elementRef: ElementRef
  ) {}

  ngOnInit() {
    this.getSubscriptionPlan();
  }

  getSubscriptionPlan() {
    this.isActive = this.subscriptionPlanService.checkModuleSubscription(
      this.feature
    );
    this.viewModule();
  }

  viewModule() {
    this.elementRef.nativeElement.style.display = this.isActive
      ? 'block'
      : 'none';
  }
}
