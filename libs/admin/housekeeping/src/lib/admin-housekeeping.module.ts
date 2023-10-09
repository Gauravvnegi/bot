import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AdminSharedModule } from '@hospitality-bot/admin/shared';
import { AdminHousekeepingRoutingModule } from './admin-housekeeping.routing.module';
import { DialogModule } from 'primeng/dialog';
import { RoomService } from 'libs/admin/room/src/lib/services/room.service';
import { AdminChannelManagerModule } from '@hospitality-bot/admin/channel-manager';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    AdminSharedModule,
    DialogModule,
    FormsModule,
    ReactiveFormsModule,
    AdminHousekeepingRoutingModule,
    AdminChannelManagerModule,
  ],
  declarations: [...AdminHousekeepingRoutingModule.components],
  providers: [RoomService],
})
export class AdminHousekeepingModule {}
