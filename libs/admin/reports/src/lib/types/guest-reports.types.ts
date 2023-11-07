export type GuestHistoryData = {
  guestName: string;
  firstStayed: string;
  lastStayed: string;
  noOfResv: number;
  roomCharges: number;
  roomTax: number;
  otherCharges: number;
  totalCharges: number;
  totalAmount: number;
  amountPaid: number;
  balance: number;
};

export type GuestLedgerData = {
  roomNo: string;
  name: string;
  confirmationNo: string;
  balance: number;
};

export type SalesByGuestData = {
  guestId: string;
  firstName: string;
  LastName: string;
  country: string;
  emailId: string;
  firstStayed: string;
  lastStayed: string;
  noOfRes: number;
  nights: number;
  totalSales: number;
};

export type SalesByGuestResponse = GuestHistoryResponse & {
  totalSales: number;
};

export type GuestLedgerResponse = {
  id: string;
  updated: number;
  created: number;
  arrivalTime: number;
  departureTime: number;
  number: string;
  pmsStatus: string;
  state: string;
  stateCompletedSteps: string;
  stayDetails: StayDetails;
  guestDetails: GuestDetails;
  paymentSummary: PaymentSummary;
  journeysStatus: JourneyStatus;
  stepsStatus: StepsStatus;
  lastCompletedStep: string;
  currentJourney: string;
  currentJoureyStatus: string;
  currentJourneyState: string;
  source: string;
  totalDueAmount: number;
  totalPaidAmount: number;
  totalAmount: number;
  nightCount: number;
  vip: boolean;
  invoicePrepareRequest: boolean;
  pmsBooking: boolean;
};

export type GuestHistoryResponse = {
  id: string;
  salutation: string;
  firstName: string;
  lastName: string;
  contactDetails: {
    cc: string;
    contactNumber: string;
    emailId: string;
  };
  nationality: string;
  dateOfBirth: number;
  address: {
    city: string;
    state: string;
    countryCode: string;
    postalCode: string;
    addressLine1: string;
  };
  reservation: any[];
  age: number;
  gender: string;
  firstStay: number;
  lastStay: number;
  totalNights: number;
  company: {
    id: string;
    firstName: string;
    contactDetails: {
      cc: string;
      contactNumber: string;
      emailId: string;
    };
    age: number;
    firstStay: number;
    lastStay: number;
    totalNights: number;
    documentRequired: boolean;
  };
  documentRequired: boolean;
};

type GuestContactDetails = {
  cc: string;
  contactNumber: string;
  emailId: string;
};

type Guest = {
  id: string;
  salutation: string;
  firstName: string;
  lastName: string;
  contactDetails: GuestContactDetails;
  nationality: string;
  regcardUrl: string;
  age: number;
  privacy: boolean;
  firstStay: number;
  lastStay: number;
  totalNights: number;
  documentRequired: boolean;
};

type StayDetails = {
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
  address: Record<string, any>;
};

type PaymentSummary = {
  totalAmount: number;
  taxAmount: number;
  totalDiscount: number;
  paidAmount: number;
  dueAmount: number;
  payableAmount: number;
  currency: string;
  totalCgstTax: number;
  totalSgstTax: number;
  totalAddOnsAmount: number;
  totalRoomCharge: number;
  totalRoomDiscount: number;
};

type JourneyStatus = {
  NEW: string;
  PRECHECKIN: string;
  CHECKIN: string;
  CHECKOUT: string;
};

type StepsStatus = {
  STAYDETAILS: string;
  DOCUMENTS: string;
  HEALTHDECLARATION: string;
  GUESTDETAILS: string;
  PAYMENT: string;
};

type GuestDetails = {
  primaryGuest: Guest;
  accompanyGuests: Guest[];
  sharerGuests: Guest[];
  secondaryGuest: Guest[];
  kids: Guest[];
  allGuest: Record<string, Guest>;
};
