import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { AddReservationComponent } from './components/add-reservation/add-reservation.component';
import { MainComponent } from './components/main/main.component';
import { ManageReservationDataTableComponent } from './components/manage-reservation-data-table/manage-reservation-data-table.component';
import { manageReservationRoutes } from './constants/routes';
import { RoomIteratorComponent } from './components/room-iterator/room-iterator.component';
import { PaymentRuleComponent } from './components/form-components/payment-rule/payment-rule.component';
import { PaymentMethodComponent } from './components/form-components/payment-method/payment-method.component';
import { GuestInformationComponent } from './components/form-components/guest-information/guest-information.component';
import { BookingSummaryComponent } from './components/form-components/booking-summary/booking-summary.component';
import { ReservationComponent } from './components/reservation/reservation.component';
import { UpgradeRoomTypeComponent } from './components/upgrade-room-type/upgrade-room-type.component';

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
            component: AddReservationComponent,
          },
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
    PaymentRuleComponent,
    PaymentMethodComponent,
    GuestInformationComponent,
    BookingSummaryComponent,
    ReservationComponent,
    UpgradeRoomTypeComponent,
  ];
}
