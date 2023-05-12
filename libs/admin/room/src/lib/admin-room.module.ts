import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  AdminSharedModule,
  getTranslationConfigs,
} from '@hospitality-bot/admin/shared';
import { TranslateModule } from '@ngx-translate/core';
import { AdminRoomRoutingModule } from './admin-room.routing.module';
import { RoomService } from './services/room.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ChartsModule } from 'ng2-charts';
import { LibraryService } from '@hospitality-bot/admin/library';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    AdminRoomRoutingModule,
    AdminSharedModule,
    FormsModule,
    ChartsModule,
    ReactiveFormsModule,
    MatTooltipModule,
    TranslateModule.forChild(getTranslationConfigs([HttpClient], ['room'])),
  ],
  declarations: [...AdminRoomRoutingModule.components],
  providers: [RoomService, LibraryService],
})
export class AdminRoomModule {}
