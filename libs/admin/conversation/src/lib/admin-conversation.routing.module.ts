import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { LoadGuard } from 'apps/admin/src/app/core/guards/load-guard';
import { ConversationComponent } from './components/conversation/conversation.component';

const appRoutes: Route[] = [
  {
    path: '',
    redirectTo: 'analytics',
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
      {
        path: 'request',
        loadChildren: () =>
          import('@hospitality-bot/admin/request').then(
            (m) => m.AdminRequestModule
          ),
        canActivate: [LoadGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule],
})
export class AdminConversationRoutingModule {}
