import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import {
  ArtComponent,
  FeedbackDistributionComponent,
  GlobalNpsComponent,
  GtmAcrossServicesComponent,
  NetPromoterScoreComponent,
  NpsAcrossDepartmentsComponent,
  ReceivedBreakdownComponent,
  ResponseRateComponent,
  TopLowNpsComponent,
  TwoWayProgressComponent,
  DisengagementComponent,
  GtmClosureComponent,
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
import { FeedbackStatusFormComponent } from './components/feedback-status-form/feedback-status-form.component';
import { FeedbackContainerComponent } from './components/feedback-container/feedback-container.component';

const appRoutes: Route[] = [
  { path: '', redirectTo: 'analytics' },
  {
    path: 'analytics',
    component: FeedbackContainerComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule],
})
export class AdminFeedbackRoutingModule {
  static components = [
    FeedbackContainerComponent,
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
    DisengagementComponent,
    GtmClosureComponent,
  ];
}
