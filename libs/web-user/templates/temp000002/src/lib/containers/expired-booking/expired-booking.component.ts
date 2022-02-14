import { Component } from '@angular/core';
import { ExpiredBookingComponent as BaseExpiredBookingComponent } from 'libs/web-user/templates/temp000001/src/lib/containers/expired-booking/expired-booking.component';

@Component({
  selector: 'hospitality-bot-expired-booking',
  templateUrl: './expired-booking.component.html',
  styleUrls: ['./expired-booking.component.scss'],
})
export class ExpiredBookingComponent extends BaseExpiredBookingComponent {}
