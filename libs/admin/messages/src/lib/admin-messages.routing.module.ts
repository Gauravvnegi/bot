import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { MessagesComponent } from './components/messages/messages.component';

const appRoutes: Route[] = [
  {
    path: '',
    component: MessagesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule],
})
export class AdminMessagesRoutingModule {}
