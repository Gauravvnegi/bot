import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CRoutes } from '@hospitality-bot/admin/shared';
import { ActionOverlayComponent } from './components/action-overlay/action-overlay.component';
import {
  FeedbackDetailComponent,
  FeedbackDetailFooterComponent,
  FeedbackListComponent,
  FeedbackListFilterComponent,
  MainComponent,
  SearchComponent,
} from './components/card';
import { FeedbackDatatableComponent } from './components/datatable/feedback-datatable/feedback-datatable.component';
import { FeedbackContainerComponent } from './components/feedback-container/feedback-container.component';
import { FeedbackNotesComponent } from './components/feedback-notes/feedback-notes.component';
import { FeedbackStatusFormComponent } from './components/feedback-status-form/feedback-status-form.component';
import { FeedbackTypesComponent } from './components/feedback-types/feedback-types.component';
import { FeedbackWrapperComponent } from './components/feedback-wrapper/feedback-wrapper.component';
import { FeedbackComponent } from './components/feedback/feedback.component';
import {
  FeedbackHistoryComponent,
  GuestBookingInfoComponent,
  GuestInfoComponent,
  GuestPersonalInfoComponent,
  GuestTimelineComponent,
  MentionsComponent,
  RequestComponent,
} from './components/guest-info';
import { FeedbackDatatableModalComponent } from './components/modals/feedback-datatable/feedback-datatable.component';
import { FeedbackDetailModalComponent } from './components/modals/feedback-detail-modal/feedback-detail.component';
import {
  ArtComponent,
  BifurcationStatsComponent,
  DisengagementComponent,
  FeedbackDistributionComponent,
  GlobalNpsComponent,
  GtmAcrossServicesComponent,
  GtmClosureComponent,
  NetPromoterScoreComponent,
  NpsAcrossDepartmentsComponent,
  ReceivedBreakdownComponent,
  ResponseRateComponent,
  TopLowNpsComponent,
  TwoWayProgressComponent,
} from './components/stats';
import { DepartmentBarGraphComponent } from './components/stats/department-bar-graph/department-bar-graph.component';

const appRoutes: CRoutes = [
  { path: '', component: FeedbackContainerComponent },
];

@NgModule({
  imports: [RouterModule.forChild(appRoutes)],

  exports: [RouterModule],
})
export class AdminFeedbackAnalyticsRoutingModule {
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
    BifurcationStatsComponent,
    FeedbackWrapperComponent,
    FeedbackTypesComponent,
  ];
}
