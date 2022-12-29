import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

import { PagesComponent } from './containers/pages/pages.component';
import { DashboardComponent } from '@hospitality-bot/admin/dashboard';

import { AdminDetailResolver } from './resolvers/admin-detail.resolver';
import { DashboardErrorComponent } from '@hospitality-bot/admin/shared';
import { ComingSoonComponent } from 'libs/admin/shared/src/lib/components/coming-soon/coming-soon.component';
import { TemporaryRedirectPageComponent } from './containers/trp/temporary-redirect-page/temporary-redirect-page.component';

const appRoutes: Route[] = [
  {
    path: 'trp',
    component: TemporaryRedirectPageComponent,
    pathMatch: 'full',
  },
  {
    path: '',
    component: PagesComponent,
    // resolve: {
    //   adminDetails: AdminDetailResolver,
    // },
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
        // canActivate: [LoadGuard],
      },
      {
        path: 'freddie',
        loadChildren: () =>
          import('@hospitality-bot/admin/conversation').then(
            (m) => m.AdminConversationModule
          ),
      },
      {
        path: 'covid',
        loadChildren: () =>
          import('@hospitality-bot/admin/covid').then(
            (m) => m.AdminCovidModule
          ),
        // canActivate: [LoadGuard],
      },
      {
        path: 'roles-permissions',
        loadChildren: () =>
          import('@hospitality-bot/admin/roles-and-permissions').then(
            (m) => m.AdminRolesAndPermissionsModule
          ),
        // canActivate: [LoadGuard],
      },
      {
        path: 'heda',
        loadChildren: () =>
          import('@hospitality-bot/admin/feedback').then(
            (m) => m.AdminFeedbackModule
          ),
        // canActivate: [LoadGuard],
      },
      {
        path: 'efrontdesk',
        loadChildren: () =>
          import('@hospitality-bot/admin/guests').then(
            (m) => m.AdminGuestsModule
          ),
        // canActivate: [LoadGuard],
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
        // canActivate: [LoadGuard],
      },
      {
        path: 'library',
        loadChildren: () =>
          import('@hospitality-bot/admin/library').then(
            (m) => m.AdminLibraryModule
          ),
      },
      {
        path: 'marketing',
        loadChildren: () =>
          import('@hospitality-bot/admin/marketing').then(
            (m) => m.AdminMarketingModule
          ),
      },
      {
        path: 'builder',
        component: ComingSoonComponent,
        // canActivate: [LoadGuard],
      },
      {
        path: 'create-with',
        loadChildren: () =>
          import('@hospitality-bot/admin/create-with').then(
            (m) => m.AdminCreateWithModule
          ),
      },
      { path: '**', redirectTo: '404' },
      { path: '404', component: DashboardErrorComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
