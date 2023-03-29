import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { AddReservationComponent } from './components/add-reservation/add-reservation.component';
import { MainComponent } from './components/main/main.component';
import { ManageReservationDataTableComponent } from './components/manage-reservation-data-table/manage-reservation-data-table.component';
import { manageReservationRoutes } from './constants/routes';
import { InvoiceComponent } from './components/invoice/invoice.component';

export const adminManageReservationRoutes: Route[] = [
  {
    path: manageReservationRoutes.manageReservation.route,
    component: MainComponent,
    children: [
      {
        path: '',
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
        path: manageReservationRoutes.invoice.route,
        component: InvoiceComponent,
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
    InvoiceComponent,
  ];
}
