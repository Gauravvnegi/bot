import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { AnalyticsComponent } from './components/analytics/analytics.component';
import { DynamicTabComponent } from './components/dynamic-tab/dynamic-tab.component';
import { InhouseRequestDatatableComponent } from './components/inhouse-request-datatable/inhouse-request-datatable.component';
import { InhouseSentimentsComponent } from './components/inhouse-sentiments/inhouse-sentiments.component';
import { InhouseSourceComponent } from './components/inhouse-source/inhouse-source.component';
import { PreArrivalDatatableComponent } from './components/pre-arrival-datatable/pre-arrival-datatable.component';
import { PreArrivalPackagesComponent } from './components/pre-arrival-packages/pre-arrival-packages.component';
import { ComplaintAnalyticsComponent } from './components/complaint-analytics/complaint-analytics.component';
import { ComplaintBifurcationComponent } from './components/stats/complaint-bifurcation/complaint-bifurcation.component';
import { ComplaintDisengagementComponent } from './components/stats/complaint-disengagement/complaint-disengagement.component';
import { ComplaintBreakdownComponent } from './components/stats/complaint-breakdown/complaint-breakdown.component';
import { AvgTimeComponent } from './components/stats/avg-time/avg-time.component';
const appRoutes: Route[] = [
  {
    path: '',
    component: ComplaintAnalyticsComponent,
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
    ComplaintAnalyticsComponent,
    ComplaintBifurcationComponent,
    ComplaintDisengagementComponent,
    ComplaintBreakdownComponent,
    AvgTimeComponent,
  ];
}
