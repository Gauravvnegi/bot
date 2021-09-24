import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

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
  static components = [FeedbackComponent];
}
