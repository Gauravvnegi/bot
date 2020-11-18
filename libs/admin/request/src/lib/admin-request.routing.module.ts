import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { RequestDataTableComponent } from './components/request-data-table/request-data-table.component';
import { NotificationComponent } from './components/notification/notification.component';

const appRoutes: Route[] = [
  {
    path: '',
    component: RequestDataTableComponent,
  },
  {
    path: 'add-request',
    component: NotificationComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule],
})
export class AdminRequestRoutingModule {
  static components = [RequestDataTableComponent, NotificationComponent];
}
