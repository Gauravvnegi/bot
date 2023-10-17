import { Arrival, Departure } from '../models/reservation-reports.models';

export type ReservationReportData = {
  bookingNo: string;
  guestName: string;
  bookingAmount: number;
  otherCharges: number;
  amountPaid: number;
  balance: number;
};

export type NoShowReportData = ReservationReportData & {
  dateOfArrival: number;
  dateOfNoShow: number;
  noShowCharges: number;
  noShowReason: string;
};

export type ArrivalReportData = Omit<Arrival, 'deserialize'>;

export type DepartureReportData = Omit<Departure, 'deserialize'>;

export type CancellationReportData = ReservationReportData & {
  roomAndRoomType: string;
  checkInDate: number;
  checkOutDate: number;
  noOfNights: number;
  cancelationDate: number;
  cancellationCharges: number;
  cancellationReason: string;
};
