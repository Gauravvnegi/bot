import { NgModule } from '@angular/core';
import { RouterModule, ROUTES } from '@angular/router';
import { SubscriptionPlanService } from '@hospitality-bot/admin/core/theme';
import { ModuleNames } from '@hospitality-bot/admin/shared';
import { CRoutes, routesFactory } from 'libs/admin/shared/src';
import { ConversationComponent } from './components/conversation/conversation.component';

const appRoutes: CRoutes = [
  {
    path: '',
    component: ConversationComponent,
    name: ModuleNames.FREDDIE,
    children: [
      {
        path: 'conversation-analytics',
        name: ModuleNames.CONVERSATION_DASHBOARD,
        loadChildren: () =>
          import('@hospitality-bot/admin/conversation-analytics').then(
            (m) => m.AdminConversationAnalyticsModule
          ),
      },
      {
        path: 'messages',
        name: ModuleNames.LIVE_MESSAGING,
        loadChildren: () =>
          import('@hospitality-bot/admin/messages').then(
            (m) => m.AdminMessagesModule
          ),
      },
      {
        path: 'sentimental-analysis',
        name: ModuleNames.SENTIMENTAL_ANALYSIS_FREDDIE,
        loadChildren: () =>
          import('@hospitality-bot/admin/sentimental-analysis').then(
            (m) => m.AdminSentimentalAnalysisModule
          ),
      },
    ],
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
export class AdminConversationRoutingModule {}
