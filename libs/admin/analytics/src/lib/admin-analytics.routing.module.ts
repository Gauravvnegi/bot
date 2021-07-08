import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { AnalyticsComponent } from './components/analytics/analytics.component';
import { MessageAnalyticsComponent } from './components/message-analytics/message-analytics.component';
import { WhatsappMessageAnalyticsComponent } from './components/whatsapp-message-analytics/whatsapp-message-analytics.component';

const appRoutes: Route[] = [
  {
    path: '',
    component: AnalyticsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule],
})
export class AdminAnalyticsRoutingModule {
  static components = [
    AnalyticsComponent,
    MessageAnalyticsComponent,
    WhatsappMessageAnalyticsComponent,
  ];
}
