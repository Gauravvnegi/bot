import { NgModule } from '@angular/core';
import { RouterModule, ROUTES } from '@angular/router';
import { SubscriptionPlanService } from '@hospitality-bot/admin/core/theme';
import {
  CRoutes,
  ModuleNames,
  routesFactory,
} from '@hospitality-bot/admin/shared';
import { InventoryComponent } from './components/inventory/inventory.component';
import { DatatableComponent } from 'libs/admin/shared/src/lib/components/datatable/datatable.component';

const appRoutes: CRoutes = [
  {
    path: '',
    component: InventoryComponent,
    name: ModuleNames.INVENTORY,
    children: [
      {
        path: 'room',
        name: ModuleNames.ROOM,
        loadChildren: () =>
          import('@hospitality-bot/admin/room').then((m) => m.AdminRoomModule),
      },
      {
        path: 'dummy',
        name: ModuleNames.ROOM,
        component: DatatableComponent,
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
export class AdminInventoryRoutingModule {
  static components = [InventoryComponent];
}
