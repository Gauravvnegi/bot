import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AdminSharedModule } from '@hospitality-bot/admin/shared';
import { AdminManageReservationRoutingModule } from './admin-manage.routing.module';
import { ManageReservationService } from './services/manage-reservation.service';
import { GuestTableService } from 'libs/admin/guests/src/lib/services/guest-table.service';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    AdminSharedModule,
    FormsModule,
    ReactiveFormsModule,
    AdminManageReservationRoutingModule,
  ],
  declarations: [...AdminManageReservationRoutingModule.components],
  providers: [ManageReservationService, GuestTableService],
})
export class AdminManageReservationModule {}
