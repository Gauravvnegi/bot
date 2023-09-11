import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AdminSharedModule } from '@hospitality-bot/admin/shared';
import { AdminManageReservationRoutingModule } from './admin-manage.routing.module';
import { ManageReservationService } from './services/manage-reservation.service';
import { GuestTableService } from 'libs/admin/guests/src/lib/services/guest-table.service';
import { FormService } from './services/form.service';
import { LibraryService } from '@hospitality-bot/admin/library';
import { OutletService } from 'libs/admin/all-outlets/src/lib/services/outlet.service';
import { InvoiceService } from 'libs/admin/invoice/src/lib/services/invoice.service';
import { GlobalSharedModule } from '@hospitality-bot/admin/global-shared';
import { MembersListComponent } from 'libs/admin/agent/src/lib/components/members-list/members-list.component';
import { AdminAgentModule } from '@hospitality-bot/admin/agent';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    AdminSharedModule,
    FormsModule,
    ReactiveFormsModule,
    AdminManageReservationRoutingModule,
    GlobalSharedModule,
    AdminAgentModule,
  ],
  declarations: [...AdminManageReservationRoutingModule.components],
  providers: [
    ManageReservationService,
    GuestTableService,
    FormService,
    LibraryService,
    OutletService,
    InvoiceService,
  ],
})
export class AdminManageReservationModule {}
