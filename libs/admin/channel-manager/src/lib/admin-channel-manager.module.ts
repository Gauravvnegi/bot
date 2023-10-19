import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminSharedModule } from '@hospitality-bot/admin/shared';
import { PanelModule } from 'primeng/panel';
import { AdminChannelMangerRoutingModule } from './admin-channel-manager.routing.module';
import { RoomService } from 'libs/admin/room/src/lib/services/room.service';
import { LibraryService } from '@hospitality-bot/admin/library';
import { ChannelManagerFormService } from './services/channel-manager-form.service';
import { ChannelManagerService } from './services/channel-manager.service';
import { RoomTypesComponent } from './components/room-types/room-types.component';

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
  exports: [RoomTypesComponent],
  providers: [
    RoomService,
    LibraryService,
    ChannelManagerFormService,
    ChannelManagerService,
  ],
})
export class AdminChannelManagerModule {}
