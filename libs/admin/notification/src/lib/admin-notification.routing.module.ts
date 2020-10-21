import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { NotificationComponent } from './components/notification/notification.component';
import { ComingSoonComponent } from 'libs/admin/shared/src/lib/components/coming-soon/coming-soon.component';

const appRoutes: Route[] = [
  // {
  //   path: '',
  //   component: NotificationComponent,
  // },
  {
    path: '',
    component: ComingSoonComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule],
})
export class AdminNotificationRoutingModule {}
