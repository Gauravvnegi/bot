import { NgModule } from '@angular/core';
import { RouterModule, ROUTES, Route } from '@angular/router';
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
import { BarPricePreviewComponent } from './components/bar-price-preview/bar-price-preview.component';

const appRoutes: Route[] = [
  {
    path: '',
    component: BarPriceComponent,
    // name: ModuleNames.REVENUE_MANAGER,
    // children: [
    //   {
    //     path: 'setup-bar-price',
    //     component: BarPriceComponent,
    //     name: ModuleNames.SETUP_BAR_PRICE,
    //   },
    //   {
    //     path: 'dynamic-pricing',
    //     name: ModuleNames.DYNAMIC_PRICING,
    //     component: DynamicPricingComponent,
    //   },
    // ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule],
})
export class AdminSetupBarPriceRoutingModule {
  static components = [
    BarPriceComponent,
    MainComponent,
    DynamicPricingComponent,
    ExceptionComponent,
    OccupancyComponent,
    InventoryReallocationComponent,
    DayTimeTriggerComponent,
    BarPricePreviewComponent,
    RoomTypesComponent,
  ];
}
