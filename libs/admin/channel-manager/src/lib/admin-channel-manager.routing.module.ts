import { NgModule } from '@angular/core';
import { RouterModule, ROUTES } from '@angular/router';
import { SubscriptionPlanService } from '@hospitality-bot/admin/core/theme';
import {
  CRoutes,
  ModuleNames,
  routesFactory,
} from '@hospitality-bot/admin/shared';
import { MainComponent } from './components/main/main.component';
import { UpdateInventoryComponent } from './components/update-inventory/update-inventory.component';
import { UpdateRatesComponent } from './components/update-rates/update-rates.component';
import { RatesBulkUpdateComponent } from './components/rates-bulk-update/rates-bulk-update.component';
import { InventoryBulkUpdateComponent } from './components/inventory-bulk-update/inventory-bulk-update.component';
import { BulkUpdateFormComponent } from './components/bulk-update-form/bulk-update-form.component';
import { RatesNestedCheckboxTreeComponent } from './components/rates-nested-checkbox-tree/rates-nested-checkbox-tree.component';
import { NestedPanelComponent } from './components/rates-nested-checkbox-tree/nested-panel/nested-panel.component';
import { InventoryNestedCheckboxTreeComponent } from './components/inventory-nested-checkbox-tree/inventory-nested-checkbox-tree.component';
import { RoomTypesComponent } from './components/room-types/room-types.component';
import { UpdateReservationComponent } from './components/update-reservation/update-reservation.component';

const appRoutes: CRoutes = [
  {
    path: '',
    component: MainComponent,
    name: ModuleNames.CHANNEL_MANAGER_HOME,
    children: [
      {
        path: 'update-rates',
        name: ModuleNames.MANAGE_RATE,
        component: MainComponent,
        children: [
          {
            path: '',
            component: UpdateRatesComponent,
            name: ModuleNames.MANAGE_RATE,
          },
          {
            path: 'rates-bulk-update',
            component: RatesBulkUpdateComponent,
            name: ModuleNames.MANAGE_RATE,
          },
        ],
      },
      {
        path: 'update-inventory',
        name: ModuleNames.MANAGE_INVENTORY,
        component: MainComponent,
        children: [
          {
            path: '',
            component: UpdateInventoryComponent,
            name: ModuleNames.MANAGE_INVENTORY,
          },
          {
            path: 'inventory-bulk-update',
            component: InventoryBulkUpdateComponent,
            name: ModuleNames.MANAGE_INVENTORY,
          },
        ],
      },
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
          import('@hospitality-bot/admin/revenue-manager').then(
            (m) => m.AdminRevenueManagerModule
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
export class AdminChannelMangerRoutingModule {
  static components = [
    UpdateReservationComponent,
    UpdateRatesComponent,
    UpdateInventoryComponent,
    BulkUpdateFormComponent,
    MainComponent,
    RatesNestedCheckboxTreeComponent,
    NestedPanelComponent,
    RatesBulkUpdateComponent,
    InventoryBulkUpdateComponent,
    InventoryNestedCheckboxTreeComponent,
    RoomTypesComponent,
  ];
}
