import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Route, RouterModule } from '@angular/router';
import {
  AdminSharedModule,
  getTranslationConfigs,
} from '@hospitality-bot/admin/shared';
import { TranslateModule } from '@ngx-translate/core';
import { SharedMaterialModule } from 'libs/shared/material/src';
import { ChartsModule } from 'ng2-charts';
import { AdminReservationModule } from '@hospitality-bot/admin/reservation';
import { AdminGuestDashboardRoutingModule } from './admin-guest-dashboard.routing.module';
import { GuestTableService } from './services/guest-table.service';
import { StatisticsService } from './services/statistics.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    AdminGuestDashboardRoutingModule,
    ChartsModule,
    ReactiveFormsModule,
    SharedMaterialModule,
    AdminSharedModule,
    AdminReservationModule,
    TranslateModule.forChild(getTranslationConfigs([HttpClient], ['guests'])),
  ],
  declarations: [...AdminGuestDashboardRoutingModule.components],
  exports: [...AdminGuestDashboardRoutingModule.components],
  providers: [StatisticsService, GuestTableService],
})
export class AdminGuestDashboardModule {}
