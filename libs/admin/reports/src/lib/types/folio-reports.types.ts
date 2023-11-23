export type FolioListReportData = {
  bookingNo: string;
  folioNo: string;
  guestName: string;
  discount: number;
  amount: number;
  tax: number;
  btc: number;
  cash: number;
  bankTransfer: number;
  payAtDesk: number;
  onlinePaymentGateway: number;
  other: number;
  paid: number;
  balance: number;
  date: string;
};

export type FolioListReportResponse = {
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
  reservationItemsPayment: ReservationItemsPayment;
  nightCount: number;
  vip: boolean;
  pmsBooking: boolean;
  invoicePrepareRequest: boolean;
};

interface ContactDetails {
  cc: string;
  contactNumber: string;
  emailId: string;
}

interface RoomDetails {
  roomNumber: string;
  type: string;
  unit: number;
  status: string;
}

interface Address {
  addressLines: (string | null)[];
  city: string;
  countryCode: string;
  postalCode: string;
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
  address: Address;
}

interface PrimaryGuest {
  id: string;
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

interface SharerGuest {
  id: string;
  contactDetails: ContactDetails;
  age: number;
  firstStay: number;
  lastStay: number;
  totalNights: number;
  documentRequired: boolean;
}

interface GuestDetails {
  primaryGuest: PrimaryGuest;
  accompanyGuests: any[]; // You may want to create a type for this if it has a specific structure
  sharerGuests: SharerGuest[];
  secondaryGuest: any[]; // You may want to create a type for this if it has a specific structure
  kids: any[]; // You may want to create a type for this if it has a specific structure
  allGuest: Record<string, PrimaryGuest | SharerGuest>;
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

interface JourneysStatus {
  CHECKIN: string;
  PRECHECKIN: string;
  NEW: string;
  CHECKOUT: string;
}

interface StepsStatus {
  DOCUMENTS: string;
  STAYDETAILS: string;
  GUESTDETAILS: string;
  PAYMENT: string;
  HEALTHDECLARATION: string;
}

interface ReservationItemsPayment {
  totalAmount: number;
  taxAmount: number;
  totalDiscount: number;
  paidAmount: number;
  dueAmount: number;
  payableAmount: number;
  totalCgstTax: number;
  totalSgstTax: number;
  totalAddOnsAmount: number;
  totalRoomCharge: number;
  totalRoomDiscount: number;
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
  reservationItemsPayment: ReservationItemsPayment;
  nightCount: number;
  vip: boolean;
  pmsBooking: boolean;
  invoicePrepareRequest: boolean;
}

interface ReservationResponse {
  id: string;
  firstName: string;
  lastName: string;
  contactDetails: ContactDetails;
  nationality: string;
  address: Record<string, never>; // Assuming it's an empty object for simplicity
  reservation: Reservation[];
  age: number;
  firstStay: number;
  lastStay: number;
  totalNights: number;
  documentRequired: boolean;
}
