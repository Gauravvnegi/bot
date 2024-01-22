import { ReservationItemsPayment } from './financial-reports.types';

export type GuestHistoryData = {
  guestName: string;
  firstStayed: string;
  lastStayed: string;
  noOfResv: number;
  roomCharges: string;
  roomTax: string;
  otherCharges: string;
  totalCharges: string;
  totalAmount: string;
  amountPaid: string;
  balance: string;
};

export type GuestLedgerData = {
  id: string;
  roomNo: string;
  name: string;
  confirmationNo: string;
  balance: string;
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

export type GuestContactReportData = {
  guestId: string;
  salutation: string;
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  nationality: string;
  phone: string;
  mobileNo: string;
  fax: string;
  zipCode: string;
  email: string;
  gender: string;
  dateOfBirth: string;
  idType: string;
};

export type GuestContactReportResponse = {
  id: string;
  salutation: string;
  firstName: string;
  lastName: string;
  contactDetails: ContactDetails;
  dateOfBirth: number;
  nationality: string;
  address: Record<string, never>;
  reservation: Reservation[];
  age: number;
  firstStay: number;
  lastStay: number;
  totalNights: number;
  documentRequired: boolean;
  gender: string;
};

export type SalesByGuestResponse = GuestHistoryResponse & {
  totalSales: number;
};

export type GuestEscalationComplaintReportData = GuestComplaintReportData & {
  escalationLevel: number;
  frequency: number;
};

export type GuestComplaintReportData = {
  id: string;
  guestName: string;
  serviceItem: string;
  complaint: string;
  status: string;
  actionTakenBy: string;
  department: string;
  customerSentiment: string;
  sla: number;
  jobDuration: number;
};

export type GuestEscalationComplaintReportResponse = {
  id: string;
  rooms: Room[];
  remarks: string;
  requestTime: number;
  status: string;
  action: string;
  entityId: string;
  guestDetails: GuestDetails;
  priority: string;
  jobDuration: number;
  jobID: string;
  jobNo: string;
  itemCode: string;
  itemName: string;
  itemId: string;
  quantity: number;
  closedTime: number;
  source: string;
  pickupTime: number;
  timeLeft: number;
  assigneeName: string;
  assigneeId: string;
  departmentEscalationTime: number;
  scheduledEscalation: number;
  sentCount: number;
  departmentName: string;
  sla: number;
};

export type GuestComplaintReportResponse = GuestEscalationComplaintReportResponse & {};

interface ContactDetails {
  contactNumber: string;
}

interface Room {
  roomNumber: string;
  type: string;
  unit: number;
  status: string;
}

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
  currentJourneyStatus: string;
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
  reservation: Reservation[];
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

export type PaymentSummary = {
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
  journeysStatus: JourneyStatus;
  stepsStatus: StepsStatus;
  lastCompletedStep: string;
  currentJourney: string;
  currentJourneyStatus: string;
  currentJourneyState: string;
  totalDueAmount: number;
  totalPaidAmount: number;
  totalAmount: number;
  nightCount: number;
  vip: boolean;
  pmsBooking: boolean;
  invoicePrepareRequest: boolean;
  reservationItemsPayment: ReservationItemsPayment;
}

interface ContactDetails {
  cc: string;
  contactNumber: string;
  emailId: string;
}
