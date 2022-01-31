import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Route, RouterModule } from '@angular/router';
import { AdminReservationModule } from '@hospitality-bot/admin/reservation';
import { AdminSharedModule } from '@hospitality-bot/admin/shared';
import { TranslateModule } from '@ngx-translate/core';
import { SharedMaterialModule } from 'libs/shared/material/src';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { ChartsModule } from 'ng2-charts';
import { ArrivalsStatisticsComponent } from './components/cards/arrivals-stats/arrivals-stats.component';
import { BookingStatusComponent } from './components/cards/booking-status/booking-status.component';
import { CustomerStatisticsComponent } from './components/cards/customer-stats/customer-stats.component';
import { DepartureStatisticsComponent } from './components/cards/departure-stats/departure-stats.component';
import { InhouseRequestStatisticsComponent } from './components/cards/inhouse-request-stats/inhouse-request-stats.component';
import { InhouseStatisticsComponent } from './components/cards/inhouse-stats/inhouse-stats.component';
import { MessagesComponent } from './components/cards/messages/messages.component';
import { NotificationsComponent } from './components/cards/notifications/notifications.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ReservationDatatableModalComponent } from './components/modal/reservation-datatable-modal/reservation-datatable-modal.component';
import { ReservationDatatableComponent } from './components/datatable/reservation/reservation.component';
import { StatisticsComponent } from './components/statistics/statistics.component';
import { StatisticsService } from './services/statistics.service';
import { HttpClient } from '@angular/common/http';
import { getTranslationConfigs } from 'libs/admin/shared/src/lib/configs/translate';
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
    TranslateModule.forChild(
      getTranslationConfigs([HttpClient], ['dashboard'])
    ),
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
