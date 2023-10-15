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

export type LoaderProps = {
  isVisible: boolean;
  showLoader?: boolean;
  loaderAlignment?: {
    top: string;
    left: string;
    right?: string;
    bottom?: string;
  };
  viewHeight?: string;
};

export interface ReservationResponseData {
  id: string;
  updated: number;
  arrivalTime: number;
  departureTime: number;
  number: string;
  pmsStatus: string;
  state: string;
  stateCompletedSteps: string;
  stayDetails: {
    arrivalTime: number;
    departureTime: number;
    expectedArrivalTime: number;
    expectedDepartureTime: number;
    adultsCount: number;
    kidsCount: number;
    comments: string;
    room: {
      roomNumber: string;
      type: string;
      unit: number;
      status: string;
    };
    checkInComment: string;
    address: Record<string, any>; // You can define a more specific interface if you have one
  };
  guestDetails: {
    primaryGuest: {
      id: string;
      firstName: string;
      lastName: string;
      contactDetails: {
        cc: string;
        contactNumber: string;
        emailId: string;
      };
      regcardUrl: string;
      age: number;
      privacy: boolean;
      documentRequired: boolean;
    };
    accompanyGuests: any[]; // You can define a more specific interface if you have one
    sharerGuests: any[]; // You can define a more specific interface if you have one
    secondaryGuest: any[]; // You can define a more specific interface if you have one
    kids: any[]; // You can define a more specific interface if you have one
    allGuest: Record<
      string,
      {
        id: string;
        firstName: string;
        lastName: string;
        contactDetails: {
          cc: string;
          contactNumber: string;
          emailId: string;
        };
        regcardUrl: string;
        age: number;
        privacy: boolean;
        documentRequired: boolean;
      }
    >;
  };
  paymentSummary: {
    totalAmount: number;
    taxAmount: number;
    totalDiscount: number;
    paidAmount: number;
    dueAmount: number;
    payableAmount: number;
    currency: string;
    printRate: boolean;
    packages: any[]; // You can define a more specific interface if you have one
    signatureUrl: string;
  };
  journeysStatus: Record<string, string>;
  stepsStatus: Record<string, string>;
  lastCompletedStep: string;
  currentJourney: string;
  currentJoureyStatus: string; // Fix the typo (currentJoureyStatus)
  currentJourneyState: string;
  source: string;
  totalDueAmount: number;
  totalPaidAmount: number;
  vip: boolean;
  invoicePrepareRequest: boolean;
  pmsBooking: boolean;
}
