import { Component, OnInit } from '@angular/core';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { TranslateService } from '@ngx-translate/core';
import { ReservationService } from 'libs/web-user/shared/src/lib/services/booking.service';
import { ThankYouService } from 'libs/web-user/shared/src/lib/services/thank-you.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'hospitality-bot-expired-booking',
  templateUrl: './expired-booking.component.html',
  styleUrls: ['./expired-booking.component.scss'],
})
export class ExpiredBookingComponent implements OnInit {
  private $subscription = new Subscription();
  constructor(
    private _thankyouService: ThankYouService,
    private _reservationService: ReservationService,
    private _translateService: TranslateService,
    private _snackBarService: SnackBarService
  ) {}

  ngOnInit(): void {}

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
