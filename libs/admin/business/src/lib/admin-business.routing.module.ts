import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { DashboardErrorComponent } from '@hospitality-bot/admin/shared';
import { BrandInfoFormComponent } from './components/brand-info-form/brand-info-form.component';
import { HotelInfoFormComponent } from './components/hotel-info-form/hotel-info-form.component';
import { MainComponent } from './components/main/main.component';
import { HotelDataTableComponent } from './components/hotel-data-table/hotel-data-table.component';
import { businessRoute } from './constant/routes';
import { ServicesComponent } from './components/services/services.component';
import { ImportServiceComponent } from './components/import-service/import-service.component';

const appRoutes: Route[] = [
  {
    path: '',
    loadChildren: () =>
      import('@hospitality-bot/admin/create-with').then(
        (m) => m.AdminCreateWithModule
      ),
  },
  {
    path: 'brand',
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
              {
                path: businessRoute.services.route,
                component: ServicesComponent,
                pathMatch: 'full',
              },
              {
                path: 'import-services',
                component: ImportServiceComponent,
                pathMatch: 'full',
              },
              {
                path: businessRoute.editHotel.route,
                component: MainComponent,
                children: [
                  {
                    path: '',
                    component: HotelInfoFormComponent,
                  },
                  {
                    path: 'outlet',
                    loadChildren: () =>
                      import('@hospitality-bot/admin/all-outlets').then(
                        (m) => m.AdminAllOutletsModule
                      ),
                  },
                  {
                    path: businessRoute.services.route,
                    component: ServicesComponent,
                    pathMatch: 'full',
                  },
                  {
                    path: 'import-services',
                    component: ImportServiceComponent,
                    pathMatch: 'full',
                  },
                ],
              },
            ],
          },
          {
            path: 'outlet',
            component: MainComponent,
            children: [
              {
                path: '',
                loadChildren: () =>
                  import('@hospitality-bot/admin/all-outlets').then(
                    (m) => m.AdminAllOutletsModule
                  ),
              },

              {
                path: ':outletId',
                loadChildren: () =>
                  import('@hospitality-bot/admin/all-outlets').then(
                    (m) => m.AdminAllOutletsModule
                  ),
              },
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
    ServicesComponent,
    ImportServiceComponent,
  ];
}
