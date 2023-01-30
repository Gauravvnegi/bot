import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AdminSharedModule } from '@hospitality-bot/admin/shared';
import { AdminRoomRoutingModule } from './admin-room.routing.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    AdminRoomRoutingModule,
    AdminSharedModule,
  ],
  declarations: [...AdminRoomRoutingModule.components],
  providers: [],
})
export class AdminRoomModule {}
