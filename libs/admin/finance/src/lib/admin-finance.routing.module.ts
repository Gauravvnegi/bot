import { NgModule } from '@angular/core';
import { RouterModule, ROUTES } from '@angular/router';
import { SubscriptionPlanService } from '@hospitality-bot/admin/core/theme';
import {
  CRoutes,
  ModuleNames,
  routesFactory,
} from '@hospitality-bot/admin/shared';
import { FinanceComponent } from './components/finance/finance.component';

const appRoutes: CRoutes = [
  {
    path: '',
    name: ModuleNames.FINANCE,
    component: FinanceComponent,
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
export class AdminFinanceRoutingModule {
  static components = [FinanceComponent];
}
