import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AdminReservationModule } from 'libs/admin/reservation/src/lib/admin-reservation.module';
import { ReservationService } from 'libs/admin/reservation/src/lib/services/reservation.service';
import { ThemeModule } from '../theme/src';
import { PagesComponent } from './containers/pages/pages.component';
import { TemporaryRedirectPageComponent } from './containers/trp/temporary-redirect-page/temporary-redirect-page.component';
import { PagesRoutingModule } from './pages.routing.module';

@NgModule({
  declarations: [PagesComponent, TemporaryRedirectPageComponent],
  imports: [
    CommonModule,
    ThemeModule,
    PagesRoutingModule,
    AdminReservationModule,
  ],
  providers: [ReservationService],
})
export class PagesModule {}
