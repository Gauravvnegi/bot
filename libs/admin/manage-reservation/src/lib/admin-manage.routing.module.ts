import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { AddReservationComponent } from './components/add-reservation/add-reservation.component';
import { MainComponent } from './components/main/main.component';
import { ManageReservationDataTableComponent } from './components/manage-reservation-data-table/manage-reservation-data-table.component';
import { manageReservationRoutes } from './constants/routes';
import { RoomIteratorComponent } from './components/room-iterator/room-iterator.component';
import { AddGuestComponent } from './components/add-guest/add-guest.component';

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
        component: AddReservationComponent,
      },
      {
        path: `${manageReservationRoutes.editReservation.route}/:id`,
        component: AddReservationComponent,
      },
      {
        path: `${manageReservationRoutes.addReservation.route}/${manageReservationRoutes.addGuest.route}`,
        component: AddGuestComponent,
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
  ];
}
