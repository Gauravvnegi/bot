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

export type ArrivalReportData = Omit<Arrival, 'deserialize' | 'id'>;

export type DepartureReportData = Omit<Departure, 'deserialize' | 'id'>;

export type CancellationReportData = Omit<Cancellation, 'deserialize' | 'id'>;
export type CancellationReportPartialData = Omit<
  CancellationReportData,
  UnnecessaryCancellationObject
>;
export type UnnecessaryCancellationObject =
  | 'dateOfArrival'
  | 'noShowOn'
  | 'noShowCharge'
  | 'noShowReason'
  | 'id';
