import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { ChannelUsageComponent } from './components/channel-usage/channel-usage.component';
import { GuestUsageComponent } from './components/guest-usage/guest-usage.component';
import { HotelUsageDatatableComponent } from './components/hotel-usage-datatable/hotel-usage-datatable.component';
import { OcrUsageComponent } from './components/ocr-usage/ocr-usage.component';
import { StatisticsComponent } from './components/statistics/statistics.component';
import { SubscriptionComponent } from "./components/subscription/subscription.component";
import { UsersUsageComponent } from './components/users-usage/users-usage.component';

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
		UsersUsageComponent,
		OcrUsageComponent,
		GuestUsageComponent,
		ChannelUsageComponent
  ];
}
