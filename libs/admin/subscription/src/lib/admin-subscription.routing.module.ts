import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { HotelUsageDatatableComponent } from './components/hotel-usage-datatable/hotel-usage-datatable.component';
import { StatisticsComponent } from './components/statistics/statistics.component';
import { SubscriptionComponent } from "./components/subscription/subscription.component";

const appRoutes: Route[] = [
  {
    path: '',
    component: SubscriptionComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule],
})
export class AdminSubscriptionRoutingModule {
  static components = [
		SubscriptionComponent,
		StatisticsComponent,
		HotelUsageDatatableComponent,
  ];
}
