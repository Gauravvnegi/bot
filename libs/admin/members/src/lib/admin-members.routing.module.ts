import { NgModule } from '@angular/core';
import { RouterModule, ROUTES } from '@angular/router';
import { SubscriptionPlanService } from '@hospitality-bot/admin/core/theme';
import {
  CRoutes,
  ModuleNames,
  routesFactory,
} from '@hospitality-bot/admin/shared';
import { MembersComponent } from './members/members.component';


const appRoutes: CRoutes = [
  {
    path: '',
    component: MembersComponent,
    name: ModuleNames.MEMBERS,
    children: [
      {
        path: 'booking-source',
        name: ModuleNames.BOOKING_SOURCE,
        loadChildren: () =>
          import('@hospitality-bot/admin/booking-source').then(
            (m) => m.AdminBookingSourceModule
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
export class AdminMembersRoutingModule {}