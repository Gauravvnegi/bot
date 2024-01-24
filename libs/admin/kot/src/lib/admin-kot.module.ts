import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminKotRoutingModule } from './admin-kot.routing.module';
import { AdminSharedModule } from '@hospitality-bot/admin/shared';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GlobalSharedModule } from '@hospitality-bot/admin/global-shared';

@NgModule({
  imports: [
    CommonModule,
    AdminKotRoutingModule,
    AdminSharedModule,
    FormsModule,
    ReactiveFormsModule,
    GlobalSharedModule,
  ],
  declarations: [...AdminKotRoutingModule.components],
})
export class AdminKotModule {}
