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
import { ReservationCalendarViewComponent } from './components/reservation-calendar-view/reservation-calendar-view.component';
import { QuickReservationFormComponent } from './components/quick-reservation-form/quick-reservation-form.component';
import { RoomTypesComponent } from './components/room-types/room-types.component';
import { ButtonDependencyDirective } from './directives/button-dependency.directive';
import { AdminDetailsService } from './services/admin-details.service';
import { ReservationService } from './services/reservation.service';
import { ManageReservationService } from 'libs/admin/manage-reservation/src/lib/services/manage-reservation.service';
import { FormService } from 'libs/admin/manage-reservation/src/lib/services/form.service';
import { RoomService } from 'libs/admin/room/src/lib/services/room.service';
import { ChannelManagerService } from 'libs/admin/channel-manager/src/lib/services/channel-manager.service';
import { BookingInfoComponent } from './components/booking-info/booking-info.component';

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
    ReservationCalendarViewComponent,
    RoomTypesComponent,
    QuickReservationFormComponent,
    BookingInfoComponent,
  ],
  exports: [
    AdminSharedModule,
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
    QuickReservationFormComponent,
    ReservationCalendarViewComponent,
    RoomTypesComponent,
    BookingInfoComponent,
  ],
  providers: [
    ReservationService,
    AdminDetailsService,
    ManageReservationService,
    FormService,
    RoomService,
    ChannelManagerService,
  ],
})
export class AdminReservationModule {}
