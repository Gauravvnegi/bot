import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { ComingSoonComponent } from 'libs/admin/shared/src/lib/components/coming-soon/coming-soon.component';
import { ChartsModule } from 'ng2-charts';
import { MarketingDashboardComponent } from './components/dashboard/dashboard.component';
import { ContactStatsComponent } from './components/dashboard/stats/contact-stats/contact-stats.component';
import { StatsViewComponent } from './components/dashboard/stats/stats-view/stats-view.component';
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
    MarketingDashboardComponent,
    StatsViewComponent,
    ContactStatsComponent,
    RateGraphComponent,
    MarketingDashboardComponent,
    SubscribersGraphComponent,
  ];
}
