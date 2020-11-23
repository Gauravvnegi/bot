import { Component, OnInit } from '@angular/core';
import { ReservationDetails } from 'libs/web-user/shared/src/lib/data-models/reservationDetails';
import { ReservationService } from 'libs/web-user/shared/src/lib/services/booking.service';
import { HotelService } from 'libs/web-user/shared/src/lib/services/hotel.service';
import { SnackBarService } from 'libs/shared/material/src';
import { TemplateLoaderService } from 'libs/web-user/shared/src/lib/services/template-loader.service';
import { PaymentDetailsService } from 'libs/web-user/shared/src/lib/services/payment-details.service';
import { Router } from '@angular/router';
import { PaymentMainStatus } from 'libs/web-user/shared/src/lib/data-models/PaymentStatusConfig.model';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'hospitality-bot-payment-main',
  templateUrl: './payment-main.component.html',
  styleUrls: ['./payment-main.component.scss'],
})
export class PaymentMainComponent implements OnInit {
  private $subscription: Subscription = new Subscription();
  paymentStatusData: PaymentMainStatus = new PaymentMainStatus();

  ispaymentStatusLoaded: boolean = false;
  isReservationData = false;
  reservationData: ReservationDetails;
  constructor(
    private _reservationService: ReservationService,
    private _hotelService: HotelService,
    private _snackBarService: SnackBarService,
    private _templateLoadingService: TemplateLoaderService,
    private _paymentDetailService: PaymentDetailsService,
    private router: Router,
    private _translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.getReservationDetails();
  }

  private getReservationDetails() {
    this.$subscription.add(
      this._reservationService
        .getReservationDetails(this._reservationService.reservationId)
        .subscribe((reservationData) => {
          this._hotelService.hotelConfig = reservationData['hotel'];
          this.isReservationData = true;
          this.reservationData = reservationData;
          this._reservationService.reservationData = reservationData;
          this.getPaymentStatus();
        })
    );
  }

  private getPaymentStatus() {
    this.$subscription.add(
      this._paymentDetailService
        .getPaymentStatus(this._reservationService.reservationId)
        .subscribe(
          (response) => {
            let status = response.status.toUpperCase();
            this._templateLoadingService.isTemplateLoading$.next(false);
            let redirectUrl = window.location.href.substring(
              0,
              window.location.href.lastIndexOf('&')
            );
            let { title } = this._hotelService.getCurrentJourneyConfig();
            this.paymentStatusData = new PaymentMainStatus().deserialize(
              response,
              redirectUrl,
              title,
              status
            );
            this.ispaymentStatusLoaded = true;
            if (
              this.reservationData['currentJourney'] === 'PRECHECKIN' &&
              status === 'SUCCESS'
            ) {
              this.$subscription.add(
                this._translateService
                  .get('MESSAGES.SUCCESS.PRECHECKIN_COMPLETE')
                  .subscribe((res) => {
                    this._snackBarService.openSnackBarAsText(
                      res,
                      '',
                      { panelClass: 'success' }
                    );
                  })
              );
            }
          },
          ({ error }) => {
            this.$subscription.add(
              this._translateService
                .get(`MESSAGES.ERROR.${error.type}`)
                .subscribe((res) => {
                  this._snackBarService.openSnackBarAsText(res);
                })
            );
            // this._snackBarService.openSnackBarAsText(error.message);
          }
        )
    );
  }

  redirect(redirectUrl?) {
    if (redirectUrl) {
      window.location.href = redirectUrl;
    } else {
      if (this.reservationData['currentJourney'] !== 'CHECKIN') {
        this.router.navigateByUrl(
          `/summary?token=${this.reservationData['redirectionParameter'].journey.token}&entity=summary`
        );
      } else {
        this.router.navigateByUrl(
          `/?token=${this.reservationData['redirectionParameter'].journey.token}`
        );
      }
    }
  }

  get status() {
    if (this.paymentStatusData && this.paymentStatusData.data) {
      return this.paymentStatusData.data.status.toUpperCase();
    }
    return null;
  }

  get data() {
    if (this.paymentStatusData) {
      return this.paymentStatusData.data;
    }
    return null;
  }

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}
