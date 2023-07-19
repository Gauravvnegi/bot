import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRequestAnalyticsRoutingModule } from './admin-analytics.routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminSharedModule } from '@hospitality-bot/admin/shared';
import { SharedMaterialModule } from 'libs/shared/material/src/lib/shared-material.module';
import { ChartsModule } from 'ng2-charts';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { AnalyticsService } from './services/analytics.service';
import { AdminRequestModule } from 'libs/admin/request/src/lib/admin-request.module';
import { RequestService } from 'libs/admin/request/src/lib/services/request.service';

@NgModule({
  imports: [
    CommonModule,
    AdminRequestAnalyticsRoutingModule,
    FormsModule,
    ChartsModule,
    ReactiveFormsModule,
    SharedMaterialModule,
    AdminSharedModule,
    AdminRequestModule,
    NgCircleProgressModule.forRoot(),
  ],
  declarations: [...AdminRequestAnalyticsRoutingModule.components],
  providers: [AnalyticsService,RequestService],
})
export class AdminRequestAnalyticsModule {}
