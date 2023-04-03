import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AdminSharedModule } from '@hospitality-bot/admin/shared';
import { AdminInvoiceRoutingModule } from './admin-invoice.routing.module';
import { InvoiceService } from './services/invoice.service';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    AdminSharedModule,
    FormsModule,
    ReactiveFormsModule,
    AdminInvoiceRoutingModule,
  ],
  declarations: [...AdminInvoiceRoutingModule.components],
  providers: [InvoiceService],
})
export class AdminInvoiceModule {}
