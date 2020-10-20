import { get, set } from 'lodash';
import { FieldSchema } from './fieldSchema.model';

export interface Deserializable {
  deserialize(room: any, rates: any, config: any): this;
}

export class PaymentDetailDS implements Deserializable {
  paymentDetail: PaymentDetail[];
  hotelConfigDetail: HotelPaymentDetail;
  currencyCode: string;

  deserialize(rooms: any, paymentSummary:any, config: any) {
    this.currencyCode = config.currency;
    this.paymentDetail = new Array<PaymentDetail>();
    rooms.forEach((room) => {
      this.paymentDetail.push(new PaymentDetail().deserialize(room, paymentSummary));
    });
    this.hotelConfigDetail = new HotelPaymentDetail().deserialize(config, paymentSummary);
    return this;
  }
}

export class PaymentDetail implements Deserializable {
  roomNumber: number;
  unit: number;
  roomType: string;
  baseRate: number;
  totalRate: number;
  
  deserialize(room: any, paymentSummary: any) {
    Object.assign(
      this,
      set({}, 'roomNumber', get(room, ['roomNumber'])),
      set({}, 'unit', get(room, ['unit'])),
      set({}, 'roomType', get(room, ['type'])),
      set({}, 'baseRate', get(paymentSummary.roomRates, ['base'])),
      set({}, 'totalRate', get(paymentSummary.roomRates, ['totalAmount'])),
    );
    return this;
  }
}

export class HotelPaymentDetail implements Deserializable {
  hotelPaymentConfig: HotelPaymentConfig;

  deserialize(input: any, paymentSummary: any) {
    this. hotelPaymentConfig = new HotelPaymentConfig();
      
    Object.assign(
      this.hotelPaymentConfig,
      set({}, 'payAtDesk', get(paymentSummary.depositRules, ['payAtDesk'])),
      set({}, 'onlinePayment', get(input, ['onlinePayment'])),
      set({}, 'payableAmount', get(input, ['payableAmount'])),
      set({}, 'depositRules', get(paymentSummary, ['depositRules']))
    )
    const paymentConfig = new PaymentConfig();
    Object.assign(
      paymentConfig,
      set({}, 'id', get(input, ['id'])),
      set({}, 'merchantId', get(input, ['merchantId'])),
      set({}, 'accessCode', get(input, ['accessCode'])),
      set({}, 'gatewayType', get(input, ['gatewayType'])),
      set({}, 'subAccountId', get(input, ['subAccountId'])),
      set({}, 'secretKey', get(input, ['secretKey'])),
      set({}, 'externalRedirect', get(input, ['exernalRedirect'])),
      set({}, 'paymentMethods', input.paymentMethods[paymentSummary.depositRules.guaranteeType])
    );
    this.hotelPaymentConfig.paymentConfigurations = paymentConfig;
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
  paymentConfigurations: PaymentConfig;
  payableAmount?: any;
  paymentHeaders?: PaymentHeader[];
  depositRules: DepositRules;
}

export class DepositRules {
  id: string;
  amount: number;
  guaranteeType: string;
  type: string;
  depositNight: number;
  payAtDesk: boolean;
}

export class PaymentConfig {
  id: string;
  hotelId: string;
  merchantId: string;
  accessKey: string;
  gatewayType: string;
  accessCode: string;
  secretKey: string;
  subAccountId: string;
  chainId: string;
  paymentMethods: PaymentMethod[];
  externalRedirect: boolean;
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
  externalRedirect: boolean;
  methodType?: any;
  guaranteeType: string;

  deserialize(config: PaymentConfig, depositRules: DepositRules, type: PaymentMethod) {
    Object.assign(
      this,
      set({}, 'merchantId', get(config, ['merchantId'])),
      set({}, 'gatewayType', get(config, ['gatewayType'])),
      set({}, 'accessCode', get(config, ['accessCode'])),
      set({}, 'secretKey', get(config, ['secretKey'])),
      set({}, 'subAccountId', get(config, ['subAccountId'])),
      set({}, 'externalRedirect', get(config, ['externalRedirect'])),
      set({}, 'guaranteeType', get(depositRules, ['guaranteeType'])),
      set({}, 'language', 'en'),
    )
    if (depositRules.guaranteeType === 'PREPAYMENT') {
      this.methodType = type;
    }
    return this;
  }
}

export class PaymentHeader {
  id: string;
  type: string;
  description: string;
  imageUrl: string;
}

export class PaymentMethod {
  id: string;
  type: string;
  imageUrl: string;
}

export class SelectedPaymentOption {
  config: PaymentConfig;
  type: PaymentMethod;
}
