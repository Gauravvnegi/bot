import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { AddRoomComponent } from './components/add-room/add-room.component';
import { MainComponent } from './components/main/main.component';
import { RoomDataTableComponent } from './components/room-data-table/room-data-table.component';
import { RoomTypeComponent } from './components/room-type/room-type.component';
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
        path: `${routes.addRoom}/:type`,
        component: AddRoomComponent,
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

    RoomTypeComponent,
  ];
}
