import { get, set } from 'lodash';
import { FieldSchema } from './fieldSchema.model';
import * as paymentEnum from '../constants/payment';
import * as paymentType from '../types/payment';

export interface Deserializable {
  deserialize(room: any, rates: any, config: any): this;
}

export class PaymentDetailDS implements Deserializable {
  paymentSummary: PaymentSummary;
  hotelConfig: HotelConfig;

  deserialize(paymentSummary: any, config: any) {
    this.paymentSummary = new PaymentSummary().deserialize(paymentSummary);
    this.hotelConfig = new HotelConfig().deserialize(config, paymentSummary);
    return this;
  }
}

export class PaymentSummary {
  totalAmount: number;
  taxAmount: number;
  totalDiscount: number;
  subtotal: number;
  paidAmount: number;
  dueAmount: number;
  payableAmount: number;
  currencyCode: string;
  inclusions: string;
  printRate: boolean;
  roomRates: paymentType.IRoomRates;
  packages: paymentType.IPackage[];
  transactionsHistory: any[];
  depositRules: paymentType.IDepositRule;

  deserialize(paymentSummary: any) {
    Object.assign(
      this,
      set({}, 'totalAmount', get(paymentSummary, ['totalAmount'])),
      set({}, 'taxAmount', get(paymentSummary, ['taxAmount'])),
      set({}, 'totalDiscount', get(paymentSummary, ['totalDiscount'])),
      set({}, 'subtotal', get(paymentSummary, ['subtotal'])),
      set({}, 'paidAmount', get(paymentSummary, ['paidAmount'])),
      set({}, 'dueAmount', get(paymentSummary, ['dueAmount'])),
      set({}, 'payableAmount', get(paymentSummary, ['payableAmount'])),
      set({}, 'currencyCode', get(paymentSummary, ['currency'])),
      set({}, 'roomRates', get(paymentSummary, ['roomRates'])),
      set({}, 'packages', get(paymentSummary, ['packages'])),
      set({}, 'inclusions', get(paymentSummary, ['inclusions'])),
      set({}, 'roomRates', get(paymentSummary, ['roomRates'])),
      set({}, 'transactionsHistory', get(paymentSummary, ['transactionsHistory'])),
      set({}, 'depositRules', get(paymentSummary, ['depositRules'])),
      set({}, 'printRate', get(paymentSummary, ['printRate']))
    )
    return this;
  }
}

export class HotelConfig {
  payAtDesk: boolean;
  onlinePayment: boolean;
  paymentConfigurations: paymentType.IPaymentConfiguration;
  paymentMethods: paymentType.IPrePaymentPM[] | paymentType.IDepositPM[] | paymentType.IGuaranteePM[];

  deserialize(input: any, paymentSummary: any) {
    Object.assign(
      this,
      set({}, 'payAtDesk', get(paymentSummary, ['depositRules', 'payAtDesk'])),
      set({}, 'onlinePayment', get(input, ['onlinePayment']))
    )

    this.paymentMethods = input.paymentMethods[paymentSummary.depositRules.guaranteeType];
    this.paymentConfigurations = input;
    return this;
  }
}

export class PaymentStatus {
  payOnDesk: boolean;
  transactionId: string;
  status: string;
  signatureUrl?: string;
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
  signatureUrl?: string;

  deserialize(
    config: paymentType.IPaymentConfiguration,
    depositRules: paymentType.IDepositRule,
    type: paymentType.IPrePaymentPM | paymentType.IDepositPM | paymentType.IGuaranteePM
  ) {
    Object.assign(
      this,
      set({}, 'merchantId', get(config, ['merchantId'])),
      set({}, 'gatewayType', get(config, ['gatewayType'])),
      set({}, 'accessCode', get(config, ['accessCode'])),
      set({}, 'secretKey', get(config, ['secretKey'])),
      set({}, 'subAccountId', get(config, ['subAccountId'])),
      set({}, 'externalRedirect', get(config, ['externalRedirect'])),
      set({}, 'guaranteeType', get(depositRules, ['guaranteeType'])),
      set({}, 'language', 'en')
    );
    if (depositRules.guaranteeType === paymentEnum.DepositRules.prePayment) {
      this.methodType = type;
    }
    return this;
  }
}

export class SelectedPaymentOption {
  config: paymentType.IPaymentConfiguration;
  type: paymentType.IPrePaymentPM | paymentType.IDepositPM | paymentType.IGuaranteePM;
}

// export class PaymentHeader {
//   id: string;
//   type: string;
//   description: string;
//   imageUrl: string;
// }

// export class PaymentMethod {
//   id: string;
//   type: string;
//   imageUrl: string;
// }

// export class PaymentDetail implements Deserializable {
//   totalAmount: number;
//   taxAmount: number;
//   totalDiscount: number;
//   subtotal: number;
//   paidAmount: number;
//   dueAmount: number;
//   currencyCode: string;
//   roomRates: Rates;
//   packages: Rates[];
//   payableAmount: number;

//   deserialize(paymentSummary: any) {
//     Object.assign(
//       this,
//       set({}, 'currencyCode', get(paymentSummary, ['currency'])),
//       set({}, 'totalAmount', get(paymentSummary, ['totalAmount'])),
//       set({}, 'taxAmount', get(paymentSummary, ['taxAmount'])),
//       set({}, 'totalDiscount', get(paymentSummary, ['totalDiscount'])),
//       set({}, 'subtotal', get(paymentSummary, ['subtotal'])),
//       set({}, 'paidAmount', get(paymentSummary, ['paidAmount'])),
//       set({}, 'dueAmount', get(paymentSummary, ['dueAmount'])),
//       set({}, 'payableAmount', get(paymentSummary, ['payableAmount'])),
//     );
//     this.roomRates = new Rates().deserialize(paymentSummary.roomRates);
//     this.packages = new Array<Rates>();
//     paymentSummary.packages.forEach((element) =>
//       this.packages.push(new Rates().deserialize(element))
//     );
//     return this;
//   }
// }

// export class Rates {
//   base: number;
//   totalAmount: number;
//   amount: number;
//   label: string;
//   description: string;
//   unit: number;
//   taxAndFees: TaxAndFee[];
//   discount: number;

//   deserialize(rates) {
//     Object.assign(
//       this,
//       set({}, 'base', get(rates, ['base'])),
//       set({}, 'totalAmount', get(rates, ['totalAmount'])),
//       set({}, 'amount', get(rates, ['amount'])),
//       set({}, 'label', get(rates, ['label'])),
//       set({}, 'description', get(rates, ['description'])),
//       set({}, 'unit', get(rates, ['unit'])),
//       set({}, 'discount', get(rates, ['discount'])),
//       set({}, 'taxAndFees', get(rates, ['taxAndFees']))
//     );
//     return this;
//   }
// }

// export class TaxAndFee {
//   amount: number;
//   type: string;
//   value: string;
// }

// export class HotelPaymentDetail implements Deserializable {
//   hotelPaymentConfig: HotelPaymentConfig;

//   deserialize(input: any, paymentSummary: any) {
//     this.hotelPaymentConfig = new HotelPaymentConfig();

//     Object.assign(
//       this.hotelPaymentConfig,
//       set({}, 'payAtDesk', get(paymentSummary, ['depositRules', 'payAtDesk'])),
//       set({}, 'onlinePayment', get(input, ['onlinePayment'])),
//       set({}, 'payableAmount', get(input, ['payableAmount'])),
//       set({}, 'depositRules', get(paymentSummary, ['depositRules']))
//     );
//     const paymentConfig = new PaymentConfig();
//     Object.assign(
//       paymentConfig,
//       set({}, 'id', get(input, ['id'])),
//       set({}, 'merchantId', get(input, ['merchantId'])),
//       set({}, 'accessCode', get(input, ['accessCode'])),
//       set({}, 'gatewayType', get(input, ['gatewayType'])),
//       set({}, 'subAccountId', get(input, ['subAccountId'])),
//       set({}, 'secretKey', get(input, ['secretKey'])),
//       set({}, 'externalRedirect', get(input, ['exernalRedirect']))
//     );
//     if (input.paymentMethods && paymentSummary.depositRules) {
//       paymentConfig.paymentMethods =
//         input.paymentMethods[paymentSummary.depositRules.guaranteeType];
//     }
//     this.hotelPaymentConfig.paymentConfigurations = paymentConfig;
//     return this;
//   }
// }

// export interface PaymentDetailsConfigI {
//   name: FieldSchema;
//   cardNumber: FieldSchema;
//   month: FieldSchema;
//   year: FieldSchema;
//   cvv: FieldSchema;
// }

// export class HotelPaymentConfig {
//   payAtDesk: boolean;
//   onlinePayment: boolean;
//   paymentConfigurations: paymentType.IPaymentConfiguration;
//   payableAmount?: any;
//   paymentHeaders?: PaymentHeader[];
//   depositRules: DepositRules;
// }

// export class DepositRules {
//   id: string;
//   amount: number;
//   guaranteeType: string;
//   type: string;
//   depositNight: number;
//   payAtDesk: boolean;
// }