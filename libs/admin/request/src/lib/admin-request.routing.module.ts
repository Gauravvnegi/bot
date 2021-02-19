import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { RequestDataTableComponent } from './components/request-data-table/request-data-table.component';
import { NotificationComponent } from 'libs/admin/notification/src/lib/components/notification/notification.component';
import { RequestComponent } from './components/request/request.component';

const appRoutes: Route[] = [
  {
    path: '',
    component: RequestComponent,
    children: [
      {
        path: '',
        component: RequestDataTableComponent,
      },
      {
        path: 'add-request',
        component: NotificationComponent,
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule],
})
export class AdminRequestRoutingModule {
  static components = [RequestDataTableComponent, NotificationComponent];
}
