import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminDynamicPricingRoutingModule } from './admin-dynamic-pricing.routing.module';
import { AdminSharedModule } from '@hospitality-bot/admin/shared';
import { DynamicPricingService } from './services/dynamic-pricing.service';
import { BarPriceService } from './services/bar-price.service';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    AdminSharedModule,
    AdminDynamicPricingRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [...AdminDynamicPricingRoutingModule.components],
  providers: [DynamicPricingService, BarPriceService],
})
export class AdminDynamicPricingModule {}
