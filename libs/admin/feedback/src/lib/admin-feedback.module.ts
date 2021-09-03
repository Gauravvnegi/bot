import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminSharedModule } from '@hospitality-bot/admin/shared';
import { AdminFeedbackRoutingModule } from './admin-feedback.routing.module';
import { SharedMaterialModule } from 'libs/shared/material/src/lib/shared-material.module';
import { ChartsModule } from 'ng2-charts';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { StatisticsService } from './services/statistics.service';
import { AdminGuestDetailModule } from 'libs/admin/guest-detail/src/lib/admin-guest-detail.module';
import { NgCircleProgressModule } from 'ng-circle-progress';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ChartsModule,
    ReactiveFormsModule,
    SharedMaterialModule,
    AdminSharedModule,
    AdminFeedbackRoutingModule,
    FlexLayoutModule,
    SlickCarouselModule,
    AdminGuestDetailModule,
    NgCircleProgressModule.forRoot(),
  ],
  declarations: [...AdminFeedbackRoutingModule.components],
  providers: [StatisticsService],
})
export class AdminFeedbackModule {}
