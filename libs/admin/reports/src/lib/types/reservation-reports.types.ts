import {
  Arrival,
  Cancellation,
  Departure,
  NoShows,
} from '../models/reservation-reports.models';

export type ReservationReportData = {
  bookingNo: string;
  guestName: string;
  bookingAmount: number;
  otherCharges: number;
  amountPaid: number;
  balance: number;
};

export type NoShowReportData = Omit<NoShows, 'deserialize'> & {};

export type ArrivalReportData = Omit<Arrival, 'deserialize'>;

export type DepartureReportData = Omit<Departure, 'deserialize'>;

export type CancellationReportData = Omit<Cancellation, 'deserialize'>;
export type CancellationReportPartialData = Omit<
  CancellationReportData,
  UnnecessaryCancellationObject
>;
export type UnnecessaryCancellationObject =
  | 'dateOfArrival'
  | 'noShowOn'
  | 'noShowCharge'
  | 'noShowReason';
