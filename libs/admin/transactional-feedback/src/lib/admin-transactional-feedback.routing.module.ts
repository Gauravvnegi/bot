import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

import { FeedbackComponent } from './components/feedback/feedback.component';
import { FeedbackDatatableComponent } from './components/feedback-datatable/feedback-datatable.component';
import { NetPromoterScoreComponent } from './components/net-promoter-score/net-promoter-score.component';
import { NpsAcrossTouchpointsComponent } from './components/nps-across-touchpoints/nps-across-touchpoints.component';
import { NpsAcrossServicesComponent } from './components/nps-across-services/nps-across-services.component';
import { NpsAcrossDepartmentsComponent } from './components/nps-across-departments/nps-across-departments.component';
import { TwoWayProgressComponent } from './components/two-way-progress/two-way-progress.component';
import { MulticolorCircularProgressComponent } from './components/multicolor-circular-progress/multicolor-circular-progress.component';
import { TopLowNpsComponent } from './components/top-low-nps/top-low-nps.component';
import { GlobalNpsComponent } from './components/global-nps/global-nps.component';
import { FeedbackDistributionComponent } from './components/feedback-distribution/feedback-distribution.component';
import { OverallReceivedBifurcationComponent } from './components/overall-received-bifurcation/overall-received-bifurcation.component';
import { SharedComponent } from './components/shared/shared.component';
import { PointOfSaleComponent } from './components/point-of-sale/point-of-sale.component';
import { FeedbackNotesComponent } from './components/feedback-notes/feedback-notes.component';

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
export class AdminTransactionalFeedbackRoutingModule {
  static components = [
    FeedbackComponent,
    FeedbackDatatableComponent,
    NetPromoterScoreComponent,
    NpsAcrossTouchpointsComponent,
    NpsAcrossServicesComponent,
    NpsAcrossDepartmentsComponent,
    TwoWayProgressComponent,
    MulticolorCircularProgressComponent,
    TopLowNpsComponent,
    GlobalNpsComponent,
    FeedbackDistributionComponent,
    OverallReceivedBifurcationComponent,
    SharedComponent,
    PointOfSaleComponent,
    FeedbackNotesComponent,
  ];
}
