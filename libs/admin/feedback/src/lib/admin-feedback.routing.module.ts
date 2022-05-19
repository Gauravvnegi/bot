import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import {
  FeedbackDistributionComponent,
  GlobalNpsComponent,
  GtmAcrossServicesComponent,
  NetPromoterScoreComponent,
  NpsAcrossDepartmentsComponent,
  NpsAcrossServicesComponent,
  OverallReceivedBifurcationComponent,
  SharedComponent,
  TopLowNpsComponent,
  TwoWayProgressComponent,
} from './components/stats';
import { FeedbackDatatableComponent } from './components/datatable/feedback-datatable/feedback-datatable.component';
import { FeedbackNotesComponent } from './components/feedback-notes/feedback-notes.component';
import { FeedbackComponent } from './components/feedback/feedback.component';
import { FeedbackDatatableModalComponent } from './components/modals/feedback-datatable/feedback-datatable.component';
import { DepartmentBarGraphComponent } from './components/stats/department-bar-graph/department-bar-graph.component';

const appRoutes: Route[] = [
  {
    path: '',
    component: FeedbackComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule],
})
export class AdminFeedbackRoutingModule {
  static components = [
    FeedbackComponent,
    FeedbackDistributionComponent,
    GlobalNpsComponent,
    NetPromoterScoreComponent,
    NpsAcrossDepartmentsComponent,
    NpsAcrossServicesComponent,
    OverallReceivedBifurcationComponent,
    SharedComponent,
    TopLowNpsComponent,
    TwoWayProgressComponent,
    FeedbackDatatableComponent,
    FeedbackDatatableModalComponent,
    FeedbackNotesComponent,
    GtmAcrossServicesComponent,
    DepartmentBarGraphComponent,
  ];
}
