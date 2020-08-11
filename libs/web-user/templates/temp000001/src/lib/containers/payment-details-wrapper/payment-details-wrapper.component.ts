import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { PaymentDetailsService } from 'libs/web-user/shared/src/lib/services/payment-details.service';
import { CardType } from './../../../../../../shared/src/lib/data-models/card';
import { BaseWrapperComponent } from '../../base/base-wrapper.component';
import { SnackBarService } from 'libs/shared/material/src';
import { StepperService } from 'libs/web-user/shared/src/lib/services/stepper.service';
import { ButtonService } from 'libs/web-user/shared/src/lib/services/button.service';
import {
  HotelPaymentConfig,
  PaymentStatus,
} from 'libs/web-user/shared/src/lib/data-models/PaymentDetailsConfig.model';
import { ReservationService } from 'libs/web-user/shared/src/lib/services/booking.service';

@Component({
  selector: 'hospitality-bot-payment-details-wrapper',
  templateUrl: './payment-details-wrapper.component.html',
  styleUrls: ['./payment-details-wrapper.component.scss'],
})
export class PaymentDetailsWrapperComponent extends BaseWrapperComponent
  implements OnInit {
  @Input() parentForm;
  @Input() reservationData;
  @Input() stepperIndex;
  @Input() buttonConfig;

  hotelPaymentConfig: HotelPaymentConfig;
  cardType;

  constructor(
    private _paymentDetailsService: PaymentDetailsService,
    private _snackBarService: SnackBarService,
    private _reservationService: ReservationService,
    public _stepperService: StepperService,
    private _buttonService: ButtonService
  ) {
    super();
    this.self = this;
  }

  ngOnInit(): void {
    this.getPaymentConfiguration();
  }

  initPaymentDetailsDS(hotelPaymentConfig) {
    this._paymentDetailsService.initPaymentDetailDS(
      this.reservationData,
      hotelPaymentConfig
    );
  }

  getPaymentConfiguration() {
    this._paymentDetailsService
      .getPaymentConfiguration('ca60640a-9620-4f60-9195-70cc18304edd')
      .subscribe((response) => {
        this.hotelPaymentConfig = response;
        this.initPaymentDetailsDS(this.hotelPaymentConfig);
      });
  }

  onPrecheckinSubmit() {
    let paymentForm = this.parentForm.getRawValue().paymentDetails;
    let cardNumber = paymentForm.cardNumber;
    cardNumber = cardNumber.replace(/\s/g, '');
    this.cardType = CardType.GetCardType(cardNumber);
    //TODO: Need to call different api for pay with creditcard
    this.updatePaymentStatus();
  }

  onCheckinSubmit() {
    this._stepperService.setIndex('next');
    // this._buttonService.buttonLoading$.next(this.buttonRefs['nextButton']);
  }

  updatePaymentStatus() {
    const data = this.mapPaymentData();
    this._paymentDetailsService
      .updatePaymentStatus(this._reservationService.reservationId, data)
      .subscribe(
        (response) => {
          this._snackBarService.openSnackBarAsText(
            'Pre-Checkin Sucessfull.',
            '',
            { panelClass: 'success' }
          );
          this._buttonService.buttonLoading$.next(
            this.buttonRefs['submitButton']
          );
        },
        (error) => {
          this._buttonService.buttonLoading$.next(
            this.buttonRefs['submitButton']
          );
        }
      );
  }

  mapPaymentData() {
    const paymentStatusData = new PaymentStatus();
    paymentStatusData.payOnDesk = this._paymentDetailsService.payAtDesk;
    paymentStatusData.status = 'SUCCESS';
    paymentStatusData.transactionId = '12345678';
    return paymentStatusData;
  }

  goBack() {
    this._stepperService.setIndex('back');
  }
}
