import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { ChartsModule } from 'ng2-charts';
import { MarketingDashboardComponent } from './components/dashboard/dashboard.component';

const appRoutes: Route[] = [
  { path: '', component: MarketingDashboardComponent },
];

@NgModule({
  imports: [RouterModule.forChild(appRoutes), ChartsModule],
  exports: [RouterModule],
})
export class AdminMarketingDashboardRoutingModule {
  static components = [];
}
