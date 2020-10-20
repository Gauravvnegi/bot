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
        path: 'reservation',
        loadChildren: () =>
          import('@hospitality-bot/admin/reservation').then(
            (m) => m.AdminReservationModule
          ),
      },
      {
        path: 'notification',
        loadChildren: () =>
          import('@hospitality-bot/admin/notification').then(
            (m) => m.AdminNotificationModule
          ),
      },
      {
        path: 'package',
        loadChildren: () =>
          import('@hospitality-bot/admin/special-amenities').then(
            (m) => m.AdminSpecialAmenitiesModule
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
