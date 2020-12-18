import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

import { FeedbackComponent } from './components/feedback/feedback.component';
import { FeedbackDatatableComponent } from './components/feedback-datatable/feedback-datatable.component';
import { NetPromoterScoreComponent } from './components/net-promoter-score/net-promoter-score.component';
import { NpsAcrossTouchpointsComponent } from './components/nps-across-touchpoints/nps-across-touchpoints.component';
import { NpsAcrossServicesComponent } from './components/nps-across-services/nps-across-services.component';
import { NpsAcrossDepartmentsComponent } from './components/nps-across-departments/nps-across-departments.component';
import { TextAnalyticsExplorerComponent } from './components/text-analytics-explorer/text-analytics-explorer.component';
import { TwoWayProgressComponent } from './components/two-way-progress/two-way-progress.component';
import { MulticolorCircularProgressComponent } from './components/multicolor-circular-progress/multicolor-circular-progress.component';
import { ComingSoonComponent } from 'libs/admin/shared/src/lib/components/coming-soon/coming-soon.component';

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
        NetPromoterScoreComponent,
        NpsAcrossTouchpointsComponent,
        NpsAcrossServicesComponent,
        NpsAcrossDepartmentsComponent,
        TextAnalyticsExplorerComponent,
        TwoWayProgressComponent,
        MulticolorCircularProgressComponent
    ];
  }
