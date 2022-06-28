import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { RequestComponent } from './components/request/request.component';
import { RequestWrapperComponent } from './components/request-wrapper/request-wrapper.component';
import { RequestListComponent } from './components/request-list/request-list.component';
import { RequestDetailComponent } from './components/request-detail/request-detail.component';
import { RaiseRequestComponent } from './components/raise-request/raise-request.component';
import { RequestListFilterComponent } from './components/request-list-filter/request-list-filter.component';
import { SearchComponent } from './components/search/search.component';
import { GuestInfoComponent } from './components/guest-info/guest-info.component';
import { GuestPersonalInfoComponent } from './components/guest-personal-info/guest-personal-info.component';
import { GuestRequestsComponent } from './components/guest-requests/guest-requests.component';
import { GuestBookingInfoComponent } from './components/guest-booking-info/guest-booking-info.component';

const appRoutes: Route[] = [
  {
    path: '',
    component: RequestComponent,
    children: [
      {
        path: '',
        component: RequestWrapperComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule],
})
export class AdminRequestRoutingModule {
  static components = [
    RequestComponent,
    RequestWrapperComponent,
    RequestListComponent,
    RequestDetailComponent,
    RaiseRequestComponent,
    RequestListFilterComponent,
    SearchComponent,
    GuestInfoComponent,
    GuestPersonalInfoComponent,
    GuestBookingInfoComponent,
    GuestRequestsComponent,
  ];
}
