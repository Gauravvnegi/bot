import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ApiService } from 'libs/shared/utils/src/lib/services/api.service';
import { Observable } from 'rxjs';
import { PaymentDetailDS } from '../data-models/PaymentDetailsConfig.model';

@Injectable()
export class PaymentDetailsService extends ApiService {
  private _paymentDetailDS: PaymentDetailDS;
  private _payAtDesk: boolean;

  initPaymentDetailDS(paymentData, hotelPaymentConfig) {
    this._paymentDetailDS = new PaymentDetailDS().deserialize(
      paymentData.paymentSummary,
      hotelPaymentConfig
    );
  }

  // setFieldConfigForPaymentDetails(regex) {
  //   let paymentDetailsFieldSchema = {};

  //   paymentDetailsFieldSchema['name'] = new FieldSchema().deserialize({
  //     label: 'Name on Card',
  //     disable: false,
  //     icon: 'person',
  //     maskPattern: false,
  //   });
  //   paymentDetailsFieldSchema['cardNumber'] = new FieldSchema().deserialize({
  //     label: 'Card Number',
  //     disable: false,
  //     icon: 'payment',
  //     maskPattern: regex,
  //   });
  //   paymentDetailsFieldSchema['month'] = new FieldSchema().deserialize({
  //     label: 'mm',
  //     disable: false,
  //     style: 'font-size: 17px; font-weight:700',
  //     options: Months,
  //   });
  //   paymentDetailsFieldSchema['year'] = new FieldSchema().deserialize({
  //     label: 'yyyy',
  //     disable: false,
  //     style: 'font-size: 17px; font-weight:700',
  //     options: Years,
  //   });
  //   paymentDetailsFieldSchema['cvv'] = new FieldSchema().deserialize({
  //     label: 'CVV',
  //     icon: 'payment',
  //     type: 'password',
  //   });

  //   return paymentDetailsFieldSchema as PaymentDetailsConfigI;
  // }

  getPaymentConfiguration(hotelId, journeyName): Observable<any> {
    return this.get(
      `/api/v1/hotel/${hotelId}/payment-configuration?journeyName=${journeyName}`
    );
  }

  initiatePayment(reservationId) {
    return this.get(`/api/v1/reservation/${reservationId}/payment/webhook?`);
  }

  initiatePaymentCCAvenue(reservationId, data) {
    return this.put(
      `/api/v1/reservation/${reservationId}/payment/webhook?`,
      data
    );
  }

  updatePaymentStatus(reservationId, data) {
    return this.put(`/api/v1/reservation/${reservationId}/payment`, data);
  }

  getPaymentStatus(reservationId) {
    return this.get(`/api/v1/reservation/${reservationId}/payment/status?`);
  }

  downloadInvoice(reservationId): Observable<any> {
    return this.get(`/api/v1/reservation/${reservationId}/invoice`);
  }

  sendInvoice(reservationId, email): Observable<any> {
    return this.post(
      `/api/v1/reservation/${reservationId}/send-invoice?email=${email}`,
      {}
    );
  }

  validateEmail(emailFG: FormGroup) {
    const regularExpression = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (emailFG.invalid) {
      return {
        status: true,
        code: 'VALIDATION.EMAIL_NOT_ENTERED',
      };
    } else if (
      !regularExpression.test(String(emailFG.value.email).toLowerCase())
    ) {
      return {
        status: true,
        code: 'VALIDATION.INVALID_EMAIL',
      };
    } else {
      return {
        status: false,
      };
    }
  }

  set payAtDesk(paymentOption) {
    this._payAtDesk = paymentOption;
  }

  get payAtDesk() {
    return this._payAtDesk;
  }

  get paymentSummaryDetails() {
    return this._paymentDetailDS;
  }

  get paymentConfiguration() {
    return this.paymentSummaryDetails.hotelConfig;
  }

  get currencyCode() {
    if (this.paymentSummaryDetails) {
      return this.paymentSummaryDetails.paymentSummary.currencyCode;
    }
    return null;
  }
}
