import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { BookingDetailService } from '@hospitality-bot/admin/shared';
import { Subscription } from 'rxjs';

@Component({
  selector: 'hospitality-bot-guest-booking-info',
  templateUrl: './guest-booking-info.component.html',
  styleUrls: ['./guest-booking-info.component.scss'],
})
export class GuestBookingInfoComponent implements OnInit, OnChanges, OnDestroy {
  @Input() data;
  @Input() guestId;
  @Input() entityId;
  @Input() reservation;
  $subscription = new Subscription();
  reservationData;
  booking = false;
  currentBooking = [];
  pastBooking = [];
  upcomingBooking = [];
  constructor(private bookingDetailsService: BookingDetailService) {}

  ngOnInit(): void {}

  ngOnChanges() {
    if (this.data?.reservationId) {
      this.pastBooking = this.reservation.records.filter(
        (item) => item.reservation.type === 'PAST'
      );

      this.currentBooking = this.reservation.records.filter(
        (item) => item.reservation.type === 'PRESENT'
      );

      this.upcomingBooking = this.reservation.records.filter(
        (item) => item.reservation.type === 'UPCOMING'
      );
      this.booking = true;
    } else {
      this.reservation = undefined;
      this.pastBooking = this.currentBooking = this.upcomingBooking = [];
      this.booking = false;
    }
  }

  openDetailPage(item) {
    this.$subscription.add(
      this.bookingDetailsService.openBookingDetailSidebar({
        guestId: this.guestId,
        bookingNumber: item.reservation.booking.bookingNumber,
      })
    );
  }

  ngOnDestroy(): void {
    this.bookingDetailsService.resetBookingState();
    this.$subscription.unsubscribe();
  }
}
