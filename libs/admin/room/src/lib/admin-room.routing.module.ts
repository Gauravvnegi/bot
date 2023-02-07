import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { RoomTypeComponent } from './components/room-type/room-type.component';
import { AddMultipleRoomsComponent } from './components/add-multiple-rooms/add-multiple-rooms.component';
import { AddRoomComponent } from './components/add-room/add-room.component';
import { MainComponent } from './components/main/main.component';
import { RoomDataTableComponent } from './components/room-data-table/room-data-table.component';
import { RoomComponent } from './components/room/room.component';
import routes from './config/routes';

export const adminRoomRoutes: Route[] = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: routes.dashboard,
        component: RoomComponent,
      },
      {
        path: routes.addRoom,
        component: AddRoomComponent,
      },
      {
        path: routes.addMultipleRooms,
        component: AddMultipleRoomsComponent,
      },
      {
        path: routes.addRoomType,
        component: RoomTypeComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(adminRoomRoutes)],
  exports: [RouterModule],
})
export class AdminRoomRoutingModule {
  static components = [
    RoomComponent,
    RoomDataTableComponent,
    MainComponent,
    AddRoomComponent,
    AddMultipleRoomsComponent,
    RoomTypeComponent,
  ];
}
