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

@Component({
  selector: 'hospitality-bot-payment-main',
  templateUrl: './payment-main.component.html',
  styleUrls: ['./payment-main.component.scss'],
})
export class PaymentMainComponent implements OnInit {
  paymentStatusData;
  paymentLabel;
  paymentNote;
  paymentImage;
  buttonLabel;
  isReservationData = false;
  parentForm = new FormArray([]);
  reservationData: ReservationDetails;
  constructor(
    private _reservationService: ReservationService,
    private _parentFormService: ParentFormService,
    private _hotelService: HotelService,
    private _snackBarService: SnackBarService,
    private _templateLoadingService: TemplateLoaderService,
    private _paymentDetailService: PaymentDetailsService
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
      this._templateLoadingService.isTemplateLoading$.next(false);
      this.reservationData = reservationData;
      this._reservationService.reservationData = reservationData;
      this.setPaymentStatus();
    });
  }

  private setPaymentStatus() {
    this._paymentDetailService
      .getPaymentStatus(this._reservationService.reservationId)
      .subscribe((response) => {
        this.paymentLabel =
          response.status === 'SUCCESS'
            ? 'Your Payment is completed successfully'
            : 'Your Payment is Failed';

        this.paymentImage =
          response.status === 'SUCCESS'
            ? 'assets/payment_success.png'
            : 'assets/payment_fail.png';

        this.paymentNote =
          response.status === 'SUCCESS'
            ? 'A confirmation email has been sent to '
            : 'An Error ocurred while processing your payment';
        let { title } = this._hotelService.getCurrentJourneyConfig();

        this.buttonLabel = response.status === 'SUCCESS' ? title === 'CheckIn' ? 'View Summary' : `Return To ${title}` : `Return To ${title}`;

        this.paymentStatusData = {
          data: response,
          redirectUrl: window.location.href.substring(
            0,
            window.location.href.lastIndexOf('&')
          ),
        };
        if (title === 'Pre CheckIn' && response.status === 'SUCCESS') {
          this._snackBarService.openSnackBarAsText(
            'Pre-Checkin Sucessfull.',
            '',
            { panelClass: 'success' }
          );
        }
      }, (err) => this._snackBarService.openSnackBarAsText(err));
  }

  private registerListeners() {
    this.parentForm.valueChanges.subscribe((val) => {
      this._parentFormService.parentFormValueAndValidity$.next({
        parentForm: this.parentForm,
      });
    });
  }

  redirect() {
    window.location.href = this.paymentStatusData.redirectUrl;
  }
}
