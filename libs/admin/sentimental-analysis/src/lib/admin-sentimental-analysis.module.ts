import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminSharedModule } from '@hospitality-bot/admin/shared';
import { ChartsModule } from 'ng2-charts';
import { AdminSentimentalAnalysisRoutingModule } from './admin-sentimental-analysis.routing.module';
import { SentimentalAnalysisService } from './services/sentimental-analysis.service';

@NgModule({
  imports: [
    AdminSentimentalAnalysisRoutingModule,
    AdminSharedModule,
    ChartsModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [...AdminSentimentalAnalysisRoutingModule.components],
  providers: [SentimentalAnalysisService],
})
export class AdminSentimentalAnalysisModule {}
