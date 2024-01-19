import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { OutletComponent } from './components/outlet/outlet.component';
import { OutletsDataTableComponent } from './components/outlets-data-table/outlets-data-table.component';
import { MainComponent } from './components/main/main.component';
import { ReservationCardComponent } from './components/reservation-card/reservation-card.component';
import { PosReservationComponent } from './components/pos-reservation/pos-reservation.component';
import { MenuItemCardComponent } from './components/menu-item-card/menu-item-card.component';
import { OrderSummaryComponent } from './components/order-summary/order-summary.component';
import { GuestCardComponent } from './components/guest-card/guest-card.component';
import { GuestListComponent } from './components/guest-list/guest-list.component';
import { AddGuestListComponent } from './components/add-guest-list/add-guest-list.component';

const appRoutes: Route[] = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: '',
        component: OutletComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule],
})
export class AdminOutletsDashboardRoutingModule {
  static components = [
    MainComponent,
    OutletComponent,
    OutletsDataTableComponent,
    ReservationCardComponent,
    PosReservationComponent,
    MenuItemCardComponent,
    OrderSummaryComponent,
    GuestCardComponent,
    GuestListComponent,
    AddGuestListComponent,
  ];
}
