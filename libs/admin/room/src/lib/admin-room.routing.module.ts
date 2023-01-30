import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
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
  static components = [RoomComponent];
}
