import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { AdminPackagesWrapperComponent } from './components/admin-packages-wrapper/admin-packages-wrapper.component';
import { CategoriesDatatableComponent } from './components/categories-datatable/categories-datatable.component';
import { CreateCategoryComponent } from './components/create-category/create-category.component';
import { CreatePackageComponent } from './components/create-package/create-package.component';
import { EditCategoryComponent } from './components/edit-category/edit-category.component';
import { EditPackageComponent } from './components/edit-package/edit-package.component';
import { MainComponent } from './components/main/main.component';
import { PackageDataTableComponent } from './components/package-datatable/package-datatable.component';
import routes from './constant/routes';

export const adminPackagesRoutes: Route[] = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: '',
        component: PackageDataTableComponent,
      },
      {
        path: routes.createPackage,
        component: MainComponent,
        children: [
          {
            path: '',
            component: CreatePackageComponent,
          },
          {
            path: ':id',
            component: CreatePackageComponent,
          },
        ],
      },
      {
        path: routes.createCategory,
        component: CreateCategoryComponent,
      },
    ],
  },

  // {
  //   path: 'add',
  //   component: EditPackageComponent,
  // },
  // {
  //   path: 'edit/:id',
  //   component: EditPackageComponent,
  // },
  // {
  //   path: 'category',
  //   component: EditCategoryComponent,
  // },
  // {
  //   path: 'category/:id',
  //   component: EditCategoryComponent,
  // },
];

@NgModule({
  imports: [RouterModule.forChild(adminPackagesRoutes)],
  exports: [RouterModule],
})
export class AdminPackagesRoutingModule {
  static components = [
    EditPackageComponent,
    PackageDataTableComponent,
    CategoriesDatatableComponent,
    AdminPackagesWrapperComponent,
    EditCategoryComponent,
    CreatePackageComponent,
    CreateCategoryComponent,
    MainComponent,
  ];
}
