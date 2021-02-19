import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Route } from '@angular/router';
import { AdminSharedModule } from '@hospitality-bot/admin/shared';
import { SharedMaterialModule } from 'libs/shared/material/src';
import { DropdownModule } from 'primeng/dropdown';
import { AdminReservationRoutingModule } from './admin-reservation.routing.module';
import { AdminDocumentsDetailsComponent } from './components/admin-documents-details/admin-documents-details.component';
import { AdminGuestDetailsComponent } from './components/admin-guest-details/admin-guest-details.component';
import { AdminPackageDetailsComponent } from './components/admin-package-details/admin-package-details.component';
import { AdminPaymentDetailsComponent } from './components/admin-payment-details/admin-payment-details.component';
import { DepositRuleComponent } from './components/deposit-rule/deposit-rule.component';
import { DetailsComponent } from './components/details/details.component';
import { JourneyDialogComponent } from './components/journey-dialog/journey-dialog.component';
import { AirportPickupComponent } from './components/packages/airport-pickup/airport-pickup.component';
import { DefaultPackageComponent } from './components/packages/default-package/default-package.component';
import { RequestsTableComponent } from './components/requests-table/requests-table.component';
import { ButtonDependencyDirective } from './directives/button-dependency.directive';
import { AdminDetailsService } from './services/admin-details.service';
import { ReservationService } from './services/reservation.service';
import { AdminNotificationModule } from 'libs/admin/notification/src/lib/admin-notification.module';

export const adminReservationRoutes: Route[] = [];

@NgModule({
  imports: [
    CommonModule,
    AdminReservationRoutingModule,
    SharedMaterialModule,
    AdminSharedModule,
    FormsModule,
    ReactiveFormsModule,
    DropdownModule,
    AdminNotificationModule
  ],
  providers: [ReservationService, AdminDetailsService],
  declarations: [
    DetailsComponent,
    AdminGuestDetailsComponent,
    AdminDocumentsDetailsComponent,
    AdminPackageDetailsComponent,
    AdminPaymentDetailsComponent,
    DefaultPackageComponent,
    AirportPickupComponent,
    ButtonDependencyDirective,
    JourneyDialogComponent,
    RequestsTableComponent,
    DepositRuleComponent,
  ],
  exports: [
    DetailsComponent,
    AdminGuestDetailsComponent,
    AdminDocumentsDetailsComponent,
    AdminPackageDetailsComponent,
    AdminPaymentDetailsComponent,
    DefaultPackageComponent,
    AirportPickupComponent,
    ButtonDependencyDirective,
    JourneyDialogComponent,
    RequestsTableComponent,
    DepositRuleComponent,
  ],
})
export class AdminReservationModule {}
