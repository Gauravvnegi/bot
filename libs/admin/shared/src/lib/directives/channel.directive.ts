import { Directive, Input, OnInit, ElementRef } from '@angular/core';
import { SubscriptionPlanService } from 'apps/admin/src/app/core/theme/src/lib/services/subscription-plan.service';

@Directive({ selector: '[channelSubscribed]' })
export class ChannelDirective implements OnInit {
  @Input() paths: string;
  constructor(
    protected subscriptionService: SubscriptionPlanService,
    protected elementRef: ElementRef
  ) {}

  ngOnInit() {
    this.checkSubscription();
  }

  checkSubscription(): void {
    const subscription = this.subscriptionService.ChannelSubscription;
    const channel = subscription.filter((d) => d.name === this.paths);
    this.elementRef.nativeElement.style.display =
      channel.length && channel[0].active ? 'block' : 'none';
  }
}
