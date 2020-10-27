import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { RequestDataTableComponent } from './components/request-data-table/request-data-table.component';

const appRoutes: Route[] = [
  {
    path: '',
    component: RequestDataTableComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule],
})
export class AdminRequestRoutingModule {
  static components = [RequestDataTableComponent];
}
