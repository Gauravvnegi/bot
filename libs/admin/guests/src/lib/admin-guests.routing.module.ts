import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { AddGuestComponent } from './components';
import { MainComponent } from './components/main/main.component';
import { manageGuestRoutes } from './constant/route';
import { GuestDatatableComponent } from './components/guest-datatable/guest-datatable.component';

const appRoutes: Route[] = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: '',
        component: GuestDatatableComponent,
      },
      {
        path: manageGuestRoutes.addGuest.route,
        component: AddGuestComponent,
      },
      {
        path: `${manageGuestRoutes.editGuest.route}/:id`,
        component: AddGuestComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule],
})
export class AdminGuestsRoutingModule {
  static components = [
    GuestDatatableComponent,
    AddGuestComponent,
    MainComponent,
  ];
}
