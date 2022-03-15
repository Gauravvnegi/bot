import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import {
  ArtAcrossExperienceComponent,
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
} from './components/cards';
import { PointOfSaleComponent } from './components/cards/point-of-sale/point-of-sale.component';
import { StackedBarGraphComponent } from './components/cards/stacked-bar-graph/stacked-bar-graph.component';
import { FeedbackDatatableComponent } from './components/datatable/feedback-datatable/feedback-datatable.component';
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
    ArtAcrossExperienceComponent,
    FeedbackComponent,
    FeedbackDatatableComponent,
    FeedbackDistributionComponent,
    FeedbackNotesComponent,
    GlobalNpsComponent,
    GtmAcrossServicesComponent,
    NetPromoterScoreComponent,
    NpsAcrossDepartmentsComponent,
    NpsAcrossServicesComponent,
    OverallReceivedBifurcationComponent,
    PointOfSaleComponent,
    SharedComponent,
    StackedBarGraphComponent,
    TopLowNpsComponent,
    TwoWayProgressComponent,
  ];
}
