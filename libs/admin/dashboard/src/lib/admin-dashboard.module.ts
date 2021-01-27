import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Route } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AdminSharedModule } from '@hospitality-bot/admin/shared';
import { AdminReservationModule } from '@hospitality-bot/admin/reservation';
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
import { DepartureStatisticsComponent } from './components/departure-statistics/departure-statistics.component';
import { ReservationDatatableComponent } from './components/reservation-datatable/reservation-datatable.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReservationDatatableModalComponent } from './components/reservation-datatable-modal/reservation-datatable-modal.component';

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
    FormsModule,
    ReactiveFormsModule,
    SharedMaterialModule,
    AdminReservationModule,
    ChartsModule,
    NgCircleProgressModule.forRoot(),
    RouterModule,
    AdminSharedModule,
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
    DepartureStatisticsComponent,
    ReservationDatatableComponent,
    ReservationDatatableModalComponent,
  ],
  exports: [DashboardComponent],
  providers: [StatisticsService],
})
export class AdminDashboardModule {}
