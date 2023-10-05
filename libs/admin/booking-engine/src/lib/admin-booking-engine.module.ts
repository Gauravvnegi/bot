import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ROUTES, RouterModule } from '@angular/router';
import { SubscriptionPlanService } from '@hospitality-bot/admin/core/theme';
import {
  CRoutes,
  ModuleNames,
  routesFactory,
} from '@hospitality-bot/admin/shared';
import { MainComponent } from './component/main/main.component';

const appRoutes: CRoutes = [
  {
    path: '',
    component: MainComponent,
    name: ModuleNames.BOOKING_ENGINE,
    children: [
      {
        path: 'room',
        name: ModuleNames.ROOM,
        loadChildren: () =>
          import('@hospitality-bot/admin/request-analytics').then(
            (m) => m.AdminRequestAnalyticsModule
          ),
      },
      {
        path: 'reservation',
        name: ModuleNames.ADD_RESERVATION,
        loadChildren: () =>
          import('@hospitality-bot/admin/request').then(
            (m) => m.AdminRequestModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild([])],
  providers: [
    {
      provide: ROUTES,
      useFactory: (subscriptionService: SubscriptionPlanService) =>
        routesFactory(appRoutes, [subscriptionService]),
      multi: true,
      deps: [SubscriptionPlanService],
    },
  ],
  declarations: [MainComponent],
})
export class AdminBookingEngineModule {}
