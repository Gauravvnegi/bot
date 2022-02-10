import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

import { PagesComponent } from './containers/pages/pages.component';
import { DashboardComponent } from '@hospitality-bot/admin/dashboard';

import { AdminDetailResolver } from './resolvers/admin-detail.resolver';
import { FeedbackConfigResolver } from './resolvers/feedback-config.resolver';
import { LoadGuard } from '../guards/load-guard';

const appRoutes: Route[] = [
  {
    path: '',
    component: PagesComponent,
    resolve: {
      adminDetails: AdminDetailResolver,
      feedbackConfig: FeedbackConfigResolver,
    },
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [LoadGuard],
      },
      {
        path: 'conversation',
        loadChildren: () =>
          import('@hospitality-bot/admin/conversation').then(
            (m) => m.AdminConversationModule
          ),
      },
      {
        path: 'package',
        loadChildren: () =>
          import('@hospitality-bot/admin/packages').then(
            (m) => m.AdminPackagesModule
          ),
        canActivate: [LoadGuard],
      },
      {
        path: 'covid',
        loadChildren: () =>
          import('@hospitality-bot/admin/covid').then(
            (m) => m.AdminCovidModule
          ),
        canActivate: [LoadGuard],
      },
      {
        path: 'roles-permissions',
        loadChildren: () =>
          import('@hospitality-bot/admin/roles-and-permissions').then(
            (m) => m.AdminRolesAndPermissionsModule
          ),
        canActivate: [LoadGuard],
      },
      {
        path: 'feedback',
        loadChildren: () =>
          import('@hospitality-bot/admin/feedback').then(
            (m) => m.AdminFeedbackModule
          ),
        canActivate: [LoadGuard],
      },
      {
        path: 'guest',
        loadChildren: () =>
          import('@hospitality-bot/admin/guests').then(
            (m) => m.AdminGuestsModule
          ),
        canActivate: [LoadGuard],
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
        canActivate: [LoadGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
