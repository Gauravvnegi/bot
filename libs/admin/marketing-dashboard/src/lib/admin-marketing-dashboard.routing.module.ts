import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { ChartsModule } from 'ng2-charts';
import { MarketingDashboardComponent } from './components/dashboard/dashboard.component';
import { ContactStatsComponent } from './components/dashboard/stats/contact-stats/contact-stats.component';
import { StatsViewComponent } from './components/dashboard/stats/stats-view/stats-view.component';
import { ComparisonGraphComponent } from './components/dashboard/stats/comparison-graph/comparison-graph.component';

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
    MarketingDashboardComponent,
    ComparisonGraphComponent,
  ];
}
