import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AdminSharedModule,
  getTranslationConfigs,
} from '@hospitality-bot/admin/shared';
import { AdminMarketingDashboardRoutingModule } from './admin-marketing-dashboard.routing.module';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { MarketingService } from './services/stats.service';
import { ChartsModule } from 'ng2-charts';
import { HttpClient } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { ChartModule } from 'primeng/chart';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    AdminMarketingDashboardRoutingModule,
    ChartsModule,
    ReactiveFormsModule,
    AdminSharedModule,
    NgCircleProgressModule.forRoot(),
    ChartModule,
    TranslateModule.forChild(
      getTranslationConfigs([HttpClient], ['marketing-dashboard'])
    ),
  ],
  declarations: [...AdminMarketingDashboardRoutingModule.components],
  providers: [MarketingService],
})
export class AdminMarketingDashboardModule {}
