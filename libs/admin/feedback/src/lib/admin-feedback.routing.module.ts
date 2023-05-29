import { NgModule } from '@angular/core';
import { RouterModule, ROUTES } from '@angular/router';
import { SubscriptionPlanService } from '@hospitality-bot/admin/core/theme';
import {
  CRoutes,
  ModuleNames,
  routesFactory,
} from '@hospitality-bot/admin/shared';
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
  BifurcationStatsComponent,
} from './components/stats';
import { DepartmentBarGraphComponent } from './components/stats/department-bar-graph/department-bar-graph.component';

const appRoutes: CRoutes = [
  { path: '', redirectTo: 'analytics' },
  {
    path: 'analytics',
    name: ModuleNames.HEDA_DASHBOARD,
    component: FeedbackContainerComponent,
  },
  {
    path: 'sentimental-analysis',
    name: ModuleNames.SENTIMENTAL_ANALYSIS_HEDA,
    loadChildren: () =>
      import('@hospitality-bot/admin/sentimental-analysis').then(
        (m) => m.AdminSentimentalAnalysisModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild([])],
  providers: [
    {
      provide: ROUTES,
      useFactory: (subscriptionService: SubscriptionPlanService) =>
        routesFactory(appRoutes, [subscriptionService]),
      multi: true,
      deps: [SubscriptionPlanService],
    },
  ],
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
    BifurcationStatsComponent,
  ];
}
