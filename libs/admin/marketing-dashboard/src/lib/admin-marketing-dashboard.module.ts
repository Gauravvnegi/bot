import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'primeng/api';
import { AdminSharedModule } from '@hospitality-bot/admin/shared';
import { AdminMarketingDashboardRoutingModule } from './admin-marketing-dashboard.routing.module';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { ChartsModule } from 'ng2-charts';
import { GraphService } from './services/stats.service';

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
  providers: [GraphService],
})
export class AdminMarketingDashboardModule {}
