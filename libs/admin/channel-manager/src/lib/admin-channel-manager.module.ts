import { AngularDraggableModule } from 'angular2-draggable';
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

@NgModule({
  imports: [
    AngularDraggableModule,
    CommonModule,
    PanelModule,
    AdminSharedModule,
    AdminChannelMangerRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [...AdminChannelMangerRoutingModule.components],
  providers: [
    RoomService,
    LibraryService,
    ChannelManagerFormService,
    ChannelManagerService,
  ],
})
export class AdminChannelManagerModule {}
