import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MessageService } from '../../services/messages.service';
import { AdminUtilityService } from 'libs/admin/shared/src/lib/services/admin-utility.service';
import { Details } from 'libs/admin/shared/src/lib/models/detailsConfig.model';
import { Reservation } from 'libs/admin/dashboard/src/lib/data-models/reservation-table.model';
import { SnackBarService } from 'libs/shared/material/src';
import { GlobalFilterService } from 'apps/admin/src/app/core/theme/src/lib/services/global-filters.service';

@Component({
  selector: 'hospitality-bot-guest-booking-info',
  templateUrl: './guest-booking-info.component.html',
  styleUrls: ['./guest-booking-info.component.scss'],
})
export class GuestBookingInfoComponent implements OnInit, OnChanges {
  @Input() data;
  @Input() hotelId;
  $subscription = new Subscription();
  reservationData;
  constructor(
    private messageService: MessageService,
    private adminUtilityService: AdminUtilityService,
    private globalFilterService: GlobalFilterService,
    private _snackBarService: SnackBarService
  ) {}

  ngOnInit(): void {}

  ngOnChanges() {
    if (this.data?.reservationId) {
      this.searchReservation();
    } else {
      this.reservationData = undefined;
    }
  }

  searchReservation() {
    this.$subscription.add(
      this.messageService
        .searchBooking(
          this.adminUtilityService.makeQueryParams([
            {
              key: this.data.reservationId,
              hotel_id: this.hotelId,
            },
          ])
        )
        .subscribe((response) => {
          if (response && response.reservations) {
            this.getReservationDetail(response.reservations[0].id);
          }
        })
    );
  }

  getReservationDetail(id) {
    this.messageService.getReservationDetails(id).subscribe(
      (response) => {
        this.reservationData = new Reservation().deserialize(
          response,
          this.globalFilterService.timezone
        );
        console.log(this.reservationData);
      },
      ({ error }) => {
        this._snackBarService.openSnackBarAsText(error.message);
      }
    );
  }
}
