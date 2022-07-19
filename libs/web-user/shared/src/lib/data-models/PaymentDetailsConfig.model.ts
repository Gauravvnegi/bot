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
      set(
        {},
        'transactionsHistory',
        get(paymentSummary, ['transactionsHistory'])
      ),
      set({}, 'depositRules', get(paymentSummary, ['depositRules'])),
      set({}, 'printRate', get(paymentSummary, ['printRate']))
    );
    return this;
  }
}

export class HotelConfig {
  payAtDesk: boolean;
  paymentConfigurations: paymentType.IPaymentConfiguration;
  paymentMethods:
    | paymentType.IPrePaymentPM[]
    | paymentType.IDepositPM[]
    | paymentType.IGuaranteePM[];

  deserialize(input: paymentType.IPaymentConfiguration, paymentSummary: any) {
    Object.assign(
      this,
      set({}, 'payAtDesk', get(paymentSummary, ['depositRules', 'payAtDesk']))
    );
    this.paymentMethods =
      input.paymentMethods &&
      input.paymentMethods[paymentSummary.depositRules.guaranteeType];
    this.paymentConfigurations = input;
    return this;
  }
}

export class PaymentStatus {
  payOnDesk: boolean;
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
    type:
      | paymentType.IPrePaymentPM
      | paymentType.IDepositPM
      | paymentType.IGuaranteePM
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
  type:
    | paymentType.IPrePaymentPM
    | paymentType.IDepositPM
    | paymentType.IGuaranteePM;
}
