import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { EditPackageComponent } from './components/edit-package/edit-package.component';
import { AdminPackagesWrapperComponent } from './components/admin-packages-wrapper/admin-packages-wrapper.component';
import { EditCategoryComponent } from './components/edit-category/edit-category.component';
import { ComingSoonComponent } from 'libs/admin/shared/src/lib/components/coming-soon/coming-soon.component';
import { PackageDatatableComponent } from './components/package-datatable/package-datatable.component';
import { CategoriesDatatableComponent } from './components/categories-datatable/categories-datatable.component';

export const adminPackagesRoutes: Route[] = [
  {
    path: '',
    component: AdminPackagesWrapperComponent,
    children: [],
  },
  {
    path: 'add',
    component: EditPackageComponent,
  },
  {
    path: 'edit/:id',
    component: EditPackageComponent,
  },
  {
    path: 'category',
    component: EditCategoryComponent,
  },
  {
    path: 'category/:id',
    component: EditCategoryComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(adminPackagesRoutes)],
  exports: [RouterModule],
})
export class AdminPackagesRoutingModule {
  static components = [
    EditPackageComponent,
    PackageDatatableComponent,
    CategoriesDatatableComponent,
    AdminPackagesWrapperComponent,
    EditCategoryComponent,
  ];
}
