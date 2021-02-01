import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Route } from '@angular/router';
import { AdminGuestsRoutingModule } from './admin-guests.routing.module';
import { ChartsModule } from 'ng2-charts';
import { AdminSharedModule } from '@hospitality-bot/admin/shared';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedMaterialModule } from 'libs/shared/material/src';
import { StatisticsService } from './services/statistics.service';
import { GuestTableService } from './services/guest-table.service';
import { AdminGuestDetailModule } from '../../../guest-detail/src/lib/admin-guest-detail.module'

export const adminGuestsRoutes: Route[] = [];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    AdminGuestsRoutingModule,
    ChartsModule,
    ReactiveFormsModule,
    SharedMaterialModule,
    AdminSharedModule,
    AdminGuestDetailModule
  ],
  declarations: [...AdminGuestsRoutingModule.components],
  exports: [...AdminGuestsRoutingModule.components],
  providers: [StatisticsService, GuestTableService]
})
export class AdminGuestsModule {}
