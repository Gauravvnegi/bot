import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { RoomTypeComponent } from './components/room-type/room-type.component';
import { RoomComponent } from './components/room/room.component';

export const adminRoomRoutes: Route[] = [
  {
    path: '',
    component: RoomComponent,
  },
  {
    path: 'room-type',
    component: RoomTypeComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(adminRoomRoutes)],
  exports: [RouterModule],
})
export class AdminRoomRoutingModule {
  static components = [RoomComponent, RoomTypeComponent];
}
