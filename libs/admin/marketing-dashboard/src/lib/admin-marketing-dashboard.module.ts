import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'primeng/api';
import { AdminSharedModule } from '@hospitality-bot/admin/shared';
import { AdminMarketingDashboardRoutingModule } from './admin-marketing-dashboard.routing.module';

@NgModule({
  imports: [
    CommonModule,
    AdminMarketingDashboardRoutingModule,
    SharedModule,
    AdminSharedModule,
  ],
})
export class AdminMarketingDashboardModule {}
