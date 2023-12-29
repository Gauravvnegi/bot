import { Injectable } from '@angular/core';
import { DetailsTabOptions } from 'libs/admin/reservation/src/lib/components/details/details.component';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BookingDetailService {
  tabKey: DetailsTabOptions = 'guest_details';
  bookingNumber: string;
  guestId: string;
  bookingId: string;
  actionEvent = new BehaviorSubject<boolean>(false);

  resetBookingState() {
    this.bookingNumber = undefined;
    this.guestId = undefined;
    this.bookingNumber = undefined;
    this.guestId = undefined;
    this.bookingId = undefined;
    this.actionEvent.next(false);
  }

  /**
   *
   * @param data One of the input is required to open details
   */
  openBookingDetailSidebar(data: {
    bookingNumber?: string;
    guestId?: string;
    tabKey?: DetailsTabOptions;
    bookingId?: string;
  }) {
    this.bookingNumber = data?.bookingNumber;
    this.guestId = data?.guestId;
    this.bookingId = data?.bookingId;
    this.tabKey = data?.tabKey ?? 'guest_details';
    this.actionEvent.next(true);
  }
}
