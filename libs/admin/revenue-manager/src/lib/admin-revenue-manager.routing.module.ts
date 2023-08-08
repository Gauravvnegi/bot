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
import { FromToDateComponent } from './components/from-to-date/from-to-date.component';

const appRoutes: CRoutes = [
  {
    path: '',
    component: MainComponent,
    name: ModuleNames.REVENUE_MANAGER,
    children: [
      {
        path: 'setup-bar-price',
        component: BarPriceComponent,
        name: ModuleNames.REVENUE_SETUP_BAR_PRICE,
      },
      {
        path: 'dynamic-pricing',
        name: ModuleNames.REVENUE_DYNAMIC_PRICING,
        component: MainComponent,
        children: [
          {
            path: '',
            component: DynamicPricingComponent,
            name: ModuleNames.REVENUE_DYNAMIC_PRICING,
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
export class AdminRevenueMangerRoutingModule {
  static components = [
    BarPriceComponent,
    MainComponent,
    DynamicPricingComponent,
    ExceptionComponent,
    FromToDateComponent,
    OccupancyComponent,
    InventoryReallocationComponent,
    DayTimeTriggerComponent,
    RoomTypesComponent,
  ];
}
