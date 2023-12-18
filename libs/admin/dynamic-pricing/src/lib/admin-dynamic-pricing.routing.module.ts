import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { BarPriceComponent } from './components/bar-price/bar-price.component';
import { DayTimeTriggerComponent } from './components/day-time-trigger/day-time-trigger.component';
import { DynamicPricingCalendarViewComponent } from './components/dynamic-pricing-calendar-view/dynamic-pricing-calendar-view.component';
import { DynamicPricingComponent } from './components/dynamic-pricing/dynamic-pricing.component';
import { ExceptionComponent } from './components/exception/exception.component';
import { InventoryReallocationComponent } from './components/inventory-reallocation/inventory-reallocation.component';
import { MainComponent } from './components/main/main.component';
import { OccupancyComponent } from './components/occupancy/occupancy.component';
import { RoomTypesComponent } from './components/room-types/room-types.component';
import { RuleType } from './types/dynamic-pricing.types';

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
        data: { ruleType: RuleType.OCCUPANCY },
        children: [
          {
            path: '',
            component: DynamicPricingComponent,
          },
          {
            path: ':id',
            component: DynamicPricingComponent,
          },
        ],
      },
      {
        path: 'create-day-time-trigger',
        data: { ruleType: RuleType.DAY_TIME_TRIGGER },
        children: [
          {
            path: '',
            component: DynamicPricingComponent,
          },
          {
            path: ':id',
            component: DynamicPricingComponent,
          },
        ],
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
