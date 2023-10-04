import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminSetupBarPriceRoutingModule } from './admin-setup-bar-price.routing.module';
import { AdminSharedModule } from '@hospitality-bot/admin/shared';
import { DynamicPricingService } from './services/dynamic-pricing.service';
import { BarPriceService } from './services/bar-price.service';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    AdminSharedModule,
    AdminSetupBarPriceRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [...AdminSetupBarPriceRoutingModule.components],
  providers: [DynamicPricingService, BarPriceService],
})
export class AdminSetupBarPriceModule {}
