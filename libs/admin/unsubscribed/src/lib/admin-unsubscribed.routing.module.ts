import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { UnsubscribeViewComponent } from './component/unsubscribe-view/unsubscribe-view.component';

const appRoutes: Route[] = [
  {
    path: '',
    component: UnsubscribeViewComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule],
})
export class AdminSubscriptionRoutingModule {
  static components = [UnsubscribeViewComponent];
}
