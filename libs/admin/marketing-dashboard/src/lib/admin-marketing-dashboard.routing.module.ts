import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { ChartsModule } from 'ng2-charts';
import { MarketingDashboardComponent } from './components/dashboard/dashboard.component';
import { ContactStatsComponent } from './components/dashboard/stats/contact-stats/contact-stats.component';
import { StatsViewComponent } from './components/dashboard/stats/stats-view/stats-view.component';
import { ComparisonGraphComponent } from './components/dashboard/stats/comparison-graph/comparison-graph.component';
import { RecentCampaignComponent } from './components/dashboard/stats/recent-campaign/recent-campaign.component';
import { TotalVsNewContactsComponent } from './components/dashboard/stats/total-vs-new-contacts/total-vs-new-contacts.component';
import { ContactsComponent } from './components/dashboard/stats/contacts/contacts.component';
import { SentDeliveredReadComponent } from './components/dashboard/stats/sent-delivered-read/sent-delivered-read.component';
import { SubscribeVsUnsubscribeComponent } from './components/dashboard/stats/subscribe-vs-unsubscribe/subscribe-vs-unsubscribe.component';

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
    RecentCampaignComponent,
    TotalVsNewContactsComponent,
    ContactsComponent,
    SentDeliveredReadComponent,
    SubscribeVsUnsubscribeComponent,
  ];
}
