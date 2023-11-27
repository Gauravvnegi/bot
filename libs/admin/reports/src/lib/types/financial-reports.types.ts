import { CalendarType } from './reports.types';

export type FinancialReportData = {
  bookingNo: string;
  folioNo: string;
  nights: number;
  lodging: number;
  lodgingTax: number;
  discount: number;
  otherCharges: number;
  otherChargesTax: number;
  otherChargesDiscount: number;
  postTaxTotal: number;
  paid: number;
  balance: number;
};

export type CloseOutBalanceData = {
  bookingNo: string;
  folioNo: string;
  checkOut: string;
  guestName: string;
  lodgingAndTax: number;
  otherChargesAndTax: number;
  amount: number;
  collected: number;
  openBalance: number;
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
  lodging: number;
  otherCharges: number;
  taxes: number;
  btc: number;
  cash: number;
  bankTransfer: number;
  payAtDesk: number;
  onlinePaymentGateway: number;
  totalPaid: number;
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
};

export type PostingAuditReportData = {
  room: string;
  name: string;
  user: string;
  trxAmount: number;
  baseAmount: number;
  cgst: number;
  sgst: number;
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
  gross: string;
  adj: string;
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
  avgDailyRateIncludeInclusion: number;
  avgDailyRateExcludeInclusion: number;
  roomRent: number;
  roomInclusions: number;
  totalTaxes: number;
  directSales: number;
  directSaleTax: number;
  grossTotal: number;
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
