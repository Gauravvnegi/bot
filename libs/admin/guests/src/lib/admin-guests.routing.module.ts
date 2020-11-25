import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

const appRoutes: Route[] = [
//   {
//     path: '',
//     component: RequestDataTableComponent,
//   },
//   {
//     path: 'add-request',
//     component: NotificationComponent,
//   }
];

@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule],
})
export class AdminGuestsRoutingModule {
  static components = [];
}
