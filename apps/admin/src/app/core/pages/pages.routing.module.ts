import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { PagesComponent } from './containers/pages/pages.component';

const appRoutes: Route[] = [
  {
    path: '',
    component: PagesComponent,
    children: [],
  },
];

@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
