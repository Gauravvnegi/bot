import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'primeng/api';
import { AdminSharedModule } from '@hospitality-bot/admin/shared';
import { AdminMarketingDashboardRoutingModule } from './admin-marketing-dashboard.routing.module';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { MarketingService } from './services/stats.service';
import { ChartsModule } from 'ng2-charts';

@NgModule({
  imports: [
    CommonModule,
    AdminMarketingDashboardRoutingModule,
    ChartsModule,
    SharedModule,
    AdminSharedModule,
    NgCircleProgressModule.forRoot(),
  ],
  declarations: [...AdminMarketingDashboardRoutingModule.components],
  providers: [MarketingService],
})
export class AdminMarketingDashboardModule {}
