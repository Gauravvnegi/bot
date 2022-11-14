import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { LoadGuard } from 'apps/admin/src/app/core/guards/load-guard';
import { DashboardErrorComponent } from '@hospitality-bot/admin/shared';
import { ConversationComponent } from './components/conversation/conversation.component';

const appRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'conversation-analytics',
  },
  {
    path: '',
    component: ConversationComponent,
    children: [
      {
        path: 'conversation-analytics',
        loadChildren: () =>
          import('@hospitality-bot/admin/conversation-analytics').then(
            (m) => m.AdminConversationAnalyticsModule
          ),
      },
      {
        path: 'request-analytics',
        loadChildren: () =>
          import('@hospitality-bot/admin/request-analytics').then(
            (m) => m.AdminRequestAnalyticsModule
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
        // canActivate: [LoadGuard],
      },
    ],
  },
  { path: '**', pathMatch: 'full', redirectTo: '404' },
  { path: '404', component: DashboardErrorComponent },
];

@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule],
})
export class AdminConversationRoutingModule {}
