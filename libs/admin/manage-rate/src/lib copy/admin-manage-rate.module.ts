import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminSharedModule } from '@hospitality-bot/admin/shared';
import { PanelModule } from 'primeng/panel';
import { AdminManageRateRoutingModule } from './admin-manage-rate.routing.module';
import { RoomService } from 'libs/admin/room/src/lib/services/room.service';
import { LibraryService } from '@hospitality-bot/admin/library';
import { ChannelManagerFormService } from './services/channel-manager-form.service';
import { ChannelManagerService } from './services/channel-manager.service';

@NgModule({
  imports: [
    CommonModule,
    PanelModule,
    AdminSharedModule,
    AdminManageRateRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [...AdminManageRateRoutingModule.components],
  providers: [
    RoomService,
    LibraryService,
    ChannelManagerFormService,
    ChannelManagerService,
  ],
})
export class AdminManageRateModule {}
