import { NgModule } from '@angular/core';
import { RouterModule, ROUTES } from '@angular/router';
import { SubscriptionPlanService } from '@hospitality-bot/admin/core/theme';
import {
  CRoutes,
  ModuleNames,
  routesFactory,
} from '@hospitality-bot/admin/shared';
import { RoomComponent } from './components/room/room.component';

const appRoutes: CRoutes = [
  {
    path: 'room',
    name: ModuleNames.ROOM,
    component: RoomComponent,
  },
  {
    path: '',
    redirectTo: 'room',
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
export class AdminInventoryRoutingModule {
  static components = [RoomComponent];
}
