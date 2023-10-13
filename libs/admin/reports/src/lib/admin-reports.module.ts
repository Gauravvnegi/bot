import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AdminReportsRoutingModule } from './admin-reports.routing.module';
import { AdminSharedModule } from '@hospitality-bot/admin/shared';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReportsService } from './services/reports.service';

@NgModule({
  imports: [
    CommonModule,
    AdminReportsRoutingModule,
    AdminSharedModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [...AdminReportsRoutingModule.components],
  providers: [ReportsService],
})
export class AdminReportsModule {}
