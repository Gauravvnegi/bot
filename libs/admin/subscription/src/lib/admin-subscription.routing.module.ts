import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { ChannelUsageComponent } from './components/channel-usage/channel-usage.component';
import { GuestUsageComponent } from './components/guest-usage/guest-usage.component';
import { OcrUsageComponent } from './components/ocr-usage/ocr-usage.component';
import { StatisticsComponent } from './components/statistics/statistics.component';
import { SubscriptionComponent } from './components/subscription/subscription.component';
import { TopCardsComponent } from './components/top-cards/top-cards.component';
import { UsersUsageComponent } from './components/users-usage/users-usage.component';
import { FeedbackReceivedComponent } from './components/feedback-received/feedback-received.component';
import { MessagesExchangedComponent } from './components/messages-exchanged/messages-exchanged.component';
import { FrontdeskStatComponent } from './components/frontdesk-stat/frontdesk-stat.component';

const appRoutes: Route[] = [
  {
    path: '',
    component: SubscriptionComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule],
})
export class AdminSubscriptionRoutingModule {
  static components = [
    SubscriptionComponent,
    StatisticsComponent,
    UsersUsageComponent,
    OcrUsageComponent,
    GuestUsageComponent,
    ChannelUsageComponent,
    TopCardsComponent,
    FeedbackReceivedComponent,
    MessagesExchangedComponent,
    FrontdeskStatComponent,
  ];
}
