import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminSharedModule } from '@hospitality-bot/admin/shared';
import { PanelModule } from 'primeng/panel';
import { AdminChannelMangerRoutingModule } from './admin-channel-manager.routing.module';
import { RatesNestedCheckboxTreeComponent } from './components/rates-nested-checkbox-tree/rates-nested-checkbox-tree.component';
import { NestedPanelComponent } from './components/rates-nested-checkbox-tree/nested-panel/nested-panel.component';
import { RatesBulkUpdateComponent } from './components/rates-bulk-update/rates-bulk-update.component';
import { RoomService } from 'libs/admin/room/src/lib/services/room.service';
import { LibraryService } from '@hospitality-bot/admin/library';
import { InventoryBulkUpdateComponent } from './components/inventory-bulk-update/inventory-bulk-update.component';
import { InventoryNestedCheckboxTreeComponent } from './components/inventory-nested-checkbox-tree/inventory-nested-checkbox-tree.component';

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
    RatesNestedCheckboxTreeComponent,
    NestedPanelComponent,
    RatesBulkUpdateComponent,
    InventoryBulkUpdateComponent,
    InventoryNestedCheckboxTreeComponent,
  ],
  providers: [RoomService, LibraryService],
})
export class AdminChannelManagerModule {}
