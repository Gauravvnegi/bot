import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import * as FileSaver from 'file-saver';
import { SnackBarService } from 'libs/shared/material/src';
import { PaymentMainStatus } from 'libs/web-user/shared/src/lib/data-models/PaymentStatusConfig.model';
import { ReservationDetails } from 'libs/web-user/shared/src/lib/data-models/reservationDetails';
import { ReservationService } from 'libs/web-user/shared/src/lib/services/booking.service';
import { HotelService } from 'libs/web-user/shared/src/lib/services/hotel.service';
import { PaymentDetailsService } from 'libs/web-user/shared/src/lib/services/payment-details.service';
import { TemplateLoaderService } from 'libs/web-user/shared/src/lib/services/template-loader.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'hospitality-bot-payment-main',
  templateUrl: './payment-main.component.html',
  styleUrls: ['./payment-main.component.scss'],
})
export class PaymentMainComponent implements OnInit, OnDestroy {
  protected $subscription: Subscription = new Subscription();
  paymentStatusData: PaymentMainStatus = new PaymentMainStatus();

  emailFG: FormGroup;
  emailControlSetting = {
    options: [],
    contentType: 'text',
    required: true,
    order: 0,
    key: '7',
    value: '',
    placeholder: 'Enter email',
    type: 'input',
    icon: '',
    label: '',
    floatLabel: 'always',
  };
  ispaymentStatusLoaded = false;
  isReservationData = false;
  reservationData: ReservationDetails;
  showFields = false;
  constructor(
    protected _reservationService: ReservationService,
    protected _hotelService: HotelService,
    protected _templateLoadingService: TemplateLoaderService,
    protected _paymentDetailService: PaymentDetailsService,
    protected router: Router,
    protected _snackBarService: SnackBarService,
    protected _translateService: TranslateService,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.getReservationDetails();
    this.initFG();
  }

  initFG() {
    this.emailFG = this.fb.group({
      email: ['', [Validators.required]],
    });
  }

  protected getReservationDetails() {
    this.$subscription.add(
      this._reservationService
        .getReservationDetails(this._reservationService.reservationId)
        .subscribe(
          (reservationData) => {
            this._hotelService.hotelConfig = reservationData['hotel'];
            this._hotelService.titleConfig$.next(reservationData['hotel']);
            this.isReservationData = true;
            this.reservationData = reservationData;
            this._reservationService.reservationData = reservationData;
            this.getPaymentStatus();
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

  protected getPaymentStatus() {
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
              this._translateService
                .get('MESSAGES.SUCCESS.PRECHECKIN_COMPLETE')
                .subscribe((translatedMsg) => {
                  this._snackBarService.openSnackBarAsText(translatedMsg, '', {
                    panelClass: 'success',
                  });
                });
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

  downloadInvoice() {
    this.showFields = false;
    this._paymentDetailService
      .downloadInvoice(this._reservationService.reservationId)
      .subscribe(
        (response) => {
          if (response && response.file_download_url) {
            FileSaver.saveAs(
              response.file_download_url,
              'invoice_' +
                this._reservationService.reservationId +
                new Date().getTime() +
                '.pdf'
            );
          }
        },
        ({ error }) => {
          this._translateService
            .get(`MESSAGES.ERROR.${error.type}`)
            .subscribe((translatedMsg) => {
              this._snackBarService.openSnackBarAsText(translatedMsg);
            });
        }
      );
  }

  sendMail() {
    let validation = this._paymentDetailService.validateEmail(this.emailFG);
    if (validation.status) {
      this._translateService.get(validation.code).subscribe((translatedMsg) => {
        this._snackBarService.openSnackBarAsText(translatedMsg);
      });
      return;
    }

    let values = this.emailFG.value;
    this._paymentDetailService
      .sendInvoice(this._reservationService.reservationId, values.email)
      .subscribe(
        (response) => {
          this.showFields = false;
          this.emailFG.reset();
          this._translateService
            .get(`MESSAGES.SUCCESS.RECEIPT_SEND_COMPLETE`)
            .subscribe((translatedMsg) => {
              this._snackBarService.openSnackBarAsText(translatedMsg, '', {
                panelClass: 'success',
              });
            });
        },
        ({ error }) => {
          this._translateService
            .get(`MESSAGES.ERROR.${error.type}`)
            .subscribe((translatedMsg) => {
              this._snackBarService.openSnackBarAsText(translatedMsg);
            });
        }
      );
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
