import { Component, OnInit, Input } from '@angular/core';
import { FormArray } from '@angular/forms';
import { ReservationDetails } from 'libs/web-user/shared/src/lib/data-models/reservationDetails';
import { ReservationService } from 'libs/web-user/shared/src/lib/services/booking.service';
import { ParentFormService } from 'libs/web-user/shared/src/lib/services/parentForm.service';
import { HotelService } from 'libs/web-user/shared/src/lib/services/hotel.service';
import { SnackBarService } from 'libs/shared/material/src';
import { TemplateLoaderService } from 'libs/web-user/shared/src/lib/services/template-loader.service';
import { forkJoin, of } from 'rxjs';
import { PaymentDetailsService } from 'libs/web-user/shared/src/lib/services/payment-details.service';
import { Router, ActivatedRoute } from '@angular/router';
import { PaymentMainStatus } from 'libs/web-user/shared/src/lib/data-models/PaymentDetailsConfig.model';

@Component({
  selector: 'hospitality-bot-payment-main',
  templateUrl: './payment-main.component.html',
  styleUrls: ['./payment-main.component.scss'],
})

export class PaymentMainComponent implements OnInit {
  paymentStatusData:PaymentMainStatus = new PaymentMainStatus();
  
  ispaymentStatusLoaded: boolean = false;
  isReservationData = false;
  parentForm = new FormArray([]);
  titles: any = {
    PRECHECKIN:'Pre Check-In',
    CHECKIN: 'Check-In',
    CHECKOUT: 'Check-Out'
  };
  reservationData: ReservationDetails;
  constructor(
    private _reservationService: ReservationService,
    private _parentFormService: ParentFormService,
    private _hotelService: HotelService,
    private _snackBarService: SnackBarService,
    private _templateLoadingService: TemplateLoaderService,
    private _paymentDetailService: PaymentDetailsService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.getReservationDetails();
    this.registerListeners();
  }

  private getReservationDetails() {
    forkJoin(
      this._reservationService.getReservationDetails(
        this._reservationService.reservationId
      ),
      of(true)
    ).subscribe(([reservationData, val]) => {
      this._hotelService.hotelConfig = reservationData['hotel'];
      this.isReservationData = true;
      this.reservationData = reservationData;
      this._reservationService.reservationData = reservationData;
      this.setPaymentStatus();
    });
  }

  private setPaymentStatus() {
    this._paymentDetailService
      .getPaymentStatus(this._reservationService.reservationId)
      .subscribe((response) => {
        this._templateLoadingService.isTemplateLoading$.next(false);
        this.ispaymentStatusLoaded = true;
        let redirectUrl = window.location.href.substring(
          0,
          window.location.href.lastIndexOf('&')
        );
        this.paymentStatusData.data = {
          data: response,
          backRedirectUrl: redirectUrl + '&index=1',
          nextRedirectUrl: redirectUrl,
        };
        this.paymentStatusData.label =
          response.status === 'SUCCESS'
            ? 'Your Payment is completed successfully'
            : 'Your Payment is Failed';

        this.paymentStatusData.image =
          response.status === 'SUCCESS'
            ? 'assets/payment_success.png'
            : 'assets/payment_fail.png';

        this.paymentStatusData.note =
          response.status === 'SUCCESS'
            ? 'A confirmation email has been sent to '
            : 'An Error ocurred while processing your payment';

        this.paymentStatusData.showSummaryButton = true;
        this.paymentStatusData.showBackButton = true;
        this.paymentStatusData.back = `Back To ${this.titles[this.reservationData['currentJourney']]}`;
        if (response.status === "SUCCESS") {
          this.paymentStatusData.next = 'View Summary';
          this.paymentStatusData.showBackButton = false;
        } else {
          this.paymentStatusData.next = 'Retry Payment';
        }
        if (this.reservationData['currentJourney'] === 'PRECHECKIN' && response.status === 'SUCCESS') {
          this._snackBarService.openSnackBarAsText(
            'Pre-Checkin Sucessfull.',
            '',
            { panelClass: 'success' }
          );
        }
      }, ({error}) => this._snackBarService.openSnackBarAsText(error.message));
  }

  private registerListeners() {
    this.parentForm.valueChanges.subscribe((val) => {
      this._parentFormService.parentFormValueAndValidity$.next({
        parentForm: this.parentForm,
      });
    });
  }

  redirect(redirectUrl?) {
    if (redirectUrl) {
      window.location.href = redirectUrl;
    } else {
      if (this.reservationData['currentJourney'] === 'PRECHECKIN') {
        this.router.navigateByUrl(`/summary?token=${this.route.snapshot.queryParamMap.get('token')}&entity=summary`);
      } else {
        this.router.navigateByUrl(`/?token=${this.reservationData['redirectionParameter'].journey.token}`);
      }
    }
  }

  get status() {
    if (this.paymentStatusData && this.paymentStatusData.data.data) {
      return this.paymentStatusData.data.data.status;
    }
    return null;
  }

  get data() {
    if (this.paymentStatusData && this.paymentStatusData.data) {
      return this.paymentStatusData.data.data;
    }
    return null;
  }
}
