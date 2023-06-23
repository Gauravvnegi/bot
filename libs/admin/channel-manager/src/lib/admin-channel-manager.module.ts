import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminSharedModule } from '@hospitality-bot/admin/shared';
import { PanelModule } from 'primeng/panel';
import { AdminChannelMangerRoutingModule } from './admin-channel-manager.routing.module';
import { RoomService } from 'libs/admin/room/src/lib/services/room.service';
import { LibraryService } from '@hospitality-bot/admin/library';

@NgModule({
  imports: [
    CommonModule,
    PanelModule,
    AdminSharedModule,
    AdminChannelMangerRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [...AdminChannelMangerRoutingModule.components],
  providers: [RoomService, LibraryService],
})
export class AdminChannelManagerModule {}
