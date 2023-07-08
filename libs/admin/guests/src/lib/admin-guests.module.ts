import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  AdminSharedModule,
  getTranslationConfigs,
} from '@hospitality-bot/admin/shared';
import { TranslateModule } from '@ngx-translate/core';
import { SharedMaterialModule } from 'libs/shared/material/src';
import { ChartsModule } from 'ng2-charts';
import { AdminReservationModule } from '@hospitality-bot/admin/reservation';
import { AdminGuestsRoutingModule } from './admin-guests.routing.module';
import { GuestTableService } from './services/guest-table.service';
import { AdminAgentModule } from 'libs/admin/agent/src/lib/admin-agent.module';
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
    AdminReservationModule,
    AdminAgentModule,
    TranslateModule.forChild(getTranslationConfigs([HttpClient], ['guests'])),
  ],
  declarations: [...AdminGuestsRoutingModule.components],
  exports: [...AdminGuestsRoutingModule.components],
  providers: [GuestTableService],
})
export class AdminGuestsModule {}
