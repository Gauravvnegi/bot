import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminListingRoutingModule } from './admin-listing.routing.module';
import { AdminSharedModule } from '@hospitality-bot/admin/shared';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    AdminListingRoutingModule,
    AdminSharedModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [...AdminListingRoutingModule.components],
})
export class AdminListingModule {}
