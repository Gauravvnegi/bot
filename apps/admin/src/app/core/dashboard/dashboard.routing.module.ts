import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { DashboardErrorComponent } from '@hospitality-bot/admin/shared';
import { UserDetailResolver } from '../pages/resolvers/user-detail.resolver';
import { DashboardComponent } from './containers/dashboard/dashboard.component';

const appRoutes: Route[] = [
  {
    path: '',
    component: DashboardComponent,
    resolve: {
      userDetails: UserDetailResolver,
    },
    children: [
      {
        path: 'manage-sites',
        loadChildren: () =>
          import('@hospitality-bot/admin/manage-sites').then(
            (m) => m.AdminManageSitesModule
          ),
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'manage-sites',
      },
      { path: '**', redirectTo: '404' },
      { path: '404', component: DashboardErrorComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule],
  providers: [],
})
export class DashboardRoutingModule {}
