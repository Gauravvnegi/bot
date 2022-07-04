import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { MatDialogConfig } from '@angular/material/dialog';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { DetailsComponent } from '@hospitality-bot/admin/reservation';
import { AdminUtilityService } from '@hospitality-bot/admin/shared';
import { ModalService } from '@hospitality-bot/shared/material';
import { SnackBarService } from 'libs/shared/material/src';
import { Subscription } from 'rxjs';
import { MessageService } from '../../services/messages.service';

@Component({
  selector: 'hospitality-bot-guest-booking-info',
  templateUrl: './guest-booking-info.component.html',
  styleUrls: ['./guest-booking-info.component.scss'],
})
export class GuestBookingInfoComponent implements OnInit, OnChanges, OnDestroy {
  @Input() data;
  @Input() guestId;
  @Input() hotelId;
  @Input() reservation;
  $subscription = new Subscription();
  reservationData;
  booking = false;
  currentBooking = [];
  pastBooking = [];
  upcomingBooking = [];
  constructor(
    protected _modal: ModalService,
    private messageService: MessageService,
    private adminUtilityService: AdminUtilityService,
    private globalFilterService: GlobalFilterService,
    private _snackBarService: SnackBarService
  ) {}

  ngOnInit(): void {}

  ngOnChanges() {
    if (this.data?.reservationId) {
      this.pastBooking = this.reservation.records.filter(
        (item) => item.reservation.type === 'PAST'
      );

      this.currentBooking = this.reservation.records.filter(
        (item) => item.reservation.type === 'CURRENT'
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
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.width = '100%';
    const detailCompRef = this._modal.openDialog(
      DetailsComponent,
      dialogConfig
    );

    detailCompRef.componentInstance.guestId = this.guestId;

    detailCompRef.componentInstance.bookingNumber =
      item.reservation.booking.bookingNumber;
    this.$subscription.add(
      detailCompRef.componentInstance.onDetailsClose.subscribe((res) => {
        detailCompRef.close();
      })
    );
  }

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}
