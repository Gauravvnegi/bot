import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminSharedModule } from '@hospitality-bot/admin/shared';
import { EntityTabFilterComponent } from './components/entity-tab-filter/entity-tab-filter.component';
import { NightAuditComponent } from './components/night-audit/night-audit.component';
import { ManageLoginUsersComponent } from './components/night-audit/components/manage-login-users/manage-login-users.component';
import { CheckinReservationsComponent } from './components/night-audit/components/checkin-reservations/checkin-reservations.component';
import { CheckoutReservationsComponent } from './components/night-audit/components/checkout-reservations/checkout-reservations.component';
import { AuditSummaryComponent } from './components/night-audit/components/audit-summary/audit-summary.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [CommonModule, AdminSharedModule, ReactiveFormsModule, FormsModule],
  declarations: [
    EntityTabFilterComponent,
    NightAuditComponent,
    ManageLoginUsersComponent,
    CheckinReservationsComponent,
    CheckoutReservationsComponent,
    AuditSummaryComponent,
  ],
  exports: [EntityTabFilterComponent],
})
export class GlobalSharedModule {}
