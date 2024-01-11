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
  @Input() entityId;
  @Input() reservationData;
  @Input() loading: boolean = false;
  currentBooking = [];
  loadingData: boolean = false;
  pastBooking = [];
  upcomingBooking = [];
  $subscription = new Subscription();
  constructor(private bookingService: BookingDetailService) {}

  ngOnInit(): void {}

  ngOnChanges() {
    this.pastBooking = this.reservationData?.records.filter(
      (item) => item.reservation.type === 'PAST'
    );

    this.currentBooking = this.reservationData?.records.filter(
      (item) => item.reservation.type === 'PRESENT'
    );

    this.upcomingBooking = this.reservationData?.records.filter(
      (item) => item.reservation.type === 'UPCOMING'
    );
  }

  openDetailPage(item) {
    this.$subscription.add(
      this.bookingService.openBookingDetailSidebar({
        guestId: this.data.id,
        bookingNumber: item.reservation.booking.bookingNumber,
      })
    );
  }

  ngOnDestroy(): void {
    this.bookingService.resetBookingState();
    this.$subscription.unsubscribe();
  }
}
