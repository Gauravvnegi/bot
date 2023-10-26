import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AdminFinanceRoutingModule } from './admin-finance.routing.module';
import { AdminSharedModule } from '@hospitality-bot/admin/shared';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FinanceService } from './services/finance.service';
import { GlobalSharedModule } from '@hospitality-bot/admin/global-shared';

@NgModule({
  imports: [
    CommonModule,
    AdminFinanceRoutingModule,
    AdminSharedModule,
    FormsModule,
    ReactiveFormsModule,
    GlobalSharedModule,
  ],
  declarations: [...AdminFinanceRoutingModule.components],
  providers: [FinanceService],
})
export class AdminFinanceModule {}
