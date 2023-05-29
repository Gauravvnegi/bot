export type CountryCodeResponse = {
  countryName: string;
  srcImg: string;
  value: string;
};

export type TaxCountryResponse = {
  countryName: string;
  srcImg: string;
  value: string;
  taxType?: TaxTypeResponse[];
};

export type TaxCommonType = {
  name: string;
  value: string;
};

export type TaxTypeResponse = TaxCommonType & {
  categories?: TaxCategoriesResponse[];
};

export type TaxCategoriesResponse = TaxCommonType & {
  tax?: TaxRateResponse[];
};

export type TaxRateResponse = {
  name: string;
  value: number;
};

export type TransactionHistoryResponse = {
  amount: number;
  bankReferenceNumber: string | null;
  created: number;
  currency: string;
  failureMessage: string | null;
  gateway: string | null;
  id: string;
  journey: number;
  orderId: string | null;
  payOnDesk: boolean;
  paymentMode: string;
  preAuth: boolean;
  preAuthType: string | null;
  remarks: string;
  reservationId: string;
  signatureUrl: string | null;
  status: string;
  transactionId: string | null;
  updated: number;
};

