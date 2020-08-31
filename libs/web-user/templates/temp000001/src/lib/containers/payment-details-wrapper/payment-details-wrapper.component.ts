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
} from 'libs/web-user/shared/src/lib/data-models/PaymentDetailsConfig.model';
import { ReservationService } from 'libs/web-user/shared/src/lib/services/booking.service';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';
import { HotelService } from 'libs/web-user/shared/src/lib/services/hotel.service';

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
  cardType;
  paymentMethodData;

  constructor(
    private _paymentDetailsService: PaymentDetailsService,
    private _snackBarService: SnackBarService,
    private _reservationService: ReservationService,
    public _stepperService: StepperService,
    private _buttonService: ButtonService,
    private _hotelService: HotelService,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
  ) {
    super();
    this.self = this;
    this.matIconRegistry.addSvgIcon(
      "payAtDesk",
      this.domSanitizer.bypassSecurityTrustResourceUrl("../../assets/payAtDesk.svg")
    );
    this.matIconRegistry.addSvgIcon(
      "payNow",
      this.domSanitizer.bypassSecurityTrustResourceUrl("../../assets/payNow.svg")
    );
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
    const res_data = this._reservationService.reservationData;
    const journey = this._hotelService.getCurrentJourneyConfig();
    console.log(journey)
    this._paymentDetailsService
      .getPaymentConfiguration(res_data.hotel.id, journey.name)
      .subscribe((response) => {
        this.hotelPaymentConfig = response;
        console.log(this.hotelPaymentConfig);
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
    if (this.paymentMethodData.gatewayType === 'CCAVENUE') {
      const data = this.mapPaymentInitiationData();
      this._paymentDetailsService
        .initiatePaymentCCAvenue(this._reservationService.reservationId, data)
        .subscribe(
          (response) => {
            window.location.href = response.billingUrl;
          }, (error) => {
            this._snackBarService.openSnackBarAsText('Payment could not be initiated!');
            this._buttonService.buttonLoading$.next(
              this.buttonRefs['submitButton']
            );
          }
        );
    } else {
      this._buttonService.buttonLoading$.next(
        this.buttonRefs['submitButton']
      );
    }
  }

  onCheckinSubmit() {
    if (this.paymentMethodData.gatewayType === 'CCAVENUE') {
      const data = this.mapPaymentInitiationData();
      this._paymentDetailsService
        .initiatePaymentCCAvenue(this._reservationService.reservationId, data)
        .subscribe(
          (response) => {
            window.location.href = response.billingUrl;
          }, (error) => {
            this._snackBarService.openSnackBarAsText('Payment could not be initiated!');
            this._buttonService.buttonLoading$.next(
              this.buttonRefs['submitButton']
            );
          }
        );
    } else {
      this._buttonService.buttonLoading$.next(
        this.buttonRefs['submitButton']
      );
      this._stepperService.setIndex('next');
    }
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

  setPaymentMethodData(event) {
    this.paymentMethodData = event.methodData;
    console.log(this.paymentMethodData);
  }

  mapPaymentData() {
    const paymentStatusData = new PaymentStatus();
    paymentStatusData.payOnDesk = this._paymentDetailsService.payAtDesk;
    paymentStatusData.status = 'SUCCESS';
    paymentStatusData.transactionId = '12345678';
    return paymentStatusData;
  }

  mapPaymentInitiationData() {
    const data = {
      "merchantId":this.paymentMethodData.merchantId,
      "language":"en",
      "gatewayType": this.paymentMethodData.gatewayType,
      "accessCode": this.paymentMethodData.accessCode,
      "secretKey": this.paymentMethodData.secretKey,
      "subAccountId": this.paymentMethodData.subAccountId,
      "preAuth": this.paymentMethodData.preAuth,
      "externalRedirect": this.paymentMethodData.exernalRedirect,
    };
    return data;
  }

  goBack() {
    this._stepperService.setIndex('back');
  }
}
