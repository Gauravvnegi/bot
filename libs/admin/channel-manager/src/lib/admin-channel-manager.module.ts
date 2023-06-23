import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminSharedModule } from '@hospitality-bot/admin/shared';
import { PanelModule } from 'primeng/panel';
import { AdminChannelMangerRoutingModule } from './admin-channel-manager.routing.module';
import { NestedCheckboxTreeComponent } from './components/nested-checkbox-tree/nested-checkbox-tree.component';
import { NestedPanelComponent } from './components/nested-checkbox-tree/nested-panel/nested-panel.component';
import { BulkUpdateComponent } from './components/bulk-update/bulk-update.component';
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
  declarations: [
    ...AdminChannelMangerRoutingModule.components,
    NestedCheckboxTreeComponent,
    NestedPanelComponent,
    BulkUpdateComponent,
  ],
  providers: [RoomService, LibraryService],
})
export class AdminChannelManagerModule {}
