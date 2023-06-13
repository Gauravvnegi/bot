import { NgModule } from '@angular/core';
import { RouterModule, ROUTES } from '@angular/router';
import { SubscriptionPlanService } from '@hospitality-bot/admin/core/theme';
import {
  CRoutes,
  ModuleNames,
  routesFactory
} from '@hospitality-bot/admin/shared';
import { MainComponent } from './components/main/main.component';
import { UpdateInventoryComponent } from './components/update-inventory/update-inventory.component';
import { UpdateRatesComponent } from './components/update-rates/update-rates.component';

const appRoutes: CRoutes = [
  {
    path: '',
    component: MainComponent,
    name: ModuleNames.CHANNEL_MANAGER,
    children: [
      {
        path: 'update-rates',
        name: ModuleNames.UPDATE_RATES,
        component: UpdateRatesComponent,
      },
      {
        path: 'update-inventory',
        name: ModuleNames.UPDATE_INVENTORY,
        component: UpdateInventoryComponent,
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
