import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AdminSharedModule } from '@hospitality-bot/admin/shared';
import { AdminInvoiceRoutingModule } from './admin-invoice.routing.module';
import { InvoiceService } from './services/invoice.service';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ServicesService } from '../../../services/src/lib/services/services.service';
import { ManageReservationService } from 'libs/admin/manage-reservation/src/lib/services/manage-reservation.service';
import { ReservationService } from 'libs/admin/reservation/src/lib/services/reservation.service';
import { GlobalSharedModule } from '@hospitality-bot/admin/global-shared';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    AdminSharedModule,
    FormsModule,
    ReactiveFormsModule,
    AutoCompleteModule,
    AdminInvoiceRoutingModule,
    GlobalSharedModule,
  ],
  declarations: [...AdminInvoiceRoutingModule.components],
  providers: [
    InvoiceService,
    ServicesService,
    ManageReservationService,
    ReservationService,
  ],
})
export class AdminInvoiceModule {}
