import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AdminSharedModule } from '@hospitality-bot/admin/shared';
import { BookingSourceService } from './services/booking-source.service';
import { MainComponent } from './components/main/main.component';
import { BookingSourceDataTableComponent } from './components/booking-source-data-table/booking-source-data-table.component';
import { AdminLibraryModule } from '@hospitality-bot/admin/library';
import { AdminBookingSourceRoutingModule } from './admin-booking-source.routing.module';

@NgModule({
  imports: [
    CommonModule,
    AdminBookingSourceRoutingModule,
    AdminSharedModule,
    FormsModule,
    ReactiveFormsModule,
    AdminLibraryModule,
  ],
  declarations: [MainComponent, BookingSourceDataTableComponent],
  providers: [BookingSourceService],
})
export class AdminBookingSourceModule {}
