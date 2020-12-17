import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { EditPackageComponent } from './components/edit-package/edit-package.component';
import { AdminPackagesWrapperComponent } from './components/admin-packages-wrapper/admin-packages-wrapper.component';
import { EditCategoryComponent } from './components/edit-category/edit-category.component';

export const adminSpecialAmenitiesRoutes: Route[] = [
  {
    path: '',
    component: AdminPackagesWrapperComponent,
    children: [],
  },
  {
    path: 'amenity',
    component: EditPackageComponent,
  },
  {
    path: 'amenity/:id',
    component: EditPackageComponent,
  },
  {
    path: 'category',
    component: EditCategoryComponent,
  },
  {
    path: 'category/:id',
    component: EditCategoryComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(adminSpecialAmenitiesRoutes)],
  exports: [RouterModule],
})
export class AdminSpecialAmenitiesRoutingModule {}
