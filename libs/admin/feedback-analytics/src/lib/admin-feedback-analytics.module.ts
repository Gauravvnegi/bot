import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  AdminSharedModule,
  getTranslationConfigs,
} from '@hospitality-bot/admin/shared';
import { TranslateModule } from '@ngx-translate/core';
import { GaugeChartModule } from 'angular-gauge-chart';
import { SharedMaterialModule } from 'libs/shared/material/src/lib/shared-material.module';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { ChartsModule } from 'ng2-charts';
import { AdminFeedbackAnalyticsRoutingModule } from './admin-feedback-analytics.routing.module';
import { FeedbackTypesComponent } from './components/feedback-types/feedback-types.component';
import { CardService } from './services/card.service';
import { StatisticsService } from './services/feedback-statistics.service';
import { FeedbackTableService } from './services/table.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ChartsModule,
    ReactiveFormsModule,
    SharedMaterialModule,
    AdminSharedModule,
    AdminFeedbackAnalyticsRoutingModule,
    FlexLayoutModule,
    GaugeChartModule,
    NgCircleProgressModule.forRoot(),
    TranslateModule.forChild(getTranslationConfigs([HttpClient], ['feedback'])),
  ],
  exports: [FeedbackTypesComponent],
  declarations: [...AdminFeedbackAnalyticsRoutingModule.components],
  providers: [StatisticsService, FeedbackTableService, CardService],
})
export class AdminFeedbackAnalyticsModule {}
