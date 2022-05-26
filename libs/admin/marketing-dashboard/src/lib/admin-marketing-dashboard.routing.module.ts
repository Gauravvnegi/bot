import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { ChartsModule } from 'ng2-charts';
import { MarketingDashboardComponent } from './components/dashboard/dashboard.component';
import { RateGraphComponent } from './components/rate-graph/rate-graph.component';
import { SubscribersGraphComponent } from './components/subscribers-graph/subscribers-graph.component';

const appRoutes: Route[] = [
  { path: '', component: MarketingDashboardComponent },
];

@NgModule({
  imports: [RouterModule.forChild(appRoutes), ChartsModule],
  exports: [RouterModule],
  declarations: [],
})
export class AdminMarketingDashboardRoutingModule {
  static components = [
    RateGraphComponent,
    MarketingDashboardComponent,
    SubscribersGraphComponent,
  ];
}
