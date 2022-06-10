import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import {
  FeedbackDistributionComponent,
  GlobalNpsComponent,
  GtmAcrossServicesComponent,
  NetPromoterScoreComponent,
  NpsAcrossDepartmentsComponent,
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
import { MainComponent } from './components/card/main/main.component';
import { FeedbackListComponent } from './components/card/feedback-list/feedback-list.component';
import { FeedbackDetailComponent } from './components/card/feedback-detail/feedback-detail.component';
import { SearchComponent } from './components/card/search/search.component';
import { FeedbackDetailFooterComponent } from './components/card/feedback-detail-footer/feedback-detail-footer.component';
import { GuestInfoComponent } from './components/card/guest-info/guest-info.component';
import { GuestPersonalInfoComponent } from './components/card/guest-personal-info/guest-personal-info.component';
import { GuestBookingInfoComponent } from './components/card/guest-booking-info/guest-booking-info.component';
import { FeedbackListFilterComponent } from './components/card/feedback-list-filter/feedback-list-filter.component';
import { FeedbackDetailModalComponent } from './components/modals/feedback-detail-modal/feedback-detail.component';

const appRoutes: Route[] = [
  {
    path: '',
    component: FeedbackComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule],
  declarations: [],
})
export class AdminFeedbackRoutingModule {
  static components = [
    FeedbackComponent,
    FeedbackDistributionComponent,
    GlobalNpsComponent,
    NetPromoterScoreComponent,
    NpsAcrossDepartmentsComponent,
    OverallReceivedBifurcationComponent,
    SharedComponent,
    TopLowNpsComponent,
    TwoWayProgressComponent,
    FeedbackDatatableComponent,
    FeedbackDatatableModalComponent,
    FeedbackNotesComponent,
    GtmAcrossServicesComponent,
    DepartmentBarGraphComponent,
    MainComponent,
    FeedbackListComponent,
    FeedbackDetailComponent,
    SearchComponent,
    FeedbackDetailFooterComponent,
    GuestInfoComponent,
    GuestPersonalInfoComponent,
    GuestBookingInfoComponent,
    FeedbackListFilterComponent,
    FeedbackDetailModalComponent,
  ];
}
