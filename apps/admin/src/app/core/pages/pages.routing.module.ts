import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { DashboardErrorComponent } from '@hospitality-bot/admin/shared';
import { ComingSoonComponent } from 'libs/admin/shared/src/lib/components/coming-soon/coming-soon.component';
import { ViewSharedComponentsComponent } from 'libs/admin/shared/src/lib/components/view-shared-components/view-shared-components.component';
import { environment } from '../../../environments/environment';
import { CanActivateGuard } from '../guards/can-activate-guard';
import { CanLoadGuard } from '../guards/can-load-gurad';
import { RedirectGuard } from '../guards/redirect-guard';
import { PagesComponent } from './containers/pages/pages.component';
import { TemporaryRedirectPageComponent } from './containers/trp/temporary-redirect-page/temporary-redirect-page.component';
import { AdminDetailResolver } from './resolvers/admin-detail.resolver';

const appRoutes: Route[] = [
  {
    path: 'trp',
    component: TemporaryRedirectPageComponent,
    pathMatch: 'full',
  },
  {
    path: '',
    component: PagesComponent,
    resolve: {
      adminDetails: AdminDetailResolver,
    },
    canLoad: [CanLoadGuard],
    children: [
      {
        path: 'home',
        component: ComingSoonComponent,
      },
      {
        path: 'freddie',
        loadChildren: () =>
          import('@hospitality-bot/admin/conversation').then(
            (m) => m.AdminConversationModule
          ),
        canLoad: [CanLoadGuard],
        canActivate: [CanActivateGuard],
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
        canActivate: [CanActivateGuard],
      },
      {
        path: 'heda',
        loadChildren: () =>
          import('@hospitality-bot/admin/feedback').then(
            (m) => m.AdminFeedbackModule
          ),
        canLoad: [CanLoadGuard],
        canActivate: [CanActivateGuard],
      },
      {
        path: 'efrontdesk',
        loadChildren: () =>
          import('@hospitality-bot/admin/e-frontdesk').then(
            (m) => m.AdminEFrontdeskModule
          ),
        canLoad: [CanLoadGuard],
        canActivate: [CanActivateGuard],
      },
       {
        path: 'members',
        loadChildren: () =>
          import('@hospitality-bot/admin/members').then(
            (m) => m.AdminMembersModule
          ),
        canLoad: [CanLoadGuard],
        canActivate: [CanActivateGuard],
      },
      {
        path: 'subscription',
        loadChildren: () =>
          import('@hospitality-bot/admin/subscription').then(
            (m) => m.AdminSubscriptionModule
          ),
        canLoad: [CanLoadGuard],
        canActivate: [CanActivateGuard],
      },
      {
        path: 'settings',
        loadChildren: () =>
          import('@hospitality-bot/admin/settings').then(
            (m) => m.AdminSettingsModule
          ),
        canLoad: [CanLoadGuard],
        canActivate: [CanActivateGuard],
      },
      {
        path: 'library',
        loadChildren: () =>
          import('@hospitality-bot/admin/library').then(
            (m) => m.AdminLibraryModule
          ),
        canLoad: [CanLoadGuard],
        canActivate: [CanActivateGuard],
      },
      {
        path: 'outlet',
        loadChildren: () =>
          import('@hospitality-bot/admin/outlet').then(
            (m) => m.AdminOutletModule
          ),
        canLoad: [CanLoadGuard],
      },
      {
        path: 'marketing',
        loadChildren: () =>
          import('@hospitality-bot/admin/marketing').then(
            (m) => m.AdminMarketingModule
          ),
        canLoad: [CanLoadGuard],
        canActivate: [CanActivateGuard],
      },
      {
        path: 'builder',
        component: ComingSoonComponent,
      },
      {
        path: 'create-with',
        loadChildren: () =>
          import('@hospitality-bot/admin/create-with').then(
            (m) => m.AdminCreateWithModule
          ),
        canLoad: [CanLoadGuard],
        canActivate: [CanActivateGuard],
      },
      {
        path: 'inventory',
        loadChildren: () =>
          import('@hospitality-bot/admin/inventory').then(
            (m) => m.AdminInventoryModule
          ),
        canLoad: [CanLoadGuard],
        canActivate: [CanActivateGuard],
      },
      {
        path: 'finance',
        loadChildren: () =>
          import('@hospitality-bot/admin/finance').then(
            (m) => m.AdminFinanceModule
          ),
        canLoad: [CanLoadGuard],
        canActivate: [CanActivateGuard],
      },
      {
        path: 'redirect',
        loadChildren: () =>
          import('@hospitality-bot/admin/unsubscribed').then(
            (m) => m.AdminUnsubscribedModule
          ),
        canLoad: [CanLoadGuard],
        canActivate: [RedirectGuard],
      },
      {
        path: '',
        redirectTo: 'redirect',
        pathMatch: 'full',
      },
      { path: '**', redirectTo: '404' },
      { path: '404', component: DashboardErrorComponent },
    ],
  },
];

/**
 * To view all the shared components for development
 */
if (!environment.production) {
  appRoutes[1].children.unshift({
    path: 'components',
    component: ViewSharedComponentsComponent,
  });
}

@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule],
  providers: [CanLoadGuard, RedirectGuard],
})
export class PagesRoutingModule {}
