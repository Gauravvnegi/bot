import {
  AfterViewInit,
  ComponentFactoryResolver,
  Directive,
  Input,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { ModuleNames } from '@hospitality-bot/admin/shared';
import { SubscriptionPlanService } from 'apps/admin/src/app/core/theme/src/lib/services/subscription-plan.service';
import { UnsubscribeViewComponent } from '../components/unsubscribe-view/unsubscribe-view.component';

@Directive({ selector: '[isSubscribed]' })
export class SubscriptionDirective implements AfterViewInit {
  isModuleSubscribed = false;
  @Input() isSubscribed: ModuleNames;
  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private resolver: ComponentFactoryResolver,
    private subscriptionPlanService: SubscriptionPlanService
  ) {}

  getSubscriptionPlan() {
    this.isModuleSubscribed = this.subscriptionPlanService.checkModuleSubscription(
      this.isSubscribed
    );
    this.viewModule();
  }

  viewModule() {
    if (this.isModuleSubscribed) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      let factory = this.resolver.resolveComponentFactory(
        UnsubscribeViewComponent
      );
      this.viewContainer.createComponent(factory);
    }
  }

  ngAfterViewInit() {
    this.getSubscriptionPlan();
  }
}
