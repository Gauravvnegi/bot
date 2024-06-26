import { NgModule } from '@angular/core';
import { RouterModule, ROUTES } from '@angular/router';
import { SubscriptionPlanService } from '@hospitality-bot/admin/core/theme';
import {
  CRoutes,
  ModuleNames,
  routesFactory,
} from '@hospitality-bot/admin/shared';
import { MainComponent } from './components/main/main.component';
import { DynamicPricingComponent } from './components/dynamic-pricing/dynamic-pricing.component';
import { OccupancyComponent } from './components/occupancy/occupancy.component';
import { InventoryReallocationComponent } from './components/inventory-reallocation/inventory-reallocation.component';
import { DayTimeTriggerComponent } from './components/day-time-trigger/day-time-trigger.component';
import { BarPriceComponent } from './components/bar-price/bar-price.component';
import { RoomTypesComponent } from './components/room-types/room-types.component';
import { ExceptionComponent } from './components/exception/exception.component';

const appRoutes: CRoutes = [
  {
    path: '',
    component: MainComponent,
    name: ModuleNames.REVENUE_MANAGER,
    children: [
      // {
      //   path: 'setup-bar-price',
      //   component: BarPriceComponent,
      //   name: ModuleNames.SETUP_BAR_PRICE,
      // },
      // {
      //   path: 'dynamic-pricing',
      //   name: ModuleNames.DYNAMIC_PRICING,
      //   component: DynamicPricingComponent,
      // },
      {
        path: 'setup-bar-price',
        name: ModuleNames.SETUP_BAR_PRICE,
        loadChildren: () =>
          import('@hospitality-bot/admin/setup-bar-price').then(
            (m) => m.AdminSetupBarPriceModule
          ),
      },
      {
        path: 'dynamic-pricing',
        name: ModuleNames.DYNAMIC_PRICING,
        loadChildren: () =>
          import('@hospitality-bot/admin/dynamic-pricing').then(
            (m) => m.AdminDynamicPricingModule
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
export class AdminRevenueMangerRoutingModule {
  static components = [
    BarPriceComponent,
    MainComponent,
    DynamicPricingComponent,
    ExceptionComponent,
    OccupancyComponent,
    InventoryReallocationComponent,
    DayTimeTriggerComponent,
    RoomTypesComponent,
  ];
}
