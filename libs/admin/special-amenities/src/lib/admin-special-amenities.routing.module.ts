import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { SpecialAmenitiesComponent } from './components/special-amenities/special-amenities.component';

export const adminSpecialAmenitiesRoutes: Route[] = [
    {
      path: '',
      component: SpecialAmenitiesComponent,
      children: [],
    }
];

@NgModule({
    imports: [RouterModule.forChild(adminSpecialAmenitiesRoutes)],
    exports: [RouterModule],
  })
  
export class AdminSpecialAmenitiesRoutingModule {}