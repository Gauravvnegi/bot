import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { CreateCategoryComponent } from './components/create-category/create-category.component';
import { CreateServiceComponent } from './components/create-service/create-service.component';
import { MainComponent } from './components/main/main.component';
import { ServicesDataTableComponent } from './components/services-data-table/services-data-table.component';
import { servicesRoutes } from './constant/routes';

export const adminServicesRoutes: Route[] = [
  {
    path: servicesRoutes.services.route,
    component: MainComponent,
    children: [
      {
        path: '',
        component: ServicesDataTableComponent,
      },
      {
        path: servicesRoutes.createService.route,
        component: MainComponent,
        children: [
          {
            path: '',
            component: CreateServiceComponent,
          },
          {
            path: ':id',
            component: CreateServiceComponent,
          },
        ],
      },
      {
        path: servicesRoutes.createCategory.route,
        component: CreateCategoryComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(adminServicesRoutes)],
  exports: [RouterModule],
})
export class AdminServicesRoutingModule {
  static components = [
    ServicesDataTableComponent,
    CreateServiceComponent,
    MainComponent,
    CreateCategoryComponent,
  ];
}
