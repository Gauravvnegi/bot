import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { AnalyticsComponent } from './components/analytics/analytics.component';
import { DynamicTabComponent } from './components/dynamic-tab/dynamic-tab.component';
import { InhouseRequestDatatableComponent } from './components/inhouse-request-datatable/inhouse-request-datatable.component';
import { InhouseSentimentsComponent } from './components/inhouse-sentiments/inhouse-sentiments.component';
import { InhouseSourceComponent } from './components/inhouse-source/inhouse-source.component';
import { PreArrivalDatatableComponent } from './components/pre-arrival-datatable/pre-arrival-datatable.component';
import { PreArrivalPackagesComponent } from './components/pre-arrival-packages/pre-arrival-packages.component';

const appRoutes: Route[] = [
  {
    path: '',
    component: AnalyticsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule],
})
export class AdminRequestAnalyticsRoutingModule {
  static components = [
    AnalyticsComponent,
    DynamicTabComponent,
    InhouseSourceComponent,
    InhouseSentimentsComponent,
    InhouseRequestDatatableComponent,
    PreArrivalPackagesComponent,
    PreArrivalDatatableComponent,
  ];
}
