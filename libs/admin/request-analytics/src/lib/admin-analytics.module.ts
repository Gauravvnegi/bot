import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRequestAnalyticsRoutingModule } from './admin-analytics.routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminSharedModule } from '@hospitality-bot/admin/shared';
import { SharedMaterialModule } from 'libs/shared/material/src/lib/shared-material.module';
import { ChartsModule } from 'ng2-charts';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { AnalyticsService } from './services/analytics.service';

@NgModule({
  imports: [
    CommonModule,
    AdminRequestAnalyticsRoutingModule,
    FormsModule,
    ChartsModule,
    ReactiveFormsModule,
    SharedMaterialModule,
    AdminSharedModule,
    NgCircleProgressModule.forRoot(),
  ],
  declarations: [...AdminRequestAnalyticsRoutingModule.components],
  providers: [AnalyticsService],
})
export class AdminRequestAnalyticsModule {}
