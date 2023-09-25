import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Route, RouterModule } from '@angular/router';
import { AdminReservationModule } from '@hospitality-bot/admin/reservation';
import { TranslateModule } from '@ngx-translate/core';
import { getTranslationConfigs } from 'libs/admin/shared/src/lib/configs/translate';
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
import { ReservationDatatableComponent } from './components/datatable/reservation/reservation.component';
import { ReservationDatatableModalComponent } from './components/modal/reservation-datatable-modal/reservation-datatable-modal.component';
import { StatisticsComponent } from './components/statistics/statistics.component';
import { StatisticsService } from './services/statistics.service';
import { AnalyticsService } from 'libs/admin/request-analytics/src/lib/services/analytics.service';
import { AdminGuestDashboardModule } from '@hospitality-bot/admin/guest-dashboard';
import { ReservationCalendarViewComponent } from './components/reservation-calendar-view/reservation-calendar-view.component';
import { ManageReservationService } from 'libs/admin/manage-reservation/src/lib/services/manage-reservation.service';
import { RoomService } from 'libs/admin/room/src/lib/services/room.service';
import { RoomTypesComponent } from './components/room-types/room-types.component';

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
    AdminGuestDashboardModule,
    NgCircleProgressModule.forRoot(),
    RouterModule.forChild(adminDashboardRoutes),
    TranslateModule.forChild(
      getTranslationConfigs([HttpClient], ['dashboard', 'guests'])
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
    ReservationCalendarViewComponent,
    RoomTypesComponent,
  ],
  exports: [RouterModule],
  providers: [
    StatisticsService,
    AnalyticsService,
    ManageReservationService,
    RoomService,
  ],
})
export class AdminDashboardModule {}
