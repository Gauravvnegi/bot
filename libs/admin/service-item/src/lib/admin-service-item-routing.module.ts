import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './components/main/main.component';
import { ServiceItemTableComponent } from './components/service-item-table/service-item-table.component';
import { CategoryDatatableComponent } from './components/category-datatable/category-datatable.component';
import { CreateCategoryComponent } from './components/create-category/create-category.component';
import { serviceItemRoutes } from './constants/routes';
import { CreateServiceItemComponent } from './components/create-service-item/create-service-item.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: '',
        component: ServiceItemTableComponent,
      },
      {
        path: serviceItemRoutes.createServiceItem.route,
        component: CreateServiceItemComponent,
      },
      {
        path: serviceItemRoutes.editServiceItem.route,
        component: CreateServiceItemComponent,
      },
      {
        path: serviceItemRoutes.manageCategory.route,
        component: MainComponent,
        children: [
          {
            path: '',
            component: CategoryDatatableComponent,
          },
          {
            path: serviceItemRoutes.createCategory.route,
            component: CreateCategoryComponent,
          },
          {
            path: serviceItemRoutes.editCategory.route,
            component: CreateCategoryComponent,
          },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminServiceItemRoutingModule {
  static components = [MainComponent, ServiceItemTableComponent];
}
