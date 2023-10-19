import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { AddReservationComponent } from './components/add-reservation/add-reservation.component';
import { MainComponent } from './components/main/main.component';
import { ManageReservationDataTableComponent } from './components/manage-reservation-data-table/manage-reservation-data-table.component';
import { manageReservationRoutes } from './constants/routes';
import { RoomIteratorComponent } from './components/room-iterator/room-iterator.component';
import { BookingInfoComponent } from './components/form-components/booking-info/booking-info.component';
import { SpaReservationComponent } from './components/spa-reservation/spa-reservation.component';
import { RestaurantReservationComponent } from './components/restaurant-reservation/restaurant-reservation.component';
import { VenueReservationComponent } from './components/venue-reservation/venue-reservation.component';
import { PaymentRuleComponent } from './components/form-components/payment-rule/payment-rule.component';
import { PaymentMethodComponent } from './components/form-components/payment-method/payment-method.component';
import { GuestInformationComponent } from './components/form-components/guest-information/guest-information.component';
import { BookingSummaryComponent } from './components/form-components/booking-summary/booking-summary.component';
import { ReservationFormWrapperComponent } from './components/reservation-form-wrapper/reservation-form-wrapper.component';
import { ReservationComponent } from './components/reservation/reservation.component';

export const adminManageReservationRoutes: Route[] = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: manageReservationRoutes.manageReservation.route,
        component: ReservationComponent,
      },
      {
        path: manageReservationRoutes.addReservation.route,
        component: MainComponent,
        children: [
          {
            path: '',
            component: ReservationFormWrapperComponent,
          },
        ],
      },
      {
        path: `${manageReservationRoutes.editReservation.route}/:id`,
        component: MainComponent,
        children: [
          {
            path: '',
            component: ReservationFormWrapperComponent,
          },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(adminManageReservationRoutes)],
  exports: [RouterModule],
})
export class AdminManageReservationRoutingModule {
  static components = [
    AddReservationComponent,
    MainComponent,
    ManageReservationDataTableComponent,
    RoomIteratorComponent,
    BookingInfoComponent,
    PaymentRuleComponent,
    PaymentMethodComponent,
    SpaReservationComponent,
    RestaurantReservationComponent,
    VenueReservationComponent,
    GuestInformationComponent,
    BookingSummaryComponent,
    ReservationFormWrapperComponent,
    ReservationComponent,
  ];
}
