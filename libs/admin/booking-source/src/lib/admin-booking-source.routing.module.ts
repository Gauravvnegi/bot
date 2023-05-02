import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { MainComponent } from './components/main/main.component';
import { BookingSourceDataTableComponent } from './components/booking-source-data-table/booking-source-data-table.component';
import { bookingSourceRoutes } from './constants/routes';

export const adminBookingSourceRoutes: Route[] = [
  {
    // path: bookingSourceRoutes.bookingSource.route,
    path: '',
    component: MainComponent,
    children: [
      {
        path: '',
        component: BookingSourceDataTableComponent,
      },
      //   {
      //     path: bookingSourceRoutes.addAgent.route,
      //     component: AddAgentComponent,
      //   },
      //   {
      //     path: bookingSourceRoutes.addCompany.route,
      //     component: AddCompanyComponent,
      //   },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(adminBookingSourceRoutes)],
  exports: [RouterModule],
})
export class AdminBookingSourceRoutingModule {
  static components = [BookingSourceDataTableComponent, MainComponent];
}
