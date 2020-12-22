import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatTabGroup } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import * as journeyEnums from 'libs/web-user/shared/src/lib/constants/journey';
import * as paymentEnum from 'libs/web-user/shared/src/lib/constants/payment';
import { PaymentCCAvenue, PaymentStatus, SelectedPaymentOption } from 'libs/web-user/shared/src/lib/data-models/PaymentDetailsConfig.model';
import { BillSummaryService } from 'libs/web-user/shared/src/lib/services/bill-summary.service';
import { ReservationService } from 'libs/web-user/shared/src/lib/services/booking.service';
import { ButtonService } from 'libs/web-user/shared/src/lib/services/button.service';
import { HotelService } from 'libs/web-user/shared/src/lib/services/hotel.service';
import { PaymentDetailsService } from 'libs/web-user/shared/src/lib/services/payment-details.service';
import { StepperService } from 'libs/web-user/shared/src/lib/services/stepper.service';
import { UtilityService } from 'libs/web-user/shared/src/lib/services/utility.service';
import { IPaymentConfiguration } from 'libs/web-user/shared/src/lib/types/payment';
import { BaseWrapperComponent } from '../../base/base-wrapper.component';
import { SnackBarService } from 'libs/shared/material/src';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'hospitality-bot-payment-details-wrapper',
  templateUrl: './payment-details-wrapper.component.html',
  styleUrls: ['./payment-details-wrapper.component.scss'],
})
export class PaymentDetailsWrapperComponent extends BaseWrapperComponent
  implements OnInit {
  @ViewChild('matTab') matTab: MatTabGroup;

  hotelPaymentConfig: IPaymentConfiguration;
  isConfigLoaded: boolean = false;
  selectedPaymentOption: SelectedPaymentOption = new SelectedPaymentOption();

  constructor(
    private _paymentDetailsService: PaymentDetailsService,
    private _reservationService: ReservationService,
    public _stepperService: StepperService,
    private _buttonService: ButtonService,
    private _hotelService: HotelService,
    private _billSummaryService: BillSummaryService,
    private router: Router,
    private route: ActivatedRoute,
    private _snackBarService: SnackBarService,
    private _translateService: TranslateService
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
    this.$subscription.add(
      this._paymentDetailsService
        .getPaymentConfiguration(res_data.hotel.id, journey.name)
        .subscribe((response) => {
          this.hotelPaymentConfig = response;
          this.isConfigLoaded = true;
          this.initPaymentDetailsDS(this.hotelPaymentConfig);
        })
    );
  }

  onPrecheckinSubmit() {
    if (this.reservationData.paymentSummary.payableAmount === 0) {
      this.submitWithoutPayment(journeyEnums.JOURNEY.preCheckin);
    } else {
      const data = this.mapPaymentInitiationData();
      const TAB_INDEX = this.matTab['_selectedIndex'];
      const TAB_LABEL = this.hotelPaymentConfig.paymentHeaders[TAB_INDEX].type;
      if (TAB_LABEL === paymentEnum.PaymentHeaders.payNow) {
        if (
          this.selectedPaymentOption.config &&
          this.selectedPaymentOption.config.gatewayType === paymentEnum.GatewayTypes.ccavenue
        ) {
          this.initiateCCAvenuePayment(data, 'submitButton');
        } else {
          this._translateService
            .get('VALIDATION.PAYMENT_METHOD_SELECT_PENDING')
            .subscribe((translatedMsg) => {
              this._snackBarService.openSnackBarAsText(translatedMsg);
            });
          this._buttonService.buttonLoading$.next(
            this.buttonRefs['submitButton']
          );
        }
      } else if (TAB_LABEL === paymentEnum.PaymentHeaders.payAtDesk) {
        this.updatePaymentStatus('preCheckin');
        this._buttonService.buttonLoading$.next(
          this.buttonRefs['submitButton']
        );
      }
    }
  }

  onCheckinSubmit() {
    if (this.reservationData.paymentSummary.payableAmount === 0) {
      this.submitWithoutPayment(journeyEnums.JOURNEY.checkin);
    } else {
      const data = this.mapPaymentInitiationData();
      const TAB_INDEX = this.matTab['_selectedIndex'];
      const TAB_LABEL = this.hotelPaymentConfig.paymentHeaders[TAB_INDEX].type;
      if (TAB_LABEL === paymentEnum.PaymentHeaders.payNow) {
        if (
          this.selectedPaymentOption.config &&
          this.selectedPaymentOption.config.gatewayType === paymentEnum.GatewayTypes.ccavenue
        ) {
          this.initiateCCAvenuePayment(data, 'nextButton');
        } else {
          this._translateService
            .get('VALIDATION.PAYMENT_METHOD_SELECT_PENDING')
            .subscribe((translatedMsg) => {
              this._snackBarService.openSnackBarAsText(translatedMsg);
            });
          this._buttonService.buttonLoading$.next(
            this.buttonRefs['nextButton']
          );
        }
      } else if (TAB_LABEL === paymentEnum.PaymentHeaders.payAtDesk) {
        this.updatePaymentStatus('checkin');
      }
    }
  }

  private initiateCCAvenuePayment(data, buttonRef): void {
    this.$subscription.add(
      this._paymentDetailsService
        .initiatePaymentCCAvenue(
          this._reservationService.reservationId,
          data
        )
        .subscribe(
          (response) => {
            window.location.href = response.billingUrl;
          },
          ({ error }) => {
            this._translateService
              .get(`MESSAGES.ERROR.${error.type}`)
              .subscribe((translatedMsg) => {
                this._snackBarService.openSnackBarAsText(translatedMsg);
              });
            this._buttonService.buttonLoading$.next(
              this.buttonRefs[buttonRef]
            );
          }
        )
    );
  }

  onCheckoutSubmit() {
    this.onPrecheckinSubmit();
  }

  openThankyouPage(state) {
    this.router.navigateByUrl(
      `/thankyou?token=${this.route.snapshot.queryParamMap.get(
        'token'
      )}&entity=thankyou&state=${state}`
    );
  }

  private updatePaymentStatus(state): void {
    const data = this.mapPaymentData();
    this.$subscription.add(
      this._paymentDetailsService
        .updatePaymentStatus(this._reservationService.reservationId, data)
        .subscribe(
          (response) => {
            this.successAction(state);
          },
          ({ error }) => {
            this._translateService
              .get(`MESSAGES.ERROR.${error.type}`)
              .subscribe((translatedMsg) => {
                this._snackBarService.openSnackBarAsText(translatedMsg);
              });
            this.failureAction(state);
          }
        )
    );
  }

  private successAction(state: journeyEnums.JOURNEY.checkin | journeyEnums.JOURNEY.checkout | journeyEnums.JOURNEY.preCheckin): void {
    if (state === journeyEnums.JOURNEY.checkin) {
      this._translateService
        .get('MESSAGES.SUCCESS.PAYMENT_DETAILS_COMPLETE')
        .subscribe((translatedMsg) => {
          this._snackBarService.openSnackBarAsText(
          translatedMsg,
          '',
          { panelClass: 'success' }
        );
      });
      this._buttonService.buttonLoading$.next(
        this.buttonRefs['nextButton']
      );
      this._stepperService.setIndex('next');
    } else {
      this.openThankyouPage(state);
      this._buttonService.buttonLoading$.next(
        this.buttonRefs['submitButton']
      );
    }
  }

  private failureAction(state: journeyEnums.JOURNEY.checkin | journeyEnums.JOURNEY.checkout | journeyEnums.JOURNEY.preCheckin): void {
    if (state === journeyEnums.JOURNEY.checkin) {
      this._buttonService.buttonLoading$.next(
        this.buttonRefs['nextButton']
      );
    } else {
      this._buttonService.buttonLoading$.next(
        this.buttonRefs['submitButton']
      );
    }
  }

  private submitWithoutPayment(state: journeyEnums.JOURNEY.checkin | journeyEnums.JOURNEY.checkout | journeyEnums.JOURNEY.preCheckin): void {
    if (state === 'checkin') {
      this._buttonService.buttonLoading$.next(this.buttonRefs['nextButton']);
      this._stepperService.setIndex('next');
    } else {
      this.openThankyouPage('');
      this._buttonService.buttonLoading$.next(this.buttonRefs['submitButton']);
    }
  }

  setPaymentMethodData(event) {
    this.selectedPaymentOption.config = event.methodData;
    this.selectedPaymentOption.type = event.methodType;
  }

  private mapPaymentData(): PaymentStatus {
    const paymentStatusData = new PaymentStatus();
    paymentStatusData.payOnDesk = this._paymentDetailsService.payAtDesk || true;
    paymentStatusData.status = 'SUCCESS';
    paymentStatusData.transactionId = '12345678';
    if (this.billSummary && this.billSummary.signatureUrl) {
      paymentStatusData.signatureUrl = this.billSummary.signatureUrl;
    }
    return paymentStatusData;
  }

  mapPaymentInitiationData() {
    if (
      this.selectedPaymentOption.config &&
      this.selectedPaymentOption.config['gatewayType'] === paymentEnum.GatewayTypes.ccavenue
    ) {
      const paymentInitiationData = new PaymentCCAvenue().deserialize(
        this.selectedPaymentOption.config,
        this.reservationData.paymentSummary.depositRules,
        this.selectedPaymentOption.type
      );
      if (this.billSummary && this.billSummary.signatureUrl) {
        paymentInitiationData.signatureUrl = this.billSummary.signatureUrl;
      }
      return paymentInitiationData;
    } else {
      return null;
    }
  }

  goBack() {
    this._stepperService.setIndex('back');
  }

  get currencyCode() {
    return this._paymentDetailsService.currencyCode;
  }

  get paymentConfiguration() {
    return this._paymentDetailsService.paymentConfiguration;
  }

  get billSummary() {
    if (this._billSummaryService.billSummaryDetails) {
      return this._billSummaryService.billSummaryDetails.billSummary;
    }
    return null;
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }
}
