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

const appRoutes: CRoutes = [
  {
    path: '',
    component: MainComponent,
    name: ModuleNames.CHANNEL_MANAGER,
    children: [
      {
        path: 'update-rates',
        name: ModuleNames.UPDATE_RATES,
        component: MainComponent,
        children: [
          {
            path: '',
            component: UpdateRatesComponent,
            name: ModuleNames.UPDATE_RATES,
          },
          {
            path: 'rates-bulk-update',
            component: RatesBulkUpdateComponent,
            name: ModuleNames.UPDATE_RATES,
          },
        ],
      },
      {
        path: 'update-inventory',
        name: ModuleNames.UPDATE_INVENTORY,
        component: MainComponent,
        children: [
          {
            path: '',
            component: UpdateInventoryComponent,
            name: ModuleNames.UPDATE_RATES,
          },
          {
            path: 'inventory-bulk-update',
            component: InventoryBulkUpdateComponent,
            name: ModuleNames.UPDATE_RATES,
          },
        ],
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
    UpdateRatesComponent,
    UpdateInventoryComponent,
    MainComponent,
  ];
}
