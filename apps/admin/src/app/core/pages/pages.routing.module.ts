import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { CanActivateGuard } from '../guards/can-activate-guard';
import { CanLoadGuard } from '../guards/can-load-gurad';
import { RedirectGuard } from '../guards/redirect-guard';
import { MainComponent } from './containers/main/main.component';
import { PagesComponent } from './containers/pages/pages.component';
import { TemporaryRedirectPageComponent } from './containers/trp/temporary-redirect-page/temporary-redirect-page.component';
import { AdminDetailResolver } from './resolvers/admin-detail.resolver';
import { DashboardErrorComponent } from '@hospitality-bot/admin/shared';

const appRoutes: Route[] = [
  {
    path: 'pages', // Previously maintained route
    component: MainComponent,
    children: [
      {
        path: 'trp',
        component: TemporaryRedirectPageComponent,
        pathMatch: 'full',
      },
    ],
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
        path: 'roles-permissions',
        loadChildren: () =>
          import('@hospitality-bot/admin/roles-and-permissions').then(
            (m) => m.AdminRolesAndPermissionsModule
          ),
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
        path: '',
        loadChildren: () =>
          import('../product/product.module').then((m) => m.ProductModule),
        canLoad: [CanLoadGuard],
        canActivate: [CanActivateGuard],
      },
      { path: '**', redirectTo: '404' },
      { path: '404', component: DashboardErrorComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule],
  providers: [CanLoadGuard, RedirectGuard],
})
export class PagesRoutingModule {}
