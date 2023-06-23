import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { AddReservationComponent } from './components/add-reservation/add-reservation.component';
import { MainComponent } from './components/main/main.component';
import { ManageReservationDataTableComponent } from './components/manage-reservation-data-table/manage-reservation-data-table.component';
import { manageReservationRoutes } from './constants/routes';
import { RoomIteratorComponent } from './components/room-iterator/room-iterator.component';
import { AddGuestComponent } from './components/add-guest/add-guest.component';
import { BookingInfoComponent } from './components/form-components/booking-info/booking-info.component';
import { SpaReservationComponent } from './components/spa-reservation/spa-reservation.component';
import { RestaurantReservationComponent } from './components/restaurant-reservation/restaurant-reservation.component';
import { VenueReservationComponent } from './components/venue-reservation/venue-reservation.component';
import { PaymentRuleComponent } from './components/form-components/payment-rule/payment-rule.component';
import { PaymentMethodComponent } from './components/form-components/payment-method/payment-method.component';
import { InstructionsComponent } from './components/form-components/instructions/instructions.component';
import { BillingAddressComponent } from './components/form-components/billing-address/billing-address.component';
import { GuestInformationComponent } from './components/form-components/guest-information/guest-information.component';
import { BookingSummaryComponent } from './components/form-components/booking-summary/booking-summary.component';

export const adminManageReservationRoutes: Route[] = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: manageReservationRoutes.manageReservation.route,
        component: ManageReservationDataTableComponent,
      },
      {
        path: manageReservationRoutes.addReservation.route,
        component: MainComponent,
        children: [
          {
            path: '',
            component: AddReservationComponent,
          },
          {
            path: manageReservationRoutes.addGuest1.route,
            component: AddGuestComponent,
          }
        ],
      },
      {
        path: `${manageReservationRoutes.editReservation.route}/:id`,
        component: MainComponent,
        children: [
          {
            path: '',
            component: AddReservationComponent,
          },
          {
            path: manageReservationRoutes.addGuest1.route,
            component: AddGuestComponent,
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
    AddGuestComponent,
    BookingInfoComponent,
    PaymentRuleComponent,
    PaymentMethodComponent,
    SpaReservationComponent,
    RestaurantReservationComponent,
    VenueReservationComponent,
    InstructionsComponent,
    BillingAddressComponent,
    GuestInformationComponent,
    BookingSummaryComponent
  ];
}
