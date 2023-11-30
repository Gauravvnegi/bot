import {
  Arrival,
  Cancellation,
  Departure,
  NoShows,
} from '../models/reservation-reports.models';

export type ReservationReportData = {
  id?: string;
  bookingNo: string;
  guestName: string;
  bookingAmount: number;
  otherCharges: number;
  amountPaid: number;
  balance: number;
};

export type NoShowReportData = Omit<NoShows, 'deserialize' | 'id'> & {};

export type ArrivalReportData = Omit<Arrival, 'deserialize' | 'id'| 'departureTime'>;

export type DepartureReportData = Omit<Departure, 'deserialize' | 'id' | 'arrivalTime'>;

export type CancellationReportData = Omit<Cancellation, 'deserialize' | 'id'>;
export type CancellationReportPartialData = Omit<
  CancellationReportData,
  UnnecessaryCancellationObject
>;

export type DraftReservationReportData = {
  id: string;
  bookingNo: string;
  guestName: string;
  roomType: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  tempReservedNumber: string;
  bookingAmount: number;
  paidAmount: number;
  balance: number;
  status: string;
};

export type EmployeeWiseReservationReportData = {
  id?: string;
  userName: string;
  bookingNo: string;
  guestName: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  roomCharge: number;
  tax: number;
  otherCharges: number;
  totalCharge: number;
  amountPaid: number;
};

export type ReservationAdrReportData = {
  id?: string;
  bookingNo: string;
  guestName: string;
  roomType: string;
  roomNo: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  roomRent: number;
  adr: number;
};

export type IncomeSummaryReportData = {
  id: string;
  bookingNo: string;
  guestName: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  lodgingAndOtherCharges: number;
  taxTotal: number;
  paidAmount: number;
};

export type ReservationSummaryReportData = {
  id: string;
  businessSource: string;
  marketSegment: string;
  phoneNumber: string;
  email: string;
  roomType: string;
  room: string;
  createdOn: string;
  checkIn: string;
  checkOut: string;
  lodging: number;
  lodgingTax: number;
  otherCharges: number;
  otherChargesTax: number;
  avgRoomRate: number;
  paidAndRevenueLoss: number;
  balance: number;
};

export type HousekeepingReportData = {
  roomNo: string;
  roomType: string;
  bookingNo: string;
  guestName: string;
  checkIn: string;
  checkOut: string;
  nights: string;
  roomNotes: string;
  status: string;
};

export type HousekeepingReportResponse = {
  roomNumber: string;
  status: 'Clean' | 'Dirty' | 'Out of Order' | 'Occupied' | 'Out of Service';
  remarks: string;
  roomTypeName: string;
  reservationNumber: string;
  guestName: string;
  arrivalDate: string;
  departureDate: string;
  nights: string;
};

export type UnnecessaryCancellationObject =
  | 'dateOfArrival'
  | 'noShowOn'
  | 'noShowCharge'
  | 'noShowReason'
  | 'id';
