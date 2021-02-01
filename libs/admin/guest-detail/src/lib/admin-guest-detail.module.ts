import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Route } from '@angular/router';
import { ChartsModule } from 'ng2-charts';
import { AdminSharedModule } from '@hospitality-bot/admin/shared';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedMaterialModule } from 'libs/shared/material/src';
import { BookingFeedbackComponent } from './components/booking-feedback/booking-feedback.component';
import { DetailsComponent } from './components/details/details.component';
import { DocumentsComponent } from './components/documents/documents.component';
import { GuestDetailsComponent } from './components/guest-details/guest-details.component';
import { StayDetailsComponent } from './components/stay-details/stay-details.component';
import { GuestDetailService } from './services/guest-detail.service';
import { AdminNotificationModule } from 'libs/admin/notification/src/lib/admin-notification.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ChartsModule,
    ReactiveFormsModule,
    SharedMaterialModule,
    AdminSharedModule,
    AdminNotificationModule
  ],
  declarations: [
    DetailsComponent,
    GuestDetailsComponent,
    DocumentsComponent,
    StayDetailsComponent,
    BookingFeedbackComponent
  ],
  exports: [
    DetailsComponent,
    GuestDetailsComponent,
    DocumentsComponent,
    StayDetailsComponent,
    BookingFeedbackComponent
  ],
  providers: [GuestDetailService]
})
export class AdminGuestDetailModule {}
