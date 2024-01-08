import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminSharedModule } from '@hospitality-bot/admin/shared';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GlobalSharedModule } from '@hospitality-bot/admin/global-shared';
import { AdminTableManagementRoutingModule } from './table-management.routing.module';
import { TableManagementService } from './services/table-management.service';

@NgModule({
  imports: [
    CommonModule,
    AdminSharedModule,
    FormsModule,
    ReactiveFormsModule,
    GlobalSharedModule,
    AdminTableManagementRoutingModule,
  ],
  declarations: [...AdminTableManagementRoutingModule.components],
  providers: [TableManagementService],
})
export class TableManagementModule {}
