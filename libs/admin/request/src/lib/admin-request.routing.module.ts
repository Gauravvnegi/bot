import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { RequestDataTableComponent } from './components/request-data-table/request-data-table.component';
import { RequestComponent } from './components/request/request.component';
import { RequestWrapperComponent } from './components/request-wrapper/request-wrapper.component';
import { RequestListComponent } from './components/request-list/request-list.component';
import { RequestDetailComponent } from './components/request-detail/request-detail.component';
import { RaiseRequestComponent } from './components/raise-request/raise-request.component';

const appRoutes: Route[] = [
  {
    path: '',
    component: RequestComponent,
    children: [
      {
        path: '',
        component: RequestWrapperComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule],
})
export class AdminRequestRoutingModule {
  static components = [
    RequestComponent,
    RequestDataTableComponent,
    RequestDataTableComponent,
    RequestWrapperComponent,
    RequestListComponent,
    RequestDetailComponent,
    RaiseRequestComponent,
  ];
}
