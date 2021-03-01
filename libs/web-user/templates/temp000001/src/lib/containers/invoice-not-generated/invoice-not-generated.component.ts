import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SnackBarService } from 'libs/shared/material/src';
import { ReservationService } from 'libs/web-user/shared/src/lib/services/booking.service';
import { HotelService } from 'libs/web-user/shared/src/lib/services/hotel.service';
import { TemplateLoaderService } from 'libs/web-user/shared/src/lib/services/template-loader.service';
import { ThankYouService } from 'libs/web-user/shared/src/lib/services/thank-you.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'hospitality-bot-invoice-not-generated',
  templateUrl: './invoice-not-generated.component.html',
  styleUrls: ['./invoice-not-generated.component.scss'],
})
export class InvoiceNotGeneratedComponent implements OnInit {
  private $subscription = new Subscription();
  constructor(
    private _thankyouService: ThankYouService,
    private _reservationService: ReservationService,
    private _translateService: TranslateService,
    private _snackBarService: SnackBarService,
    private _hotelService: HotelService,
    private _templateLoadingService: TemplateLoaderService
  ) {}

  isReservationData: boolean = false;

  reservationDetails;

  ngOnInit(): void {
    this.getReservationDetails();
  }

  getReservationDetails() {
    this.$subscription.add(
      this._reservationService
        .getReservationDetails(this._reservationService.reservationId)
        .subscribe(
          (reservationData) => {
            this._hotelService.hotelConfig = reservationData['hotel'];
            this._templateLoadingService.isTemplateLoading$.next(false);
            this.isReservationData = true;
            this.reservationDetails = reservationData;
            this._reservationService.reservationData = reservationData;
          },
          ({ error }) => {
            this._translateService
              .get(`MESSAGES.ERROR.${error.type}`)
              .subscribe((translateMsg) => {
                this._snackBarService.openSnackBarAsText(translateMsg);
              });
          }
        )
    );
  }

  explore() {
    this.$subscription.add(
      this._thankyouService
        .explore(this._reservationService.reservationId)
        .subscribe(
          (response) => {
            if (response.botRedirectUrl) {
              window.location.href = `https://${response.botRedirectUrl}`;
            } else {
              window.location.href = response.websiteUrl;
            }
          },
          ({ error }) => {
            this._translateService
              .get(`MESSAGES.ERROR.${error.type}`)
              .subscribe((translatedMsg) => {
                this._snackBarService.openSnackBarAsText(translatedMsg);
              });
          }
        )
    );
  }
}
