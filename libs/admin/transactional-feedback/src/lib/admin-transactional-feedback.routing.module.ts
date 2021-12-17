import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { FeedbackDistributionComponent } from './components/cards/feedback-distribution/feedback-distribution.component';
import { GlobalNpsComponent } from './components/cards/global-nps/global-nps.component';
import { NetPromoterScoreComponent } from './components/cards/net-promoter-score/net-promoter-score.component';
import { OverallReceivedBifurcationComponent } from './components/cards/overall-received-bifurcation/overall-received-bifurcation.component';
import { PointOfSaleComponent } from './components/cards/point-of-sale/point-of-sale.component';
import { SharedComponent } from './components/cards/shared/shared.component';
import { StackedBarGraphComponent } from './components/cards/stacked-bar-graph/stacked-bar-graph.component';
import { TopLowNpsComponent } from './components/cards/top-low-nps/top-low-nps.component';
import { FeedbackDatatableComponent } from './components/feedback-datatable/feedback-datatable.component';
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
export class AdminTransactionalFeedbackRoutingModule {
  static components = [
    FeedbackComponent,
    FeedbackDatatableComponent,
    NetPromoterScoreComponent,
    TopLowNpsComponent,
    GlobalNpsComponent,
    FeedbackDistributionComponent,
    OverallReceivedBifurcationComponent,
    SharedComponent,
    PointOfSaleComponent,
    FeedbackNotesComponent,
    StackedBarGraphComponent,
  ];
}
