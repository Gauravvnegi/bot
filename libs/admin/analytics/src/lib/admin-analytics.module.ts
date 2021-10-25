import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminAnalyticsRoutingModule } from './admin-analytics.routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminSharedModule } from '@hospitality-bot/admin/shared';
import { SharedMaterialModule } from 'libs/shared/material/src/lib/shared-material.module';
import { ChartsModule } from 'ng2-charts';
import { DynamicTabComponent } from './components/dynamic-tab/dynamic-tab.component';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { AnalyticsService } from './services/analytics.service';
import { InhouseSourceComponent } from './components/inhouse-source/inhouse-source.component';
import { InhouseSentimentsComponent } from './components/inhouse-sentiments/inhouse-sentiments.component';
import { InhouseComponent } from './components/inhouse/inhouse.component';
import { InhouseRequestDatatableComponent } from './components/inhouse-request-datatable/inhouse-request-datatable.component';
import { ConversationComponent } from './components/conversation/conversation.component';
import { NotificationComponent } from './components/notification/notification.component';
import { PreArrivalComponent } from './components/pre-arrival/pre-arrival.component';

@NgModule({
  imports: [
    CommonModule,
    AdminAnalyticsRoutingModule,
    FormsModule,
    ChartsModule,
    ReactiveFormsModule,
    SharedMaterialModule,
    AdminSharedModule,
    NgCircleProgressModule.forRoot(),
  ],
  declarations: [
    ...AdminAnalyticsRoutingModule.components,
    DynamicTabComponent,
    InhouseSourceComponent,
    InhouseSentimentsComponent,
    InhouseComponent,
    InhouseRequestDatatableComponent,
    ConversationComponent,
    NotificationComponent,
    PreArrivalComponent,
  ],
  providers: [AnalyticsService],
})
export class AdminAnalyticsModule {}
