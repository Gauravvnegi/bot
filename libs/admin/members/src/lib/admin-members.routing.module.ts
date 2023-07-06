import { NgModule } from '@angular/core';
import { RouterModule, ROUTES } from '@angular/router';
import { SubscriptionPlanService } from '@hospitality-bot/admin/core/theme';
import {
  CRoutes,
  ModuleNames,
  routesFactory,
} from '@hospitality-bot/admin/shared';
import { MainComponent } from './components/main/main.component';

const appRoutes: CRoutes = [
  {
    path: '',
    component: MainComponent,
    name: ModuleNames.MEMBERS, // replace by MEMBERS
    children: [
      {
        path: 'guests',
        name: ModuleNames.GUESTS, // replace by GUESTS
        loadChildren: () =>
          import('@hospitality-bot/admin/guests').then(
            (m) => m.AdminGuestsModule
          ),
      },
      {
        path: 'guest-dashboard',
        name: ModuleNames.GUEST_DASHBOARD,
        loadChildren: () =>
          import('@hospitality-bot/admin/guest-dashboard').then(
            (m) => m.AdminGuestDashboardModule
          ),
      },
      {
        path: 'agent',
        name: ModuleNames.AGENT,
        loadChildren: () =>
          import('@hospitality-bot/admin/agent').then(
            (m) => m.AdminAgentModule
          ),
      },
      {
        path: 'company',
        name: ModuleNames.COMPANY,
        loadChildren: () =>
          import('@hospitality-bot/admin/company').then(
            (m) => m.AdminCompanyModule
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
export class AdminMembersRoutingModule {
  static components = [MainComponent];
}
