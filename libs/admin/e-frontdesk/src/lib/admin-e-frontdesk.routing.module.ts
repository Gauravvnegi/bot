import { NgModule } from '@angular/core';
import { RouterModule, ROUTES } from '@angular/router';
import { SubscriptionPlanService } from '@hospitality-bot/admin/core/theme';
import { ModuleNames } from '@hospitality-bot/admin/shared';
import { CRoutes, routesFactory } from 'libs/admin/shared/src';
import { EFrontDeskComponent } from './components/e-front-desk/e-front-desk.component';

const appRoutes: CRoutes = [
  {
    path: '',
    component: EFrontDeskComponent,
    name: ModuleNames.FRONT_DESK_HOME,
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
        path: 'in-house-guest',
        name: ModuleNames.IN_HOUSE_GUEST,
        loadChildren: () =>
          import('@hospitality-bot/admin/guest-dashboard').then(
            (m) => m.AdminGuestDashboardModule
          ),
      },
      {
        path: 'complaint-analytics',
        name: ModuleNames.COMPLAINT_DASHBOARD,
        loadChildren: () =>
          import('@hospitality-bot/admin/request-analytics').then(
            (m) => m.AdminRequestAnalyticsModule
          ),
      },
      {
        path: 'complaint',
        name: ModuleNames.COMPLAINTS,
        loadChildren: () =>
          import('@hospitality-bot/admin/request').then(
            (m) => m.AdminRequestModule
          ),
      },
      {
        path: 'reservation',
        name: ModuleNames.ADD_RESERVATION,
        loadChildren: () =>
          import('@hospitality-bot/admin/manage-reservation').then(
            (m) => m.AdminManageReservationModule
          ),
      },
      {
        path: 'room',
        name: ModuleNames.ROOM,
        loadChildren: () =>
          import('@hospitality-bot/admin/room').then((m) => m.AdminRoomModule),
      },
      {
        path: 'housekeeping',
        name: ModuleNames.HOUSEKEEPING,
        loadChildren: () =>
          import('@hospitality-bot/admin/housekeeping').then(
            (m) => m.AdminHousekeepingModule
          ),
      },
      {
        path: 'invoice',
        name: ModuleNames.FRONT_DESK,
        loadChildren: () =>
          import('@hospitality-bot/admin/invoice').then(
            (m) => m.AdminInvoiceModule
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
export class AdminEFrontdeskRoutingModule {}
