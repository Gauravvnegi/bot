import { Cashier } from '../models/revenue-reports.models';
import { RowStylesKeys } from './reports.types';
import { User } from './reservation-reports.types';

export type CashierReportData = Omit<Cashier, 'deserialize' | RowStylesKeys>;

export type CashierReportResponse = {
  paymentMode: string;
  totalAmount: number;
};

export type PayTypeReportData = {
  paymentMode: string;
  paymentType: string;
  employee: string;
  bookingNo: string;
  folioNo: string;
  guestName: string;
  room: string;
  counter: string;
  dateAndTime: string;
  amount: number;
  description: string;
};

export type PayTypeReportResponse = {
  id: string;
  amount: number;
  status: string;
  reservationId: string;
  created: number;
  paymentMethod: string;
  reservationNumber: string;
  reservation: Reservation;
  remarks: string;
};

interface ContactDetails {
  cc: string;
  contactNumber: string;
  emailId: string;
}

interface Guest {
  id: string;
  salutation: string;
  firstName: string;
  lastName: string;
  contactDetails: ContactDetails;
  nationality: string;
  regcardUrl: string;
  age: number;
  privacy: boolean;
  firstStay: number;
  lastStay: number;
  totalNights: number;
  documentRequired: boolean;
}

interface Room {
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
  room: Room;
  checkInComment: string;
  address: Record<string, never>; // Assuming address is empty
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
  totalRoomDiscount: number;
}

interface GuestDetails {
  primaryGuest: Guest;
  accompanyGuests: Guest[];
  sharerGuests: Guest[];
  secondaryGuest: Guest[];
  kids: Guest[];
  allGuest: Record<string, Guest>;
}

interface JourneysStatus {
  CHECKOUT: string;
  PRECHECKIN: string;
  NEW: string;
  CHECKIN: string;
}

interface StepsStatus {
  PAYMENT: string;
  GUESTDETAILS: string;
  STAYDETAILS: string;
  DOCUMENTS: string;
  HEALTHDECLARATION: string;
}

interface Reservation {
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
  journeysStatus: JourneysStatus;
  stepsStatus: StepsStatus;
  lastCompletedStep: string;
  currentJourney: string;
  currentJoureyStatus: string;
  currentJourneyState: string;
  source: string;
  totalDueAmount: number;
  totalPaidAmount: number;
  totalAmount: number;
  invoiceCode: string;
  nightCount: number;
  vip: boolean;
  invoicePrepareRequest: boolean;
  pmsBooking: boolean;
  user: User
}

interface ReservationResponse {}
