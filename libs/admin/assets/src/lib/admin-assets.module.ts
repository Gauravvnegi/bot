import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminAssetsRoutingModule } from './admin-assets.routing.module';
import { AdminSharedModule } from '@hospitality-bot/admin/shared';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    AdminAssetsRoutingModule,
    AdminSharedModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [...AdminAssetsRoutingModule.components],
})
export class AdminAssetsModule {}
