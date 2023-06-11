import { NgModule } from '@angular/core';
import { RouterModule, ROUTES } from '@angular/router';
import { SubscriptionPlanService } from '@hospitality-bot/admin/core/theme';
import {
  CRoutes,
  ModuleNames,
  routesFactory,
} from '@hospitality-bot/admin/shared';
import { OutletComponent } from './components/outlet/outlet.component';

const appRoutes: CRoutes = [
  {
    path: '',
    component: OutletComponent,
    name: ModuleNames.OUTLET,
    children: [
      {
        path: 'dashboard',
        name: ModuleNames.OUTLETS_DASHBOARD,
        loadChildren: () =>
          import('@hospitality-bot/admin/outlets-dashboard').then(
            (m) => m.AdminOutletsDashboardModule
          ),
      },
      {
        path: 'all-outlets',
        name: ModuleNames.ALL_OUTLETS,
        loadChildren: () =>
          import('@hospitality-bot/admin/all-outlets').then(
            (m) => m.AdminAllOutletsModule
          ),
      },
    ],
  },
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
export class AdminOutletRoutingModule {}
