import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { DashboardErrorComponent } from '@hospitality-bot/admin/shared';
import { BrandInfoFormComponent } from './components/brand-info-form/brand-info-form.component';
import { HotelInfoFormComponent } from './components/hotel-info-form/hotel-info-form.component';
import { MainComponent } from './components/main/main.component';
import { HotelDataTableComponent } from './components/hotel-data-table/hotel-data-table.component';
import { businessRoute } from './constant/routes';

const appRoutes: Route[] = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: '',
        component: BrandInfoFormComponent,
      },
      {
        path: businessRoute.editBrand.route,
        component: MainComponent,
        children: [
          {
            path: '',
            component: BrandInfoFormComponent,
          },
          {
            path: businessRoute.hotel.route,
            component: MainComponent,
            children: [
              {
                path: '',
                component: HotelInfoFormComponent,
              },
              { path: businessRoute.editHotel.route, component: HotelInfoFormComponent },
            ],
          },
        ],
      },
      { path: '**', redirectTo: '404' },
      { path: '404', component: DashboardErrorComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule],
})
export class AdminBusinessRoutingModule {
  static components = [
    MainComponent,
    BrandInfoFormComponent,
    HotelInfoFormComponent,
    HotelDataTableComponent,
  ];
}
