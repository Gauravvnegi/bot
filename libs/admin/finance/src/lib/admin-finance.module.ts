import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AdminFinanceRoutingModule } from './admin-finance.routing.module';
import { AdminSharedModule } from '@hospitality-bot/admin/shared';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FinanceService } from './services/finance.service';

@NgModule({
  imports: [
    CommonModule,
    AdminFinanceRoutingModule,
    AdminSharedModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [...AdminFinanceRoutingModule.components],
  providers: [FinanceService]

})

export class AdminFinanceModule {}
