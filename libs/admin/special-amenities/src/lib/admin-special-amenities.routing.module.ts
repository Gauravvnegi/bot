import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { EditSpecialAmenitiesComponent } from './components/special-amenities/edit-special-amenities.component';
import { PackageDatatableComponent } from './components/package-datatable/package-datatable.component';
import { ComingSoonComponent } from 'libs/admin/shared/src/lib/components/coming-soon/coming-soon.component';

export const adminSpecialAmenitiesRoutes: Route[] = [
    {
      path: '',
      component: PackageDatatableComponent,
      children: [],
    },
    // {
    //   path: '',
    //   component: ComingSoonComponent,
    // },
    {
      path: 'amenity/:id',
      component: EditSpecialAmenitiesComponent,
    }
];

@NgModule({
    imports: [RouterModule.forChild(adminSpecialAmenitiesRoutes)],
    exports: [RouterModule],
  })
  
export class AdminSpecialAmenitiesRoutingModule {}