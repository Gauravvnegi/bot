import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LibraryService } from '@hospitality-bot/admin/library';
import { AdminSharedModule } from '@hospitality-bot/admin/shared';
import { RoomService } from 'libs/admin/room/src/lib/services/room.service';
import { PanelModule } from 'primeng/panel';
import { AdminManageInventoryRoutingModule } from './admin-manage-inventory.routing.module';
import { ChannelManagerFormService } from './services/channel-manager-form.service';
import { ChannelManagerService } from './services/channel-manager.service';

@NgModule({
  imports: [
    CommonModule,
    PanelModule,
    AdminSharedModule,
    AdminManageInventoryRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [...AdminManageInventoryRoutingModule.components],
  providers: [
    RoomService,
    LibraryService,
    ChannelManagerFormService,
    ChannelManagerService,
  ],
})
export class AdminManageInventoryModule {}
