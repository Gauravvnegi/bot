import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminSubscriptionRoutingModule } from './admin-subscription.routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminSharedModule } from '@hospitality-bot/admin/shared';
import { SharedMaterialModule } from 'libs/shared/material/src';
import { RouterModule } from '@angular/router';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';

@NgModule({
  imports: [
    CommonModule,
    AdminSubscriptionRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    AdminSharedModule,
    RouterModule,
    TableModule,
    SharedMaterialModule,
    DropdownModule,
  ],
  declarations: [AdminSubscriptionRoutingModule.components],
})
export class AdminSubscriptionModule {}
