import { NgModule } from '@angular/core';
import { RouterModule, ROUTES } from '@angular/router';
import { SubscriptionPlanService } from '@hospitality-bot/admin/core/theme';
import {
  CRoutes,
  ModuleNames,
  routesFactory,
} from '@hospitality-bot/admin/shared';
import { MainComponent } from './components/main/main.component';
import { DynamicPricingComponent } from './components/dynamic-pricing/dynamic-pricing.component';
import { StepperComponent } from 'libs/admin/shared/src/lib/components/stepper/stepper.component';

const appRoutes: CRoutes = [
  {
    path: '',
    component: MainComponent,
    name: ModuleNames.REVENUE_MANAGER,
    children: [
      {
        path: 'dynamic-pricing',
        name: ModuleNames.REVENUE_DYNAMIC_PRICING,
        component: MainComponent,
        children: [
          {
            path: '',
            component: DynamicPricingComponent,
            name: ModuleNames.REVENUE_DYNAMIC_PRICING,
          },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild([])],
  providers: [
    {
      provide: ROUTES,
      useFactory: (subscriptionService: SubscriptionPlanService) =>
        routesFactory(appRoutes, [subscriptionService]),
      multi: true,
      deps: [SubscriptionPlanService],
    },
  ],
  exports: [RouterModule],
})
export class AdminRevenueMangerRoutingModule {
  static components = [MainComponent, DynamicPricingComponent];
}
