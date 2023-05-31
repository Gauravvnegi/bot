import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminConversationAnalyticsRoutingModule } from './admin-conversation-analytics.routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminSharedModule } from '@hospitality-bot/admin/shared';
import { SharedMaterialModule } from '@hospitality-bot/shared/material';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { ChartsModule } from 'ng2-charts';
import { AnalyticsService } from 'libs/admin/request-analytics/src/lib/services/analytics.service';
import { AdminMessagesModule } from 'libs/admin/messages/src/lib/admin-messages.module';

@NgModule({
  imports: [
    CommonModule,
    AdminConversationAnalyticsRoutingModule,
    FormsModule,
    ChartsModule,
    ReactiveFormsModule,
    SharedMaterialModule,
    AdminSharedModule,
    AdminMessagesModule,
    NgCircleProgressModule.forRoot(),
  ],
  declarations: [...AdminConversationAnalyticsRoutingModule.components],
  providers: [AnalyticsService],
})
export class AdminConversationAnalyticsModule {}
