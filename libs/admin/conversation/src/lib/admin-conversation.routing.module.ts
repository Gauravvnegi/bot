import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { ConversationComponent } from './components/conversation/conversation.component';

const appRoutes: Route[] = [
  {
    path: '',
    redirectTo: 'messages',
  },
  {
    path: '',
    component: ConversationComponent,
    children: [
      {
        path: 'analytics',
        loadChildren: () =>
          import('@hospitality-bot/admin/analytics').then(
            (m) => m.AdminAnalyticsModule
          ),
      },
      {
        path: 'messages',
        loadChildren: () =>
          import('@hospitality-bot/admin/messages').then(
            (m) => m.AdminMessagesModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule],
})
export class AdminConversationRoutingModule {}
