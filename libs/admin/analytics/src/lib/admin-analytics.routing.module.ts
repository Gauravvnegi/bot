import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { AnalyticsComponent } from './components/analytics/analytics.component';
import { ConversationComponent } from './components/conversation/conversation.component';
import { DynamicTabComponent } from './components/dynamic-tab/dynamic-tab.component';
import { InhouseRequestDatatableComponent } from './components/inhouse-request-datatable/inhouse-request-datatable.component';
import { InhouseSentimentsComponent } from './components/inhouse-sentiments/inhouse-sentiments.component';
import { InhouseSourceComponent } from './components/inhouse-source/inhouse-source.component';
import { InhouseComponent } from './components/inhouse/inhouse.component';
import { MessageAnalyticsComponent } from './components/message-analytics/message-analytics.component';
import { NotificationComponent } from './components/notification/notification.component';
import { PreArrivalDatatableComponent } from './components/pre-arrival-datatable/pre-arrival-datatable.component';
import { PreArrivalPackagesComponent } from './components/pre-arrival-packages/pre-arrival-packages.component';
import { PreArrivalComponent } from './components/pre-arrival/pre-arrival.component';
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
    DynamicTabComponent,
    InhouseSourceComponent,
    InhouseSentimentsComponent,
    InhouseComponent,
    InhouseRequestDatatableComponent,
    ConversationComponent,
    NotificationComponent,
    PreArrivalComponent,
    PreArrivalPackagesComponent,
    PreArrivalDatatableComponent,
  ];
}
