import { Directive, Input, OnInit, ElementRef } from '@angular/core';
import { SubscriptionPlanService } from 'apps/admin/src/app/core/theme/src/lib/services/subscription-plan.service';

@Directive({ selector: '[channelSubscribed]' })
export class ChannelDirective implements OnInit {
  @Input() path: string;
  constructor(
    protected subscriptionService: SubscriptionPlanService,
    protected elementRef: ElementRef
  ) {}

  ngOnInit() {
    this.checkSubscription();
  }

  checkSubscription(): void {
    const subscription = this.subscriptionService.ChannelSubscription;
    let channel = subscription.filter((d) => d.name === this.path)[0];
    this.elementRef.nativeElement.style.display = channel.active
      ? 'block'
      : 'none';
  }
}