import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AdminReportsRoutingModule } from './admin-reports.routing.module';
import { AdminSharedModule } from '@hospitality-bot/admin/shared';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReportsService } from './services/reports.service';
import { AdminChannelManagerModule } from '@hospitality-bot/admin/channel-manager';

@NgModule({
  imports: [
    CommonModule,
    AdminReportsRoutingModule,
    AdminSharedModule,
    FormsModule,
    ReactiveFormsModule,
    AdminChannelManagerModule,
  ],
  declarations: [...AdminReportsRoutingModule.components],
  providers: [ReportsService],
})
export class AdminReportsModule {}