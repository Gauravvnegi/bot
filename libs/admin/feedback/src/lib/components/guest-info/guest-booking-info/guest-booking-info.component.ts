import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialogConfig } from '@angular/material/dialog';
import { ModalService } from '@hospitality-bot/shared/material';
import { DetailsComponent } from 'libs/admin/reservation/src/lib/components/details/details.component';
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
  constructor(protected _modal: ModalService) {}

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
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.width = '100%';
    const detailCompRef = this._modal.openDialog(
      DetailsComponent,
      dialogConfig
    );

    detailCompRef.componentInstance.guestId = this.data.id;
    detailCompRef.componentInstance.bookingNumber =
      item.reservation.booking.bookingNumber;
    this.$subscription.add(
      detailCompRef.componentInstance.onDetailsClose.subscribe((res) => {
        // remove loader for detail close
        detailCompRef.close();
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
  }
}
