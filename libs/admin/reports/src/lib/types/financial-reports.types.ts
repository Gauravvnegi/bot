import { CalendarType } from './reports.types';
import { User } from './reservation-reports.types';

export type FinancialReportData = {
  bookingNo: string;
  folioNo: string;
  nights: number;
  lodging: string;
  lodgingTax: string;
  discount: string;
  otherCharges: string;
  otherChargesTax: string;
  otherChargesDiscount: string;
  postTaxTotal: string;
  paid: string;
  balance: string;
};

export type CloseOutBalanceData = {
  bookingNo: string;
  folioNo: string;
  checkOut: string;
  guestName: string;
  lodgingAndTax: string;
  otherChargesAndTax: string;
  amount: string;
  collected: string;
  openBalance: string;
};

export type CloseOutBalanceResponse = {
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
  invoicePrepareRequest: InvoicePrepareRequest;
};

export type DepositReportData = {
  bookingNo: string;
  guestName: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  lodging: string;
  otherCharges: string;
  taxes: string;
  btc: string;
  cash: string;
  bankTransfer: string;
  payAtDesk: string;
  onlinePaymentGateway: string;
  totalPaid: string;
  lastDepositDate: string;
};

export type DepositReportResponse = {
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
  invoicePrepareRequest: InvoicePrepareRequest;
  paymentModesAndTotalAmount: PaymentModesAndTotalAmount;
};
export type PaymentModesAndTotalAmount = {
  paymentMode: PaymentMode;
  totalAmount: number;
  lastPaymentDate: number;
}[];

export type PaymentMode =
  | 'Cash Payment'
  | 'Bank Transfer'
  | 'Pay at Desk'
  | 'Online Payment Gateway'
  | 'Bill to Company'
  | 'CCAVENUE'
  | 'Paytm'
  | 'Paypal'
  | 'Razorpay'
  | 'PayU'
  | 'Stripe'
  | 'PAYU'
  | 'Bank Deposit';

export type PostingAuditReportData = {
  room: string;
  name: string;
  user: string;
  trxAmount: string;
  baseAmount: string;
  cgst: string;
  sgst: string;
};

export type PostingAuditReportResponse = {
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
  invoicePrepareRequest: InvoicePrepareRequest;
  user: User;
};

export type FinancialReportResponse = {
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
  invoicePrepareRequest: boolean;
  pmsBooking: boolean;
};

export type DailyRevenueReportData = {
  emptyCell: string;
  // gross: string;
  // adj: string;
  today: string;
  month: string;
  year: string;
  isBold?: boolean;
  isGreyBg?: boolean;
  isBlueBg?: boolean;
  isBlackBg?: boolean;
};

export type MonthlySummaryReportData = {
  day: string;
  roomCount: number;
  occupancy: string;
  avgDailyRateIncludeInclusion: string;
  avgDailyRateExcludeInclusion: string;
  roomRent: string;
  roomInclusions: string;
  totalTaxes: string;
  directSales: string;
  directSaleTax: string;
  grossTotal: string;
};

export type MonthlySummaryReportResponse = {
  id: string;
  date: number;
  entityId: string;
  roomRevenue: number;
  revPar: number;
  averageRate: number;
  totalRooms: number;
  occupiedRooms: number;
  outOfOrderRooms: number;
  outOfServiceRooms: number;
  complimentaryRooms: number;
  houseUseRooms: number;
  occupancyPercentage: number;
  arrivalRooms: number;
  departureRooms: number;
  dayUseRooms: number;
  individualRoomsInhouse: number;
  frontDeskRoomsInhouse: number;
  companyRoomsInhouse: number;
  agentRoomsInhouse: number;
  walkInRoomsInhouse: number;
  noShowRooms: number;
  inhouseAdults: number;
  inhouseChildren: number;
  individualPersonInhouse: number;
  frontDeskPersonInhouse: number;
  companyPersonInhouse: number;
  agentPersonInhouse: number;
  walkInPersonInhouse: number;
  cancelledReservationForToday: number;
  reservationsMadeToday: number;
  nextDayArrivalRooms: number;
  nextDayDepartureRooms: number;
  roomChargePerDay: number;
  roomCgstPerDay: number;
  roomSgstPerDay: number;
  vipPersonInhouse: number;
  arrivalPersons: number;
  departurePersons: number;
  noShowPersons: number;
  roomNightsReserved: number;
  inclusionOrAddOn: number;
  totalPersonInHouse: number;
  noShowReservationForToday: number;
  totalTax: number;
  grossTotal: number;
  subTotalObject: boolean;
  averageRateIncl: number;
};

export type DailyRevenueReportResponse<
  T extends CalendarType = CalendarType
> = {
  date: number;
  entityId: string;
  roomRevenue: number;
  revPar: number;
  averageRate: number;
  totalRooms: number;
  occupiedRooms: number;
  outOfOrderRooms: number;
  outOfServiceRooms: number;
  complimentaryRooms: number;
  houseUseRooms: number;
  occupancyPercentage: number;
  arrivalRooms: number;
  departureRooms: number;
  dayUseRooms: number;
  individualRoomsInhouse: number;
  frontDeskRoomsInhouse: number;
  companyRoomsInhouse: number;
  agentRoomsInhouse: number;
  walkInRoomsInhouse: number;
  noShowRooms: number;
  inhouseAdults: number;
  inhouseChildren: number;
  individualPersonInhouse: number;
  frontDeskPersonInhouse: number;
  companyPersonInhouse: number;
  agentPersonInhouse: number;
  walkInPersonInhouse: number;
  cancelledReservationForToday: number;
  reservationsMadeToday: number;
  nextDayArrivalRooms: number;
  nextDayDepartureRooms: number;
  roomChargePerDay: number;
  roomCgstPerDay: number;
  roomSgstPerDay: number;
  calenderType: string;
  vipPersonInhouse: number;
  arrivalPersons: number;
  departurePersons: number;
  noShowPersons: number;
  roomNightsReserved: number;
  inclusionOrAddOn: number;
  totalPersonInHouse: number;
  noShowReservationForToday: number;
  totalTax: number;
  grossTotal: number;
  subTotalObject: boolean;
  cancellation: number;
  noShow: number;
  totalRoom: number;
  addOn: number;
  totalOthers: number;
  totalRevenue: number;
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
  address: Record<string, never>; // Assuming it's an empty object for simplicity
}

interface PrimaryGuest {
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

interface GuestDetails {
  primaryGuest: PrimaryGuest;
  accompanyGuests: any[]; // You may want to create a type for this if it has a specific structure
  sharerGuests: any[]; // You may want to create a type for this if it has a specific structure
  secondaryGuest: any[]; // You may want to create a type for this if it has a specific structure
  kids: any[]; // You may want to create a type for this if it has a specific structure
  allGuest: Record<string, PrimaryGuest>;
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
  NEW: string;
  CHECKOUT: string;
  PRECHECKIN: string;
}

interface StepsStatus {
  DOCUMENTS: string;
  PAYMENT: string;
  STAYDETAILS: string;
  GUESTDETAILS: string;
  HEALTHDECLARATION: string;
}

export type ReservationItemsPayment = {
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
  totalAddOnsTax: number;
  totalAddOnsDiscount: number;
};

interface InvoicePrepareRequest {
  totalDueAmount: number;
  totalPaidAmount: number;
  totalAmount: number;
  invoiceCode: string;
  reservationItemsPayment: ReservationItemsPayment;
  nightCount: number;
  vip: boolean;
  invoicePrepareRequest: boolean;
  pmsBooking: boolean;
}
