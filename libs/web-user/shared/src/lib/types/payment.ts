import {
  DepositRules,
  PaymentHeaders,
  GatewayTypes,
} from '../constants/payment';

export interface IRoomRates {
  base: number;
  totalAmount: number;
  amount: number;
  discount: number;
  description: string;
  label: string;
  unit: number;
  taxAndFees: ITaxAndFees[];
}

// TO-DO: To come from packages
export interface IPackage {
  base: number;
  totalAmount: number;
  amount: number;
  discount: number;
  description: string;
  label: string;
  unit: number;
  taxAndFees: ITaxAndFees[];
}

export interface IDepositRule {
  id: string;
  amount: number;
  label: string;
  guaranteeType:
    | DepositRules.deposit
    | DepositRules.guarantee
    | DepositRules.prePayment;
  type: string;
  depositNight: number;
  payAtDesk: boolean;
}

export interface ITaxAndFees {
  amount: number;
  type: string;
  value: string;
}

export interface IPaymentConfiguration {
  id: string;
  merchantId: string;
  accessCode: string;
  gatewayType: GatewayTypes.ccavenue;
  subAccountId: string;
  chainId: string;
  secretKey: string;
  paymentMethods: IPaymentMethods;
  externalRedirect: boolean;
  iconUrl: string;
  currency: string;
  paymentHeaders: IPaymentHeader[];
}

export interface IPaymentHeader {
  id: string;
  type: PaymentHeaders.payAtDesk | PaymentHeaders.payNow;
  description: string;
  imageUrl: string;
}

export interface IDepositPM extends IPaymentMethod {}
export interface IGuaranteePM extends IPaymentMethod {}
export interface IPrePaymentPM extends IPaymentMethod {}

export interface IPaymentMethods {
  [DepositRules.deposit]: IDepositPM[];
  [DepositRules.guarantee]: IGuaranteePM[];
  [DepositRules.prePayment]: IPrePaymentPM[];
}

export interface IPaymentMethod {
  id: string;
  type: string;
  imageUrl: string;
}
