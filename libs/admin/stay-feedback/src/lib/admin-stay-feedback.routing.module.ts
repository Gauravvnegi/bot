import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { FeedbackDistributionComponent } from './components/cards/feedback-distribution/feedback-distribution.component';
import { GlobalNpsComponent } from './components/cards/global-nps/global-nps.component';
import { NetPromoterScoreComponent } from './components/cards/net-promoter-score/net-promoter-score.component';
import { NpsAcrossDepartmentsComponent } from './components/cards/nps-across-departments/nps-across-departments.component';
import { NpsAcrossServicesComponent } from './components/cards/nps-across-services/nps-across-services.component';
import { NpsAcrossTouchpointsComponent } from './components/cards/nps-across-touchpoints/nps-across-touchpoints.component';
import { OverallReceivedBifurcationComponent } from './components/cards/overall-received-bifurcation/overall-received-bifurcation.component';
import { SharedComponent } from './components/cards/shared/shared.component';
import { TopLowNpsComponent } from './components/cards/top-low-nps/top-low-nps.component';
import { TwoWayProgressComponent } from './components/cards/two-way-progress/two-way-progress.component';
import { FeedbackDatatableComponent } from './components/datatable/feedback-datatable/feedback-datatable.component';
import { FeedbackComponent } from './components/feedback/feedback.component';

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
export class AdminStayFeedbackRoutingModule {
  static components = [
    FeedbackComponent,
    FeedbackDatatableComponent,
    NetPromoterScoreComponent,
    NpsAcrossTouchpointsComponent,
    NpsAcrossServicesComponent,
    NpsAcrossDepartmentsComponent,
    TwoWayProgressComponent,
    TopLowNpsComponent,
    GlobalNpsComponent,
    FeedbackDistributionComponent,
    OverallReceivedBifurcationComponent,
    SharedComponent,
  ];
}
