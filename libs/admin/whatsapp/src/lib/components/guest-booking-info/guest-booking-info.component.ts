import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MessageService } from '../../services/messages.service';
import { AdminUtilityService } from 'libs/admin/shared/src/lib/services/admin-utility.service';
import { Details } from 'libs/admin/shared/src/lib/models/detailsConfig.model';
import { Reservation } from 'libs/admin/dashboard/src/lib/data-models/reservation-table.model';
import { SnackBarService } from 'libs/shared/material/src';
import { GlobalFilterService } from 'apps/admin/src/app/core/theme/src/lib/services/global-filters.service';
import { MatDialogConfig } from '@angular/material/dialog';
import { DetailsComponent } from '@hospitality-bot/admin/reservation';
import { ModalService } from '@hospitality-bot/shared/material';

@Component({
  selector: 'hospitality-bot-guest-booking-info',
  templateUrl: './guest-booking-info.component.html',
  styleUrls: ['./guest-booking-info.component.scss'],
})
export class GuestBookingInfoComponent implements OnInit, OnChanges {
  @Input() data;
  @Input() guestId;
  @Input() hotelId;
  @Input() reservation;
  $subscription = new Subscription();
  reservationData;
  booking= false;
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
        this.booking=true;
          
    } else {
      this.reservation = undefined;
      this.pastBooking= this.currentBooking = this.upcomingBooking = [];
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
}
