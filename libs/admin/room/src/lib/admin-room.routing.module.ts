import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { RoomDataTableComponent } from './components/room-data-table/room-data-table.component';
import { RoomComponent } from './components/room/room.component';

export const adminRoomRoutes: Route[] = [
  {
    path: '',
    component: RoomComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(adminRoomRoutes)],
  exports: [RouterModule],
})
export class AdminRoomRoutingModule {
  static components = [RoomComponent, RoomDataTableComponent];
}
