import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Route } from '@angular/router';
import { AdminSharedModule } from '@hospitality-bot/admin/shared';
import { AdminNotificationModule } from 'libs/admin/notification/src/lib/admin-notification.module';
import { SharedMaterialModule } from 'libs/shared/material/src';
import { DropdownModule } from 'primeng/dropdown';
import { AdminReservationRoutingModule } from './admin-reservation.routing.module';
import {
  AdminGuestDetailsComponent,
  AdminDocumentsDetailsComponent,
  AdminPackageDetailsComponent,
  AdminPaymentDetailsComponent,
  DefaultPackageComponent,
  AirportPickupComponent,
  JourneyDialogComponent,
  RequestsTableComponent,
  DepositRuleComponent,
  ManualCheckinComponent,
  StayDetailsComponent,
  DetailsComponent,
} from './components';
import { InstantFeedbackComponent } from './components/instant-feedback/instant-feedback.component';
import { StayFeedbackComponent } from './components/stay-feedback/stay-feedback.component';
import { ButtonDependencyDirective } from './directives/button-dependency.directive';
import { AdminDetailsService } from './services/admin-details.service';
import { ReservationService } from './services/reservation.service';

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
    AdminNotificationModule,
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
    ManualCheckinComponent,
    StayDetailsComponent,
    StayFeedbackComponent,
    InstantFeedbackComponent,
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
    StayDetailsComponent,
    StayFeedbackComponent,
    InstantFeedbackComponent,
  ],
})
export class AdminReservationModule {}
