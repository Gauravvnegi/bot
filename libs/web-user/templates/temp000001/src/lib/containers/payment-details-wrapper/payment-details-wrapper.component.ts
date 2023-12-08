import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { initPaymentModule } from '@botshot-ecosystem/botpay-helpers';
import { environment } from '@hospitality-bot/web-user/environment';
import { TranslateService } from '@ngx-translate/core';
import { SnackBarService } from 'libs/shared/material/src';
import * as journeyEnums from 'libs/web-user/shared/src/lib/constants/journey';
import * as paymentEnum from 'libs/web-user/shared/src/lib/constants/payment';
import {
  PaymentCCAvenue,
  PaymentStatus,
  SelectedPaymentOption,
} from 'libs/web-user/shared/src/lib/data-models/PaymentDetailsConfig.model';
import { BillSummaryService } from 'libs/web-user/shared/src/lib/services/bill-summary.service';
import { ReservationService } from 'libs/web-user/shared/src/lib/services/booking.service';
import { ButtonService } from 'libs/web-user/shared/src/lib/services/button.service';
import { HotelService } from 'libs/web-user/shared/src/lib/services/hotel.service';
import { PaymentDetailsService } from 'libs/web-user/shared/src/lib/services/payment-details.service';
import { StepperService } from 'libs/web-user/shared/src/lib/services/stepper.service';
import { IPaymentConfiguration } from 'libs/web-user/shared/src/lib/types/payment';
import { BaseWrapperComponent } from '../../base/base-wrapper.component';

@Component({
  selector: 'hospitality-bot-payment-details-wrapper',
  templateUrl: './payment-details-wrapper.component.html',
  styleUrls: ['./payment-details-wrapper.component.scss'],
})
export class PaymentDetailsWrapperComponent extends BaseWrapperComponent
  implements OnInit, OnDestroy {
  @ViewChild('matTab') matTab: MatTabGroup;

  hotelPaymentConfig: IPaymentConfiguration;
  isConfigLoaded = false;
  selectedPaymentOption: SelectedPaymentOption = new SelectedPaymentOption();
  paymentUrl: string;
  selectedIndex: number = 0;
  selectedTab: 'Pay At Desk' | 'Pay Now' = 'Pay At Desk';

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
    this.initPaymentDetailsDSV2();

    this._paymentDetailsService
      .getPaymentStatus(this._reservationService.reservationId)
      .subscribe((data) => {
        console.log(data);
      });
  }

  /**
   * Handle getting the button Config with disabled state
   * @param isNextDisabled to disable the next button
   * @returns
   */
  getUpdatedBtnConfig(isNextDisabled = false) {
    this.buttonConfig[1].settings.disable =
      isNextDisabled && this.reservationData.paymentSummary.payableAmount !== 0;
    return this.buttonConfig;
  }

  onTabChanged(event) {
    const { index, tab } = event;
    this.selectedIndex = index;
    this.selectedTab = tab.textLabel;
  }

  initPaymentDetailsDS(hotelPaymentConfig) {
    this._paymentDetailsService.initPaymentDetailDS(
      this.reservationData,
      hotelPaymentConfig
    );
  }

  // need to merge v1 into v2
  initPaymentDetailsDSV2() {
    const journey = this._hotelService.getCurrentJourneyConfig();

    this._paymentDetailsService
      .getPaymentConfigurationV2(this._hotelService.entityId, journey.name)
      .subscribe((data) => {
        const gatewayDetails = data?.paymentConfiguration
          ?.filter((item) => item.status)
          ?.map((gateway) => ({
            gatewayType: gateway?.type,
            imgSrc: gateway?.imageUrl,
            //  gateway?.type === 'CCAVENUE'
            //   ? 'https://nyc3.digitaloceanspaces.com/botfiles/bot/payment_method/ccavenue.png'
            //   : 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/PayU.svg/1200px-PayU.svg.png',
            payload: {
              redirectUrl: `${environment.host_url}${this.router.url}&entity=payment`,
              ...(gateway?.type === 'AIRPAY'
                ? {
                    currency: '356',
                    isocurrency: 'INR',
                  }
                : {}),
            },
          }));

        this.paymentUrl = initPaymentModule({
          userInfo: {
            appName: 'web',
            entityId: this._hotelService.entityId,
            reservationId: this._reservationService.reservationId,
          },
          uiConfig: {
            heading: 'Select a payment method to proceed...',
            variant: 'standard',
          },
          gatewayDetails,
          paymentApiKey: `${environment.paymentApiKey}`,
          env: environment.production ? 'production' : 'development',
        });
      });
  }

  getPaymentConfiguration() {
    const res_data = this._reservationService.reservationData;
    const journey = this._hotelService.getCurrentJourneyConfig();
    this.$subscription.add(
      this._paymentDetailsService
        .getPaymentConfiguration(res_data.entity.id, journey.name)
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
        this.handlePayNowPayment(data, 'submitButton');
      } else if (TAB_LABEL === paymentEnum.PaymentHeaders.payAtDesk) {
        this.updatePaymentStatus(journeyEnums.JOURNEY.preCheckin);
      }
    }
  }

  get isSubmitDisabled() {
    if (!this.matTab) return;
    let TAB_INDEX = this.matTab['_selectedIndex'];
    console.log(this.hotelPaymentConfig.paymentHeaders, TAB_INDEX, 'TAB_INDEX');
    if (TAB_INDEX === -1) TAB_INDEX = 0;
    return (
      this.hotelPaymentConfig.paymentHeaders[TAB_INDEX].type ===
        paymentEnum.PaymentHeaders.payNow &&
      this.reservationData.paymentSummary.payableAmount !== 0
    );
  }

  onCheckinSubmit() {
    if (this.reservationData.paymentSummary.payableAmount === 0) {
      this.submitWithoutPayment(journeyEnums.JOURNEY.checkin);
    } else {
      const data = this.mapPaymentInitiationData();
      const TAB_INDEX = this.matTab['_selectedIndex'];
      const TAB_LABEL = this.hotelPaymentConfig.paymentHeaders[TAB_INDEX].type;
      if (TAB_LABEL === paymentEnum.PaymentHeaders.payNow) {
        this.handlePayNowPayment(data, 'nextButton');
      } else if (TAB_LABEL === paymentEnum.PaymentHeaders.payAtDesk) {
        this.updatePaymentStatus(journeyEnums.JOURNEY.checkin);
      }
    }
  }

  private initiateCCAvenuePayment(data, buttonRef): void {
    this.$subscription.add(
      this._paymentDetailsService
        .initiatePaymentCCAvenue(this._reservationService.reservationId, data)
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
            this._buttonService.buttonLoading$.next(this.buttonRefs[buttonRef]);
          }
        )
    );
  }

  onCheckoutSubmit() {
    if (this.reservationData.paymentSummary.payableAmount === 0) {
      this.submitWithoutPayment(journeyEnums.JOURNEY.checkout);
    } else {
      const data = this.mapPaymentInitiationData();
      const TAB_INDEX = this.matTab['_selectedIndex'];
      const TAB_LABEL = this.hotelPaymentConfig.paymentHeaders[TAB_INDEX].type;
      if (TAB_LABEL === paymentEnum.PaymentHeaders.payNow) {
        this.handlePayNowPayment(data, 'submitButton');
      } else if (TAB_LABEL === paymentEnum.PaymentHeaders.payAtDesk) {
        this.updatePaymentStatus(journeyEnums.JOURNEY.preCheckin);
        this._buttonService.buttonLoading$.next(
          this.buttonRefs['submitButton']
        );
      }
    }
  }

  initiatePayUMoneyPayment(data, buttonRef) {
    this.$subscription.add(
      this._paymentDetailsService
        .initiatePaymentCCAvenue(this._reservationService.reservationId, data)
        .subscribe(
          (response) => {
            let form = document.createElement('form');
            form.setAttribute('method', 'post');
            // form.setAttribute('target', 'payment_popup');
            // form.setAttribute(
            //   'onSubmit',
            //   "window.open('about:blank','payment_popup','width=900,height=500');"
            // );
            form.setAttribute('action', response.billingUrl);
            form.appendChild(
              this.createHiddenFields('curl', response.transaction.curl)
            );
            form.appendChild(
              this.createHiddenFields('SALT', response.transaction.SALT)
            );
            form.appendChild(
              this.createHiddenFields('furl', response.transaction.furl)
            );
            form.appendChild(
              this.createHiddenFields('surl', response.transaction.surl)
            );
            form.appendChild(
              this.createHiddenFields('email', response.transaction.email)
            );
            form.appendChild(
              this.createHiddenFields(
                'txnid',
                response.transaction.transactionId
              )
            );
            form.appendChild(
              this.createHiddenFields(
                'productinfo',
                response.transaction.productinfo
              )
            );
            form.appendChild(
              this.createHiddenFields(
                'firstname',
                response.transaction.firstname
              )
            );
            form.appendChild(
              this.createHiddenFields('hash', response.transaction.hash)
            );
            form.appendChild(
              this.createHiddenFields('key', response.transaction.key)
            );
            form.appendChild(
              this.createHiddenFields('amount', response.transaction.amount)
            );
            document
              .getElementsByClassName('payment-form')[0]
              .appendChild(form);
            form.submit();
            form.remove();
          },
          ({ error }) => {
            this._translateService
              .get(`MESSAGES.ERROR.${error.type}`)
              .subscribe((translatedMsg) => {
                this._snackBarService.openSnackBarAsText(translatedMsg);
              });
            this._buttonService.buttonLoading$.next(this.buttonRefs[buttonRef]);
          }
        )
    );
  }

  createHiddenFields(name: string, value: string) {
    let EID = document.createElement('input');
    EID.setAttribute('type', 'hidden');
    EID.setAttribute('name', name);
    EID.setAttribute('value', value);
    return EID;
  }

  handlePayNowPayment(data, buttonRef: string) {
    switch (this.selectedPaymentOption?.config.gatewayType) {
      case paymentEnum.GatewayTypes.ccavenue:
        this.initiateCCAvenuePayment(data, buttonRef);
        break;
      case paymentEnum.GatewayTypes.payumoney:
        this.initiatePayUMoneyPayment(data, buttonRef);
        break;
      default:
        this._translateService
          .get('VALIDATION.PAYMENT_METHOD_SELECT_PENDING')
          .subscribe((translatedMsg) => {
            this._snackBarService.openSnackBarAsText(translatedMsg);
          });
        this._buttonService.buttonLoading$.next(this.buttonRefs[buttonRef]);
    }
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

  private successAction(
    state:
      | journeyEnums.JOURNEY.checkin
      | journeyEnums.JOURNEY.checkout
      | journeyEnums.JOURNEY.preCheckin
  ): void {
    if (state === journeyEnums.JOURNEY.checkin) {
      if (this.selectedTab === 'Pay Now') {
        this._translateService
          .get('MESSAGES.SUCCESS.PAYMENT_DETAILS_COMPLETE')
          .subscribe((translatedMsg) => {
            this._snackBarService.openSnackBarAsText(translatedMsg, '', {
              panelClass: 'success',
            });
          });
      }
      this._buttonService.buttonLoading$.next(this.buttonRefs['nextButton']);
      this._stepperService.setIndex('next');
    } else {
      this.openThankyouPage(state);
      this._buttonService.buttonLoading$.next(this.buttonRefs['submitButton']);
    }
  }

  private failureAction(
    state:
      | journeyEnums.JOURNEY.checkin
      | journeyEnums.JOURNEY.checkout
      | journeyEnums.JOURNEY.preCheckin
  ): void {
    if (state === journeyEnums.JOURNEY.checkin) {
      this._buttonService.buttonLoading$.next(this.buttonRefs['nextButton']);
    } else {
      this._buttonService.buttonLoading$.next(this.buttonRefs['submitButton']);
    }
  }

  private submitWithoutPayment(
    state:
      | journeyEnums.JOURNEY.checkin
      | journeyEnums.JOURNEY.checkout
      | journeyEnums.JOURNEY.preCheckin
  ): void {
    if (state === journeyEnums.JOURNEY.checkin) {
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
    if (this.billSummary && this.billSummary.signatureUrl) {
      paymentStatusData.signatureUrl = this.billSummary.signatureUrl;
    }
    return paymentStatusData;
  }

  mapPaymentInitiationData() {
    if (
      this.selectedPaymentOption.config &&
      (this.selectedPaymentOption.config['gatewayType'] ===
        paymentEnum.GatewayTypes.ccavenue ||
        this.selectedPaymentOption.config['gatewayType'] ===
          paymentEnum.GatewayTypes.payumoney)
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
