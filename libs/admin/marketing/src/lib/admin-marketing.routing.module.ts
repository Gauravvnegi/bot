import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { MarketingComponent } from './components/marketing/marketing.component';

const appRoutes: Route[] = [
  { path: '', redirectTo: 'dashboard' },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('@hospitality-bot/admin/marketing-dashboard').then(
        (m) => m.AdminMarketingDashboardModule
      ),
  },
  {
    path: 'campaign',
    loadChildren: () =>
      import('@hospitality-bot/admin/campaign').then(
        (m) => m.AdminCampaignModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule],
})
export class AdminMarketingRoutingModule {
  static components = [MarketingComponent];
}
