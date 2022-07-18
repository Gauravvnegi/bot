import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { ChartsModule } from 'ng2-charts';
import { MarketingDashboardComponent } from './components/dashboard/dashboard.component';
import { ContactStatsComponent } from './components/dashboard/stats/contact-stats/contact-stats.component';
import { RateGraphComponent } from './components/dashboard/stats/rate-graph/rate-graph.component';
import { StatsViewComponent } from './components/dashboard/stats/stats-view/stats-view.component';
import { SubscribersGraphComponent } from './components/dashboard/stats/subscribers-graph/subscribers-graph.component';

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
    StatsViewComponent,
    ContactStatsComponent,
    RateGraphComponent,
    MarketingDashboardComponent,
    SubscribersGraphComponent,
  ];
}
