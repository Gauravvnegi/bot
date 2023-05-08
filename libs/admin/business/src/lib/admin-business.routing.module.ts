import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { DashboardErrorComponent } from '@hospitality-bot/admin/shared';
import { BrandInfoFormComponent } from './components/brand-info-form/brand-info-form.component';
import { HotelDataTableComponent } from './components/hotel-data-table/hotel-data-table.component';
import { HotelInfoFormComponent } from './components/hotel-info-form/hotel-info-form.component';
import { MainComponent } from './components/main/main.component';

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
        path: ':brandId',
        component: MainComponent,
        children: [
          {
            path: '',
            component: BrandInfoFormComponent,
          },
          {
            path: 'hotel',
            component: MainComponent,
            children: [
              {
                path: '',
                component: HotelInfoFormComponent,
              },
              { path: ':hotelId', component: HotelInfoFormComponent },
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
