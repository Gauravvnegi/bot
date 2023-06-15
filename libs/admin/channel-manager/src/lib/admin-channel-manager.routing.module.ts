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
import { BulkUpdateComponent } from './components/bulk-update/bulk-update.component';

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
          { path: '', component: UpdateRatesComponent },
          {
            path: 'bulk-update',
            component: BulkUpdateComponent,
          },
        ],
      },
      {
        path: 'update-inventory',
        name: ModuleNames.UPDATE_INVENTORY,
        component: MainComponent,
        children: [
          { path: '', component: UpdateInventoryComponent },
          {
            path: 'bulk-update',
            component: BulkUpdateComponent,
          },
        ],
      },
    ],
  },
];

// need to fix the routesFactory
@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  // providers: [
  //   {
  //     provide: ROUTES,
  //     useFactory: (subscriptionService: SubscriptionPlanService) =>
  //       routesFactory(appRoutes, [subscriptionService]),
  //     multi: true,
  //     deps: [SubscriptionPlanService],
  //   },
  // ],
  exports: [RouterModule],
})
export class AdminChannelMangerRoutingModule {
  static components = [
    UpdateRatesComponent,
    UpdateInventoryComponent,
    MainComponent,
  ];
}
