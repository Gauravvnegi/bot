import { NgModule } from '@angular/core';
import { RouterModule, ROUTES } from '@angular/router';
import { SubscriptionPlanService } from '@hospitality-bot/admin/core/theme';
import {
  CRoutes,
  ModuleNames,
  routesFactory,
} from '@hospitality-bot/admin/shared';
import { MarketingComponent } from './components/marketing/marketing.component';

const appRoutes: CRoutes = [
  { path: '', redirectTo: 'analytics' },
  {
    path: 'analytics',
    name: ModuleNames.EMARK_IT_DASHBOARD,
    loadChildren: () =>
      import('@hospitality-bot/admin/marketing-dashboard').then(
        (m) => m.AdminMarketingDashboardModule
      ),
  },
  {
    path: 'campaign',
    name: ModuleNames.CAMPAIGN,
    loadChildren: () =>
      import('@hospitality-bot/admin/campaign').then(
        (m) => m.AdminCampaignModule
      ),
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
export class AdminMarketingRoutingModule {
  static components = [MarketingComponent];
}
