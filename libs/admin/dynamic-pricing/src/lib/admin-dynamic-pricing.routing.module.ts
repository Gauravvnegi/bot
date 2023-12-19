import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { DayTimeTriggerComponent } from './components/day-time-trigger/day-time-trigger.component';
import { DynamicPricingCalendarViewComponent } from './components/dynamic-pricing-calendar-view/dynamic-pricing-calendar-view.component';
import { DynamicPricingComponent } from './components/dynamic-pricing/dynamic-pricing.component';
import { InventoryReallocationComponent } from './components/inventory-reallocation/inventory-reallocation.component';
import { MainComponent } from './components/main/main.component';
import { OccupancyComponent } from './components/occupancy/occupancy.component';
import { RoomTypesComponent } from './components/room-types/room-types.component';
import { RuleType, rulesRoutes } from './constants/dynamic-pricing.const';
import { MarkupDiscountComponent } from './components/markup-discount/markup-discount.component';

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
        path: rulesRoutes.OCCUPANCY,
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
        path: rulesRoutes.DAY_TIME_TRIGGER,
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
    MainComponent,
    DynamicPricingComponent,
    OccupancyComponent,
    InventoryReallocationComponent,
    DayTimeTriggerComponent,
    DynamicPricingCalendarViewComponent,
    RoomTypesComponent,
    MarkupDiscountComponent,
  ];
}
