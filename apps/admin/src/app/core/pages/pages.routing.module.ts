import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { CanActivateGuard } from '../guards/can-activate-guard';
import { CanLoadGuard } from '../guards/can-load-gurad';
import { RedirectGuard } from '../guards/redirect-guard';
import { MainComponent } from './containers/main/main.component';
import { PagesComponent } from './containers/pages/pages.component';
import { TemporaryRedirectPageComponent } from './containers/trp/temporary-redirect-page/temporary-redirect-page.component';
import { AdminDetailResolver } from './resolvers/admin-detail.resolver';

const appRoutes: Route[] = [
  {
    path: 'pages',
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
        path: '',
        loadChildren: () =>
          import('../product/product.module').then((m) => m.ProductModule),
        canLoad: [CanLoadGuard],
        canActivate: [CanActivateGuard],
      },
      {
        path: 'test', // will be removed (as direct imported in admin as of now)
        loadChildren: () =>
          import('@hospitality-bot/admin/complaint-tacker').then(
            (m) => m.AdminComplaintTackerModule
          ),
        canLoad: [CanLoadGuard],
        canActivate: [CanActivateGuard],
      },
    ],
    // children: [
    //   {
    //     path: 'redirect',
    //     loadChildren: () =>
    //       import('@hospitality-bot/admin/unsubscribed').then(
    //         (m) => m.AdminUnsubscribedModule
    //       ),
    //     canLoad: [CanLoadGuard],
    //     canActivate: [RedirectGuard],
    //   },
    //   // {
    //   //   path: '',
    //   //   redirectTo: 'redirect',
    //   //   pathMatch: 'full',
    //   // },

    //   { path: '**', redirectTo: '404' },
    //   { path: '404', component: DashboardErrorComponent },
    // ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule],
  providers: [CanLoadGuard, RedirectGuard],
})
export class PagesRoutingModule {}
