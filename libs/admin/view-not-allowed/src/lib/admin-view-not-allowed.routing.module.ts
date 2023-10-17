import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { ViewNotAllowedComponent } from './component/view-not-allowed/view-not-allowed.component';

const appRoutes: Route[] = [
  {
    path: '',
    component: ViewNotAllowedComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule],
})
export class AdminViewNotAllowedRoutingModule {
  static components = [ViewNotAllowedComponent];
}
