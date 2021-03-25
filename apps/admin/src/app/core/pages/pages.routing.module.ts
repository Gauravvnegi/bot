import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { PagesComponent } from './containers/pages/pages.component';
import { DashboardComponent } from '../../../../../../libs/admin/dashboard/src/lib/components/dashboard/dashboard.component';
import { UserDetailResolver } from './resolvers/user-detail.resolver';
import { FeedbackConfigResolver } from './resolvers/feedback-config.resolver';

const appRoutes: Route[] = [
  {
    path: '',
    component: PagesComponent,
    resolve: {
      userDetails: UserDetailResolver,
      feedbackConfig: FeedbackConfigResolver,
    },
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      {
        path: 'request',
        loadChildren: () =>
          import('@hospitality-bot/admin/request').then(
            (m) => m.AdminRequestModule
          ),
      },
      {
        path: 'package',
        loadChildren: () =>
          import('@hospitality-bot/admin/packages').then(
            (m) => m.AdminPackagesModule
          ),
      },
      {
        path: 'covid',
        loadChildren: () =>
          import('@hospitality-bot/admin/covid').then(
            (m) => m.AdminCovidModule
          ),
      },
      {
        path: 'roles-permissions',
        loadChildren: () =>
          import('@hospitality-bot/admin/roles-and-permissions').then(
            (m) => m.AdminRolesAndPermissionsModule
          ),
      },
      {
        path: 'feedback',
        loadChildren: () =>
          import('@hospitality-bot/admin/feedback').then(
            (m) => m.AdminFeedbackModule
          ),
      },
      {
        path: 'guest',
        loadChildren: () =>
          import('@hospitality-bot/admin/guests').then(
            (m) => m.AdminGuestsModule
          ),
      },
      {
        path: 'subscription',
        loadChildren: () =>
          import('@hospitality-bot/admin/subscription').then(
            (m) => m.AdminSubscriptionModule
          ),
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
