import { Directive, Input, OnInit, ElementRef } from '@angular/core';
import { SubscriptionPlanService } from 'apps/admin/src/app/core/theme/src/lib/services/subscription-plan.service';
import { get } from 'lodash';

@Directive({ selector: '[tableSubscribed]' })
export class TableDirective implements OnInit {
  @Input() paths: string;
  constructor(
    protected subscriptionService: SubscriptionPlanService,
    protected elementRef: ElementRef
  ) {}

  ngOnInit() {
    this.checkSubscription();
  }

  checkSubscription(): void {
    const subscription = this.subscriptionService.getModuleSubscription();
    let getPath = [...['modules'], ...this.paths.split('.'), ...['active']];
    this.elementRef.nativeElement.style.display = get(
      subscription,
      getPath,
      false
    )
      ? 'block'
      : 'none';
  }
}
