import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminRevenueMangerRoutingModule } from './admin-revenue-manager.routing.module';
import { AdminSharedModule } from '@hospitality-bot/admin/shared';
import { RevenueManagerService } from './services/revenue-manager.service';
import { BarPriceService } from './services/bar-price.service';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    AdminSharedModule,
    AdminRevenueMangerRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [...AdminRevenueMangerRoutingModule.components],
  providers: [RevenueManagerService, BarPriceService],
})
export class AdminRevenueManagerModule {}
