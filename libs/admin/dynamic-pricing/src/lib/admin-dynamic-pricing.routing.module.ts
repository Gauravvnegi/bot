import { NgModule } from '@angular/core';
import { RouterModule, Route } from '@angular/router';
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
import { DynamicPricingCalendarViewComponent } from './components/dynamic-pricing-calendar-view/dynamic-pricing-calendar-view.component';

const appRoutes: Route[] = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: '',
        component: DynamicPricingCalendarViewComponent,
      },
      {
        path: 'create-season',
        component: DynamicPricingComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule],
})
export class AdminDynamicPricingRoutingModule {
  static components = [
    BarPriceComponent,
    MainComponent,
    DynamicPricingComponent,
    ExceptionComponent,
    OccupancyComponent,
    InventoryReallocationComponent,
    DayTimeTriggerComponent,
    DynamicPricingCalendarViewComponent,
    RoomTypesComponent,
  ];
}
