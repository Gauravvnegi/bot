import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { NotificationComponent } from './components/notification/notification.component';

const appRoutes: Route[] = [
  {
    path: '',
    component: NotificationComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule],
})
export class AdminNotificationRoutingModule {}
