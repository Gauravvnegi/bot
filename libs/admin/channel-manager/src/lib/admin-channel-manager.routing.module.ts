import { NgModule } from '@angular/core';
import { RouterModule, ROUTES } from '@angular/router';
import { SubscriptionPlanService } from '@hospitality-bot/admin/core/theme';
import {
  CRoutes,
  ModuleNames,
  routesFactory,
} from '@hospitality-bot/admin/shared';
import { MainComponent } from './components/main/main.component';
import { RoomTypesComponent } from './components/room-types/room-types.component';
import { UpdateReservationComponent } from './components/update-reservation/update-reservation.component';

const appRoutes: CRoutes = [
  {
    path: 'room',
    name: ModuleNames.ROOM,
    loadChildren: () =>
      import('@hospitality-bot/admin/room').then((m) => m.AdminRoomModule),
  },
  {
    path: 'setup-bar-price',
    name: ModuleNames.SETUP_BAR_PRICE,
    loadChildren: () =>
      import('@hospitality-bot/admin/setup-bar-price').then(
        (m) => m.AdminSetupBarPriceModule
      ),
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
export class AdminChannelMangerRoutingModule {
  static components = [
    UpdateReservationComponent,
    MainComponent,
    RoomTypesComponent,
  ];
}
