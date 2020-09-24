import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Route } from '@angular/router';
import { AdminReservationRoutingModule } from './admin-reservation.routing.module';
import { ReservationService } from './services/reservation.service';
import { DetailsComponent } from './components/details/details.component';
import { SharedMaterialModule } from 'libs/shared/material/src';
import { AdminSharedModule } from '@hospitality-bot/admin/shared';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

export const adminReservationRoutes: Route[] = [];

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    AdminReservationRoutingModule,
    SharedMaterialModule,
    AdminSharedModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    ReservationService
  ],
  declarations: [DetailsComponent],
})
export class AdminReservationModule {}
