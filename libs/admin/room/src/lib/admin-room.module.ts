import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AdminSharedModule } from '@hospitality-bot/admin/shared';
import { AdminRoomRoutingModule } from './admin-room.routing.module';
import { RoomService } from './services/room.service';

import { MatGridListModule } from '@angular/material/grid-list';
import { PackageService } from 'libs/admin/packages/src/lib/services/package.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    AdminRoomRoutingModule,
    AdminSharedModule,
    FormsModule,
    ReactiveFormsModule,
    MatGridListModule,
  ],
  declarations: [...AdminRoomRoutingModule.components],
  providers: [RoomService, PackageService],
})
export class AdminRoomModule {}
