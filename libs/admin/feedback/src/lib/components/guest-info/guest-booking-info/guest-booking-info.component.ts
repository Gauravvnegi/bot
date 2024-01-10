import { BookingDetailService } from '@hospitality-bot/admin/shared';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'hospitality-bot-guest-booking-info',
  templateUrl: './guest-booking-info.component.html',
  styleUrls: ['./guest-booking-info.component.scss'],
})
export class GuestBookingInfoComponent implements OnInit, OnDestroy {
  @Input() data;
  @Input() reservationData;
  currentBooking = [];
  pastBooking = [];
  upcomingBooking = [];
  $subscription = new Subscription();
  constructor(private bookingDetailService: BookingDetailService) {}

  ngOnInit(): void {}

  ngOnChanges() {
    if (this.reservationData) {
      this.filterData();
    }
  }

  filterData() {
    this.pastBooking = this.reservationData.filter(
      (item) => item.subType === 'PAST'
    );
    this.currentBooking = this.reservationData.filter(
      (item) => item.subType === 'PRESENT'
    );

    this.upcomingBooking = this.reservationData.filter(
      (item) => item.subType === 'UPCOMING'
    );
  }

  openDetailPage(item) {
    this.$subscription.add(
      this.bookingDetailService.openBookingDetailSidebar({
        guestId: this.data.id,
        bookingNumber: item.reservation.booking.bookingNumber,
      })
    );
  }

  checkForNoBooking(): boolean {
    return (
      !!this.pastBooking.length &&
      !!this.currentBooking.length &&
      !!this.upcomingBooking.length
    );
  }

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
    this.bookingDetailService.resetBookingState();
  }
}
