import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import {
  FeedbackDistributionComponent,
  GlobalNpsComponent,
  GtmAcrossServicesComponent,
  NetPromoterScoreComponent,
  NpsAcrossDepartmentsComponent,
  ReceivedBreakdownComponent,
  ResponseRateComponent,
  TopLowNpsComponent,
  TwoWayProgressComponent,
} from './components/stats';
import { FeedbackDatatableComponent } from './components/datatable/feedback-datatable/feedback-datatable.component';
import { FeedbackNotesComponent } from './components/feedback-notes/feedback-notes.component';
import { FeedbackComponent } from './components/feedback/feedback.component';
import { FeedbackDatatableModalComponent } from './components/modals/feedback-datatable/feedback-datatable.component';
import { DepartmentBarGraphComponent } from './components/stats/department-bar-graph/department-bar-graph.component';
import { FeedbackDetailModalComponent } from './components/modals/feedback-detail-modal/feedback-detail.component';
import {
  MainComponent,
  FeedbackListComponent,
  FeedbackDetailComponent,
  SearchComponent,
  FeedbackDetailFooterComponent,
  FeedbackListFilterComponent,
} from './components/card';
import { ActionOverlayComponent } from './components/action-overlay/action-overlay.component';
import {
  GuestInfoComponent,
  GuestBookingInfoComponent,
  GuestPersonalInfoComponent,
  GuestTimelineComponent,
  MentionsComponent,
  RequestComponent,
  FeedbackHistoryComponent,
} from './components/guest-info';
import { ArtComponent } from './components/stats/art/art.component';
import { FeedbackStatusFormComponent } from './components/feedback-status-form/feedback-status-form.component';

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
    FeedbackDatatableComponent,
    FeedbackDistributionComponent,
    FeedbackNotesComponent,
    GlobalNpsComponent,
    GtmAcrossServicesComponent,
    NetPromoterScoreComponent,
    NpsAcrossDepartmentsComponent,
    ReceivedBreakdownComponent,
    ResponseRateComponent,
    TopLowNpsComponent,
    TwoWayProgressComponent,
    FeedbackDatatableComponent,
    FeedbackDatatableModalComponent,
    FeedbackNotesComponent,
    GtmAcrossServicesComponent,
    DepartmentBarGraphComponent,
    MainComponent,
    FeedbackListComponent,
    FeedbackListFilterComponent,
    ActionOverlayComponent,
    FeedbackDetailComponent,
    SearchComponent,
    FeedbackDetailFooterComponent,
    GuestInfoComponent,
    GuestPersonalInfoComponent,
    GuestBookingInfoComponent,
    FeedbackListFilterComponent,
    FeedbackDetailModalComponent,
    GuestTimelineComponent,
    MentionsComponent,
    RequestComponent,
    FeedbackHistoryComponent,
    ArtComponent,
    FeedbackStatusFormComponent,
  ];
}
