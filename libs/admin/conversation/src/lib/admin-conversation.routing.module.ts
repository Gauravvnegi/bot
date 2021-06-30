import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { ConversationComponent } from './components/conversation/conversation.component';

const appRoutes: Route[] = [
  {
    path: '',
    redirectTo: 'request',
  },
  {
    path: '',
    component: ConversationComponent,
    children: [
      // {
      //   path: 'request',
      //   loadChildren: () =>
      //     import('@hospitality-bot/admin/request').then(
      //       (m) => m.AdminRequestModule
      //     ),
      // },
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
