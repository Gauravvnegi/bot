import { NgModule } from '@angular/core';
import { RouterModule, ROUTES } from '@angular/router';
import { SubscriptionPlanService } from '@hospitality-bot/admin/core/theme';
import {
  DashboardErrorComponent,
  ModuleNames,
} from '@hospitality-bot/admin/shared';
import { CRoutes, routesFactory } from 'libs/admin/shared/src';
import { EFrontDeskComponent } from './components/e-front-desk/e-front-desk.component';

const appRoutes: CRoutes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard',
  },
  {
    path: '',
    component: EFrontDeskComponent,
    name: ModuleNames.FRONT_DESK,
    children: [
      {
        path: 'dashboard',
        name: ModuleNames.FRONT_DESK_DASHBOARD,
        loadChildren: () =>
          import('@hospitality-bot/admin/dashboard').then(
            (m) => m.AdminDashboardModule
          ),
      },
      {
        path: 'request-analytics',
        name: ModuleNames.REQUEST_DASHBOARD,
        loadChildren: () =>
          import('@hospitality-bot/admin/request-analytics').then(
            (m) => m.AdminRequestAnalyticsModule
          ),
      },

      {
        path: 'request',
        name: ModuleNames.REQUEST,
        loadChildren: () =>
          import('@hospitality-bot/admin/request').then(
            (m) => m.AdminRequestModule
          ),
      },
    ],
  },
  { path: '**', pathMatch: 'full', redirectTo: '404' },
  { path: '404', component: DashboardErrorComponent },
];

@NgModule({
  imports: [RouterModule.forChild([])],
  providers: [
    {
      provide: ROUTES,
      useFactory: (subscriptionService: SubscriptionPlanService) =>
        routesFactory(appRoutes, [subscriptionService]),
      multi: true,
      deps: [SubscriptionPlanService],
    },
  ],
  exports: [RouterModule],
})
export class AdminEFrontdeskRoutingModule {}
