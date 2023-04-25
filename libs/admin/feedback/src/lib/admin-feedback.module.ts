import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  AdminSharedModule,
  getTranslationConfigs,
} from '@hospitality-bot/admin/shared';
import { AdminFeedbackRoutingModule } from './admin-feedback.routing.module';
import { SharedMaterialModule } from 'libs/shared/material/src/lib/shared-material.module';
import { ChartsModule } from 'ng2-charts';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { HttpClient } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { FeedbackTableService } from './services/table.service';
import { CardService } from './services/card.service';
import { StatisticsService } from './services/feedback-statistics.service';
import { GaugeChartModule } from 'angular-gauge-chart';

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
    GaugeChartModule,
    NgCircleProgressModule.forRoot(),
    TranslateModule.forChild(getTranslationConfigs([HttpClient], ['feedback'])),
  ],
  declarations: [...AdminFeedbackRoutingModule.components],
  providers: [StatisticsService, FeedbackTableService, CardService],
})
export class AdminFeedbackModule {}
