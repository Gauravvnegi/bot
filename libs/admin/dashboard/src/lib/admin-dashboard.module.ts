import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Route } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AdminSharedModule } from '@hospitality-bot/admin/shared';
import { ArrivalsStatisticsComponent } from './components/arrivals-statistics/arrivals-statistics.component';
import { InhouseStatisticsComponent } from './components/inhouse-statistics/inhouse-statistics.component';
import { CheckinStatisticsComponent } from './components/checkin-statistics/checkin-statistics.component';
import { CheckoutStatisticsComponent } from './components/checkout-statistics/checkout-statistics.component';
import { StatisticsComponent } from './components/statistics/statistics.component';
import { SharedMaterialModule } from 'libs/shared/material/src';
import { InhouseRequestStatisticsComponent } from './components/inhouse-request-statistics/inhouse-request-statistics.component';
import { CustomerStatisticsComponent } from './components/customer-statistics/customer-statistics.component';
import { ChartsModule } from 'ng2-charts';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { StatisticsService } from './services/statistics.service';

export const adminDashboardRoutes: Route[] = [
  {
    path: '',
    component: DashboardComponent,
    children: [],
  },
];

@NgModule({
  imports: [
    CommonModule,
    AdminSharedModule,
    RouterModule,
    SharedMaterialModule,
    ChartsModule,
    NgCircleProgressModule.forRoot(),
  ],
  declarations: [
    DashboardComponent,
    ArrivalsStatisticsComponent,
    InhouseStatisticsComponent,
    CheckinStatisticsComponent,
    CheckoutStatisticsComponent,
    StatisticsComponent,
    InhouseRequestStatisticsComponent,
    CustomerStatisticsComponent,
  ],
  exports: [DashboardComponent],
  providers: [StatisticsService]
})
export class AdminDashboardModule {}
