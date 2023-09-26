import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { HousekeepingComponent } from './components/housekeeping/housekeeping.component';
import { RoomCardComponent } from './components/room-card/room-card.component';
import { MainComponent } from './components/main/main.component';
import { HousekeepingService } from './services/housekeeping.service';

export const adminHousekeepingRoutes: Route[] = [
  {
    path: '',
    component: HousekeepingComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(adminHousekeepingRoutes)],
  exports: [RouterModule],
  providers: [HousekeepingService],
})
export class AdminHousekeepingRoutingModule {
  static components = [HousekeepingComponent, RoomCardComponent, MainComponent];
}
