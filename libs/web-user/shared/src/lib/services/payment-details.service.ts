import { Injectable } from '@angular/core';
import { ApiService } from 'libs/shared/utils/src/lib/api.service';
import { Observable } from 'rxjs';
import { FieldSchema } from '../data-models/fieldSchema.model';
import {
  PaymentDetailDS,
  PaymentDetailsConfigI,
} from '../data-models/PaymentDetailsConfig.model';
import { Months, Years } from '../data-models/year';

@Injectable()
export class PaymentDetailsService extends ApiService {
  private _paymentDetailDS: PaymentDetailDS;
  private _payAtDesk: boolean;

  initPaymentDetailDS(paymentData, hotelPaymentConfig) {
    this._paymentDetailDS = new PaymentDetailDS().deserialize(
      paymentData.rooms,
      paymentData.paymentSummary,
      hotelPaymentConfig
    );
  }

  setFieldConfigForPaymentDetails(regex) {
    let paymentDetailsFieldSchema = {};

    paymentDetailsFieldSchema['name'] = new FieldSchema().deserialize({
      label: 'Name on Card',
      disable: false,
      icon: 'person',
      maskPattern: false,
    });
    paymentDetailsFieldSchema['cardNumber'] = new FieldSchema().deserialize({
      label: 'Card Number',
      disable: false,
      icon: 'payment',
      maskPattern: regex,
    });
    paymentDetailsFieldSchema['month'] = new FieldSchema().deserialize({
      label: 'mm',
      disable: false,
      style: 'font-size: 17px; font-weight:700',
      options: Months,
    });
    paymentDetailsFieldSchema['year'] = new FieldSchema().deserialize({
      label: 'yyyy',
      disable: false,
      style: 'font-size: 17px; font-weight:700',
      options: Years,
    });
    paymentDetailsFieldSchema['cvv'] = new FieldSchema().deserialize({
      label: 'CVV',
      icon: 'payment',
      type: 'password',
    });

    return paymentDetailsFieldSchema as PaymentDetailsConfigI;
  }
  
  getPaymentConfiguration(hotelId, journeyName): Observable<any> {
    return this.get(`/api/v1/hotel/${hotelId}/payment-configuration?journeyName=${journeyName}`);
  }

  initiatePayment(reservationId) {
    return this.get(`/api/v1/reservation/${reservationId}/payment/webhook?`);
  }

  initiatePaymentCCAvenue(reservationId, data) {
    return this.put(`/api/v1/reservation/${reservationId}/payment/webhook?`, data);
  }

  updatePaymentStatus(reservationId, data) {
    return this.put(`/api/v1/reservation/${reservationId}/payment`, data);
  }

  getPaymentStatus(reservationId) {
    return this.get(`/api/v1/reservation/${reservationId}/payment/status?`);
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
    return this.paymentSummaryDetails['hotelConfigDetail'].hotelPaymentConfig.paymentConfigurations;
  }

  get currencyCode() {
    if (this.paymentSummaryDetails) {
      return this.paymentSummaryDetails.paymentDetail.currencyCode;
    }
    return null;
  }
}
