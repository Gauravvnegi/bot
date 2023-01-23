import { NgModule } from '@angular/core';
import { RouterModule, ROUTES } from '@angular/router';
import { SubscriptionPlanService } from '@hospitality-bot/admin/core/theme';
import {
  CRoutes,
  ModuleNames,
  routesFactory,
} from '@hospitality-bot/admin/shared';
import { ChannelUsageComponent } from './components/channel-usage/channel-usage.component';
import { FeedbackReceivedComponent } from './components/feedback-received/feedback-received.component';
import { FrontdeskStatComponent } from './components/frontdesk-stat/frontdesk-stat.component';
import { GuestUsageComponent } from './components/guest-usage/guest-usage.component';
import { MessagesExchangedComponent } from './components/messages-exchanged/messages-exchanged.component';
import { OcrUsageComponent } from './components/ocr-usage/ocr-usage.component';
import { StatisticsComponent } from './components/statistics/statistics.component';
import { SubscriptionComponent } from './components/subscription/subscription.component';
import { TopCardsComponent } from './components/top-cards/top-cards.component';
import { UsersUsageComponent } from './components/users-usage/users-usage.component';

const appRoutes: CRoutes = [
  {
    path: '',
    name: ModuleNames.SUBSCRIPTION,
    component: SubscriptionComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild([])],
  providers: [
    {
      provide: ROUTES,
      useFactory: (subscriptionService: SubscriptionPlanService) =>
        routesFactory(appRoutes, [subscriptionService]),
      multi: true,
      deps: [SubscriptionPlanService],
    },
  ],
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
