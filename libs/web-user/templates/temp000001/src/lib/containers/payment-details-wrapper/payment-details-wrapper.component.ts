import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';
import { PaymentDetailsService } from 'libs/web-user/shared/src/lib/services/payment-details.service';
import { BaseWrapperComponent } from '../../base/base-wrapper.component';
import { SnackBarService } from 'libs/shared/material/src';
import { StepperService } from 'libs/web-user/shared/src/lib/services/stepper.service';
import { ButtonService } from 'libs/web-user/shared/src/lib/services/button.service';
import {
  HotelPaymentConfig,
  PaymentStatus,
  PaymentCCAvenue,
  SelectedPaymentOption,
} from 'libs/web-user/shared/src/lib/data-models/PaymentDetailsConfig.model';
import { ReservationService } from 'libs/web-user/shared/src/lib/services/booking.service';
import { HotelService } from 'libs/web-user/shared/src/lib/services/hotel.service';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { SummaryService } from 'libs/web-user/shared/src/lib/services/summary.service';
import { BillSummaryService } from 'libs/web-user/shared/src/lib/services/bill-summary.service';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

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
  selectedPaymentOption: SelectedPaymentOption = new SelectedPaymentOption();

  constructor(
    private _paymentDetailsService: PaymentDetailsService,
    private _snackBarService: SnackBarService,
    private _reservationService: ReservationService,
    public _stepperService: StepperService,
    private _buttonService: ButtonService,
    private _hotelService: HotelService,
    private _billSummaryService: BillSummaryService,
    private router: Router,
    private route: ActivatedRoute,
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
    const data = this.mapPaymentInitiationData();
    const TAB_INDEX = this.matTab['_selectedIndex'];
    const TAB_LABEL = this.hotelPaymentConfig.paymentHeaders[TAB_INDEX].type;
    if (TAB_LABEL === 'Pay Now') {
      if (
        this.selectedPaymentOption.config &&
        this.selectedPaymentOption.config['gatewayType'] === 'CCAVENUE'
      ) {
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
                this._buttonService.buttonLoading$.next(
                  this.buttonRefs['submitButton']
                );
                this._translateService
                  .get(`MESSAGES.ERROR.${error.type}`)
                  .subscribe((translated_msg) => {
                    this._snackBarService.openSnackBarAsText(translated_msg);
                  });
                // this._snackBarService.openSnackBarAsText(error.message);
              }
            )
        );
      } else {
        this._translateService
          .get('VALIDATION.PAYMENT_METHOD_SELECT_PENDING')
          .subscribe((translated_msg) => {
            this._snackBarService.openSnackBarAsText(translated_msg);
          });
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
        this.selectedPaymentOption.config &&
        this.selectedPaymentOption.config['gatewayType'] === 'CCAVENUE'
      ) {
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
                this.$subscription.add(
                  this._translateService
                    .get(`MESSAGES.ERROR.${error.type}`)
                    .subscribe((translated_msg) => {
                      this._snackBarService.openSnackBarAsText(translated_msg);
                    })
                );
                // this._snackBarService.openSnackBarAsText(error.message);
                this._buttonService.buttonLoading$.next(
                  this.buttonRefs['nextButton']
                );
              }
            )
        );
      } else {
        this._translateService
          .get('VALIDATION.PAYMENT_METHOD_SELECT_PENDING')
          .subscribe((translated_msg) => {
            this._snackBarService.openSnackBarAsText(translated_msg);
          });
        this._buttonService.buttonLoading$.next(this.buttonRefs['nextButton']);
      }
    } else {
      this.updatePaymentStatus('checkin');
    }
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

  updatePaymentStatus(state) {
    const data = this.mapPaymentData();
    this.$subscription.add(
      this._paymentDetailsService
        .updatePaymentStatus(this._reservationService.reservationId, data)
        .subscribe(
          (response) => {
            if (state === 'checkin') {
              this.$subscription.add(
                this._translateService
                  .get(`MESSAGES.SUCCESS.PAYMENT_DETAILS_COMPLETE`)
                  .subscribe((translated_msg) => {
                    this._snackBarService.openSnackBarAsText(translated_msg, '', { panelClass: 'success' });
                  })
              );
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
          },
          ({ error }) => {
            this._translateService
              .get(`MESSAGES.ERROR.${error.type}`)
              .subscribe((translated_msg) => {
                this._snackBarService.openSnackBarAsText(translated_msg);
              });
            //       this._snackBarService.openSnackBarAsText(error.message);
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
        )
    );
  }

  setPaymentMethodData(event) {
    this.selectedPaymentOption.config = event.methodData;
    this.selectedPaymentOption.type = event.methodType;
  }

  mapPaymentData() {
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
      this.selectedPaymentOption.config['gatewayType'] === 'CCAVENUE'
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
