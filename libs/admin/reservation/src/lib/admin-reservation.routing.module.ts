import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { DetailsComponent } from './components';

const appRoutes: Route[] = [
  {
    path: 'test',
    component: DetailsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule],
})
export class AdminReservationRoutingModule {}
