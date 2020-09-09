import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { EditSpecialAmenitiesComponent } from './components/special-amenities/edit-special-amenities.component';
import { PackageDatatableComponent } from './components/package-datatable/package-datatable.component';

export const adminSpecialAmenitiesRoutes: Route[] = [
    {
      path: '',
      component: PackageDatatableComponent,
      children: [],
    },
    {
      path: 'amenity',
      component: EditSpecialAmenitiesComponent,
    }
];

@NgModule({
    imports: [RouterModule.forChild(adminSpecialAmenitiesRoutes)],
    exports: [RouterModule],
  })
  
export class AdminSpecialAmenitiesRoutingModule {}