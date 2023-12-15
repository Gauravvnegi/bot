import { ReservationItemsPayment } from './financial-reports.types';

export type MonthlyTaxReportData = {
  taxName: string;
  taxCategory: string;
  amount: number;
};

export type MonthlyTaxReportResponse = {
  amount: number;
  category: string;
  type: 'CGST' | 'SGST';
};

export type TaxReportData = {
  res: string;
  checkInDate: string;
  checkOutDate: string;
  roomCharge: string;
  otherCharge: string;
  cgst: string;
  sgst: string;
  postTaxTotal: string;
};

export type TaxReportResponse = LodgingTaxReportResponse & {
  reservationItemsPayment: {
    dueAmount: number;
    paidAmount: number;
    payableAmount: number;
    taxAmount: number;
    totalAddOnsAmount: number;
    totalAmount: number;
    totalCgstTax: number;
    totalDiscount: number;
    totalRoomCharge: number;
    totalSgstTax: number;
  };
};

export type LodgingTaxReportData = {
  res: string;
  guestName: string;
  checkInDate: string;
  checkOutDate: string;
  roomType: string;
  rate: string;
  discounts: string;
  netRate: string;
  occupancyTax: string;
  otherTax: string;
};

export type LodgingTaxReportResponse = {
  id: string;
  updated: number;
  arrivalTime: number;
  departureTime: number;
  number: string;
  pmsStatus: string;
  state: string;
  stateCompletedSteps: string;
  stayDetails: StayDetails;
  guestDetails: Guest;
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
  invoiceCode?: string;
  nights: number;
  pmsBooking: boolean;
  invoicePrepareRequest: boolean;
  vip: boolean;
  reservationItemsPayment: ReservationItemsPayment;
};
interface GuestDetails {
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
  regcardUrl: string;
  age: number;
  privacy: boolean;
  firstStay: number;
  lastStay: number;
  totalNights: number;
  documentRequired: boolean;
}

interface RoomDetails {
  roomNumber: string;
  type: string;
  unit: number;
  status: string;
}

interface StayDetails {
  arrivalTime: number;
  departureTime: number;
  expectedArrivalTime: number;
  expectedDepartureTime: number;
  adultsCount: number;
  kidsCount: number;
  comments: string;
  room: RoomDetails;
  checkInComment: string;
  address: Record<string, any>;
}

interface PaymentSummary {
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
}

interface JourneyStatus {
  NEW: string;
  PRECHECKIN: string;
  CHECKOUT: string;
  CHECKIN: string;
}

interface StepsStatus {
  GUESTDETAILS: string;
  DOCUMENTS: string;
  PAYMENT: string;
  HEALTHDECLARATION: string;
  STAYDETAILS: string;
}

interface Guest {
  primaryGuest: GuestDetails;
  accompanyGuests: GuestDetails[];
  sharerGuests: GuestDetails[];
  secondaryGuest: GuestDetails[];
  kids: GuestDetails[];
  allGuest: Record<string, GuestDetails>;
}

interface GuestInfo {
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
  regcardUrl: string;
  age: number;
  privacy: boolean;
  firstStay: number;
  lastStay: number;
  totalNights: number;
  documentRequired: boolean;
}
