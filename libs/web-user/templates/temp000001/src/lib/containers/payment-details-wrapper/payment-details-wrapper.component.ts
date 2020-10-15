import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';
import { PaymentDetailsService } from 'libs/web-user/shared/src/lib/services/payment-details.service';
// import { CardType } from './../../../../../../shared/src/lib/data-models/card';
import { BaseWrapperComponent } from '../../base/base-wrapper.component';
import { SnackBarService } from 'libs/shared/material/src';
import { StepperService } from 'libs/web-user/shared/src/lib/services/stepper.service';
import { ButtonService } from 'libs/web-user/shared/src/lib/services/button.service';
import {
  HotelPaymentConfig,
  PaymentStatus,
  PaymentCCAvenue,
  PaymentStripe,
} from 'libs/web-user/shared/src/lib/data-models/PaymentDetailsConfig.model';
import { ReservationService } from 'libs/web-user/shared/src/lib/services/booking.service';
import { HotelService } from 'libs/web-user/shared/src/lib/services/hotel.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'hospitality-bot-payment-details-wrapper',
  templateUrl: './payment-details-wrapper.component.html',
  styleUrls: ['./payment-details-wrapper.component.scss'],
})
export class PaymentDetailsWrapperComponent extends BaseWrapperComponent
  implements OnInit {
  @ViewChild('matTab') matTab: MatTabGroup;
  @Input() parentForm;
  @Input() reservationData;
  @Input() stepperIndex;
  @Input() buttonConfig;

  hotelPaymentConfig: HotelPaymentConfig;
  isConfigLoaded: boolean = false;
  paymentMethodData;

  constructor(
    private _paymentDetailsService: PaymentDetailsService,
    private _snackBarService: SnackBarService,
    private _reservationService: ReservationService,
    public _stepperService: StepperService,
    private _buttonService: ButtonService,
    private _hotelService: HotelService
  ) {
    super();
    this.self = this;
  }

  ngOnInit(): void {
    this.getPaymentConfiguration();
    this.parentForm.addControl('paynow', new FormControl(true));
  }

  initPaymentDetailsDS(hotelPaymentConfig) {
    this._paymentDetailsService.initPaymentDetailDS(
      this.reservationData,
      hotelPaymentConfig
    );
  }

  getPaymentConfiguration() {
    const res_data = this._reservationService.reservationData;
    const journey = this._hotelService.getCurrentJourneyConfig();
    this._paymentDetailsService
      .getPaymentConfiguration(res_data.hotel.id, journey.name)
      .subscribe((response) => {
        this.hotelPaymentConfig = response;
        this.isConfigLoaded = true;
        this.initPaymentDetailsDS(this.hotelPaymentConfig);
      });
  }

  onPrecheckinSubmit() {
    // let paymentForm = this.parentForm.getRawValue().paymentDetails;
    // let cardNumber = paymentForm.cardNumber;
    // cardNumber = cardNumber.replace(/\s/g, '');
    // this.cardType = CardType.GetCardType(cardNumber);
    //TODO: Need to call different api for pay with creditcard
    // this.updatePaymentStatus();
    const data = this.mapPaymentInitiationData();
    const TAB_INDEX = this.matTab['_selectedIndex'];
    const TAB_LABEL = this.hotelPaymentConfig.paymentHeaders[TAB_INDEX].type;
    if (TAB_LABEL === 'Pay Now') {
      if (
        this.paymentMethodData &&
        this.paymentMethodData.gatewayType === 'CCAVENUE'
      ) {
        this._paymentDetailsService
          .initiatePaymentCCAvenue(this._reservationService.reservationId, data)
          .subscribe(
            (response) => {
              window.location.href = response.billingUrl;
            },
            (error) => {
              this._snackBarService.openSnackBarAsText(
                'Payment could not be initiated!'
              );
              this._buttonService.buttonLoading$.next(
                this.buttonRefs['submitButton']
              );
            }
          );
      } else if (
        this.paymentMethodData &&
        this.paymentMethodData.gatewayType === 'STRIPE'
      ) {
        this._buttonService.buttonLoading$.next(
          this.buttonRefs['submitButton']
        );
      } else {
        this._snackBarService.openSnackBarAsText(
          'Please select a payment method!'
        );
        this._buttonService.buttonLoading$.next(
          this.buttonRefs['submitButton']
        );
      }
    } else {
      this.updatePaymentStatus('preCheckin');
      this._buttonService.buttonLoading$.next(this.buttonRefs['submitButton']);
    }
  }

  onCheckinSubmit() {
    const data = this.mapPaymentInitiationData();
    const TAB_INDEX = this.matTab['_selectedIndex'];
    const TAB_LABEL = this.hotelPaymentConfig.paymentHeaders[TAB_INDEX].type;
    if (TAB_LABEL === 'Pay Now') {
      if (
        this.paymentMethodData &&
        this.paymentMethodData.gatewayType === 'CCAVENUE'
      ) {
        this._paymentDetailsService
          .initiatePaymentCCAvenue(this._reservationService.reservationId, data)
          .subscribe(
            (response) => {
              window.location.href = response.billingUrl;
            },
            (error) => {
              this._snackBarService.openSnackBarAsText(
                'Payment could not be initiated!'
              );
              this._buttonService.buttonLoading$.next(
                this.buttonRefs['nextButton']
              );
            }
          );
      } else if (
        this.paymentMethodData &&
        this.paymentMethodData.gatewayType === 'STRIPE'
      ) {
        this._buttonService.buttonLoading$.next(this.buttonRefs['nextButton']);
      } else {
        this._snackBarService.openSnackBarAsText(
          'Please select a payment method!'
        );
        this._buttonService.buttonLoading$.next(this.buttonRefs['nextButton']);
      }
    } else {
      this.updatePaymentStatus('checkin');
      // this._buttonService.buttonLoading$.next(this.buttonRefs['nextButton']);
    }
    // this._buttonService.buttonLoading$.next(this.buttonRefs['nextButton']);
  }

  updatePaymentStatus(state) {
    const data = this.mapPaymentData();
    this._paymentDetailsService
      .updatePaymentStatus(this._reservationService.reservationId, data)
      .subscribe(
        (response) => {
          if (state === 'checkin') {
            this._buttonService.buttonLoading$.next(
              this.buttonRefs['nextButton']
            );
            this._stepperService.setIndex('next');
          } else {
            this._snackBarService.openSnackBarAsText(
              'Pre-Checkin Sucessfull.',
              '',
              { panelClass: 'success' }
            );
            this._buttonService.buttonLoading$.next(
              this.buttonRefs['submitButton']
            );
          }
        },
        (error) => {
          this._snackBarService.openSnackBarAsText(error);
          if (state === 'checkin') {
            this._buttonService.buttonLoading$.next(
              this.buttonRefs['nextButton']
            );
          } else {
            this._buttonService.buttonLoading$.next(
              this.buttonRefs['submitButton']
            );
          }
        }
      );
  }

  setPaymentMethodData(event) {
    this.paymentMethodData = event.methodData;
  }

  mapPaymentData() {
    const paymentStatusData = new PaymentStatus();
    paymentStatusData.payOnDesk = true;
    paymentStatusData.status = 'SUCCESS';
    paymentStatusData.transactionId = '12345678';
    return paymentStatusData;
  }

  mapPaymentInitiationData() {
    if (
      this.paymentMethodData &&
      this.paymentMethodData.gatewayType === 'CCAVENUE'
    ) {
      const paymentCCAvenue = new PaymentCCAvenue();
      paymentCCAvenue.merchantId = this.paymentMethodData.merchantId;
      paymentCCAvenue.language = 'en';
      paymentCCAvenue.gatewayType = this.paymentMethodData.gatewayType;
      paymentCCAvenue.accessCode = this.paymentMethodData.accessCode;
      paymentCCAvenue.secretKey = this.paymentMethodData.secretKey;
      paymentCCAvenue.subAccountId = this.paymentMethodData.subAccountId;
      paymentCCAvenue.preAuth = this.paymentMethodData.preAuth;
      paymentCCAvenue.externalRedirect = this.paymentMethodData.exernalRedirect;
      return paymentCCAvenue;
    } else if (
      this.paymentMethodData &&
      this.paymentMethodData.gatewayType === 'STRIPE'
    ) {
      const paymentStripe = new PaymentStripe();
      paymentStripe.stripeToken = this.paymentMethodData.stripeToken;
      paymentStripe.gatewayType = this.paymentMethodData.gatewayType;
      paymentStripe.secretKey = this.paymentMethodData.secretKey;
      paymentStripe.merchantId = this.paymentMethodData.merchantId;
      paymentStripe.preAuth = this.paymentMethodData.preAuth;
      paymentStripe.externalRedirect = this.paymentMethodData.exernalRedirect;
      return paymentStripe;
    } else {
      return null;
    }
  }

  goBack() {
    this._stepperService.setIndex('back');
  }

  get currencyCode() {
    return this._paymentDetailsService.paymentSummaryDetails.currencyCode;
  }
}
