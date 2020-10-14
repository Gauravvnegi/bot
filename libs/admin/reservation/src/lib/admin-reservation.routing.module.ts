import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { DetailsComponent } from './components/details/details.component';

const appRoutes: Route[] = [
  {
    path: '',
    component: DetailsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule],
})
export class AdminReservationRoutingModule {}
