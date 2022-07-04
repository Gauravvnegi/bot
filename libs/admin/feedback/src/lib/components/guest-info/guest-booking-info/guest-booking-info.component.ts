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
  @Input() hotelId;
  @Input() reservationData;
  currentBooking = [];
  pastBooking = [];
  upcomingBooking = [];
  $subscription = new Subscription();
  constructor(protected _modal: ModalService) {}

  ngOnInit(): void {}

  ngOnChanges() {
    this.pastBooking = this.reservationData.records.filter(
      (item) => item.subType === 'PAST'
    );

    this.currentBooking = this.reservationData.records.filter(
      (item) => item.subType === 'CURRENT'
    );

    this.upcomingBooking = this.reservationData.records.filter(
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

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}
