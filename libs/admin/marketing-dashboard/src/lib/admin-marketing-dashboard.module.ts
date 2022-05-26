import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'primeng/api';
import { AdminSharedModule } from '@hospitality-bot/admin/shared';
import { AdminMarketingDashboardRoutingModule } from './admin-marketing-dashboard.routing.module';
import { CampaignService } from 'libs/admin/campaign/src/lib/services/campaign.service';
import { AnalyticsService } from 'libs/admin/analytics/src/lib/services/analytics.service';
import { ChartsModule } from 'ng2-charts';

@NgModule({
  imports: [
    CommonModule,
    AdminMarketingDashboardRoutingModule,
    ChartsModule,
    SharedModule,
    AdminSharedModule,
  ],
  declarations: [...AdminMarketingDashboardRoutingModule.components],
  providers: [AnalyticsService],
})
export class AdminMarketingDashboardModule {}
