import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminSharedModule } from '@hospitality-bot/admin/shared';
import { EntityTabFilterComponent } from './components/entity-tab-filter/entity-tab-filter.component';
import { NightAuditComponent } from './components/night-audit/night-audit.component';
import { CheckinReservationsComponent } from './components/night-audit/components/checkin-reservations/checkin-reservations.component';
import { CheckoutReservationsComponent } from './components/night-audit/components/checkout-reservations/checkout-reservations.component';
import { AuditSummaryComponent } from './components/night-audit/components/audit-summary/audit-summary.component';
import { ManageLoggedUsersComponent } from './components/night-audit/components/manage-logged-users/manage-logged-users.component';
import { TableViewComponent } from './components/table-view/table-view.component';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { SnackbarHandlerService } from './services/snackbar-handler.service';

@NgModule({
  imports: [CommonModule, AdminSharedModule, DynamicDialogModule],
  declarations: [
    EntityTabFilterComponent,
    NightAuditComponent,
    CheckinReservationsComponent,
    CheckoutReservationsComponent,
    AuditSummaryComponent,
    ManageLoggedUsersComponent,
    TableViewComponent,
  ],
  exports: [EntityTabFilterComponent],
  providers: [SnackbarHandlerService],
})
export class GlobalSharedModule {}
