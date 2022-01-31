import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import {
  FeedbackDistributionComponent,
  GlobalNpsComponent,
  NetPromoterScoreComponent,
  NpsAcrossDepartmentsComponent,
  NpsAcrossServicesComponent,
  OverallReceivedBifurcationComponent,
  SharedComponent,
  TopLowNpsComponent,
  TwoWayProgressComponent,
} from './components/cards';
import { PointOfSaleComponent } from './components/cards/point-of-sale/point-of-sale.component';
import { TransactionalDatatableComponent } from './components/datatable/transactional-datatable/transactional-datatable.component';
import { FeedbackNotesComponent } from './components/feedback-notes/feedback-notes.component';

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
    TransactionalDatatableComponent,
    FeedbackNotesComponent,
    PointOfSaleComponent,
  ];
}
