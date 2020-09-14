import { get, set } from 'lodash';
import { FieldSchema } from './fieldSchema.model';

export interface Deserializable {
    deserialize(room: any, rates: any, config: any): this;
}

export class PaymentDetailDS implements Deserializable {
    paymentDetail: PaymentDetail[];
    hotelConfigDetail: HotelPaymentDetail;
    currencyCode;

    deserialize(rooms: any, rate:any, config: any) {
      this.currencyCode = rate.base.currencyCode;
      this.paymentDetail = new Array<PaymentDetail>();
      rooms.forEach((room) => {
        this.paymentDetail.push(new PaymentDetail().deserialize(room, rate));
      });
      this.hotelConfigDetail = new HotelPaymentDetail().deserialize(config);
      return this;
    }
  }


export class PaymentDetail implements Deserializable {
    roomNumber: number;
    unit: number;
    roomType: string;
    baseRate: number;
    totalRate: number;
  
    deserialize(room: any, rate: any) {
      Object.assign(
        this,
        set({}, 'roomNumber', get(room, ['roomNumber'])),
        set({}, 'unit', get(room, ['unit'])),
        set({}, 'roomType', get(room, ['type'])),
        set({}, 'baseRate', get(rate.base, ['value'])),
        set({}, 'totalRate', get(rate.total, ['value']))
      );
      return this;
    }
  }

  export class HotelPaymentDetail implements Deserializable {

    hotelPaymentConfig: HotelPaymentConfig;

    deserialize(input: any) {
      this. hotelPaymentConfig = new HotelPaymentConfig();
      this. hotelPaymentConfig.paymentConfigurations = new Array<PaymentConfig>();
      
      Object.assign(
        this.hotelPaymentConfig,
        set({}, 'payAtDesk', get(input, ['payAtDesk'])),
        set({}, 'onlinePayment', get(input, ['onlinePayment'])),
        set({}, 'payableAmount', get(input, ['payableAmount'])),
      )

      input.paymentConfigurations.forEach((config, index) => {
        const paymentConfig = new PaymentConfig();
        Object.assign(
          paymentConfig,
          set({}, 'id', get(config, ['id'])),
          set({}, 'hotelId', get(config, ['hotelId'])),
          set({}, 'merchantId', get(config, ['merchantId'])),
          set({}, 'accessKey', get(config, ['accessKey'])),
          set({}, 'gatewayType', get(config, ['gatewayType']))
        );
        this.hotelPaymentConfig.paymentConfigurations.push(paymentConfig);
      });
      return this;
    }
  }

  export interface PaymentDetailsConfigI {
    name: FieldSchema;
    cardNumber: FieldSchema;
    month: FieldSchema;
    year: FieldSchema;
    cvv: FieldSchema;
  }

  export class HotelPaymentConfig {
    payAtDesk: boolean;
    onlinePayment: boolean;
    paymentConfigurations: PaymentConfig[];
    payableAmount?: any;
    paymentHeaders?: any[];
  }

  export class PaymentConfig {
    id: string;
    hotelId: string;
    merchantId: string;
    accessKey: string;
    gatewayType: string;
  }

  export class PaymentStatus {
    payOnDesk:boolean;
    transactionId:string;
    status:string;
  }
  export class PaymentCCAvenue {
    merchantId: string;
    language: string;
    gatewayType: string;
    accessCode: string;
    secretKey: string;
    subAccountId: string;
    preAuth: string;
    externalRedirect: string;
  }
  export class PaymentStripe {
    stripeToken: string;
    merchantId: string;
    gatewayType: string;
    secretKey: string;
    preAuth: string;
    externalRedirect: string;
  }

