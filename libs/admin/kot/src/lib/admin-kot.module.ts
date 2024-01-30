import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KotRoutingModule } from './kot-routing.module';
import { AdminSharedModule } from '@hospitality-bot/admin/shared';
import { GlobalSharedModule } from '@hospitality-bot/admin/global-shared';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    KotRoutingModule,
    AdminSharedModule,
    GlobalSharedModule,
  ],
  declarations: [...KotRoutingModule.components],
})
export class AdminKotModule {}
