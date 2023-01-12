import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AdminSharedModule } from '@hospitality-bot/admin/shared';
import { AdminInventoryRoutingModule } from './admin-inventory.routing.module';

@NgModule({
  imports: [CommonModule, AdminInventoryRoutingModule, AdminSharedModule],
  declarations: [...AdminInventoryRoutingModule.components],
})
export class AdminInventoryModule {}
