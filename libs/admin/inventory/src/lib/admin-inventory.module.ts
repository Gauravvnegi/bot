import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AdminSharedModule } from '@hospitality-bot/admin/shared';
import { AdminInventoryRoutingModule } from './admin-inventory.routing.module';
import { InventoryComponent } from './components/inventory/inventory.component';

@NgModule({
  imports: [CommonModule, AdminInventoryRoutingModule, AdminSharedModule],
  declarations: [...AdminInventoryRoutingModule.components, InventoryComponent],
})
export class AdminInventoryModule {}
