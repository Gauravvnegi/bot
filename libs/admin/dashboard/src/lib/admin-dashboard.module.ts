import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Route, RouterModule } from '@angular/router';
import { AdminReservationModule } from '@hospitality-bot/admin/reservation';
import { AdminSharedModule } from '@hospitality-bot/admin/shared';
import { SharedMaterialModule } from 'libs/shared/material/src';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { ChartsModule } from 'ng2-charts';
import { ArrivalsStatisticsComponent } from './components/cards/arrivals-statistics/arrivals-statistics.component';
import { BookingStatusComponent } from './components/cards/booking-status/booking-status.component';
import { CustomerStatisticsComponent } from './components/cards/customer-statistics/customer-statistics.component';
import { DepartureStatisticsComponent } from './components/cards/departure-statistics/departure-statistics.component';
import { InhouseRequestStatisticsComponent } from './components/cards/inhouse-request-statistics/inhouse-request-statistics.component';
import { InhouseStatisticsComponent } from './components/cards/inhouse-statistics/inhouse-statistics.component';
import { MessagesComponent } from './components/cards/messages/messages.component';
import { NotificationsComponent } from './components/cards/notifications/notifications.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ReservationDatatableModalComponent } from './components/reservation-datatable-modal/reservation-datatable-modal.component';
import { ReservationDatatableComponent } from './components/reservation-datatable/reservation-datatable.component';
import { StatisticsComponent } from './components/statistics/statistics.component';
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
    StatisticsComponent,
    InhouseRequestStatisticsComponent,
    CustomerStatisticsComponent,
    DepartureStatisticsComponent,
    ReservationDatatableComponent,
    ReservationDatatableModalComponent,
    BookingStatusComponent,
    NotificationsComponent,
    MessagesComponent,
  ],
  exports: [DashboardComponent],
  providers: [StatisticsService],
})
export class AdminDashboardModule {}
