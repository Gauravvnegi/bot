import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminKotRoutingModule } from './admin-kot.routing.module';
import { AdminSharedModule } from '@hospitality-bot/admin/shared';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    AdminKotRoutingModule,
    AdminSharedModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [...AdminKotRoutingModule.components],
})
export class AdminKotModule {}
