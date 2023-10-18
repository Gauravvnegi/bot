import { ColsData } from '../types/reports.types';
import {
  ArrivalReportData,
  ReservationReportData,
  DepartureReportData,
  NoShowReportData,
  CancellationReportPartialData,
} from '../types/reservation-reports.types';

const reservationReportCols: ColsData<Omit<ReservationReportData, 'id'>> = {
  bookingNo: {
    header: 'Res/Group',
  },
  guestName: {
    header: 'Guest Name',
  },
  otherCharges: {
    header: 'Other Charges',
  },
  amountPaid: {
    header: 'Amount Paid',
  },
  balance: {
    header: 'Balance',
  },
  bookingAmount: {
    header: 'Booking Amount',
  },
};

export const noShowReportCols: ColsData<NoShowReportData> = {
  bookingNumber: reservationReportCols.bookingNo,
  dateOfArrival: {
    header: 'Date of Arrival',
  },
  noShowOn: {
    header: 'No-Show On',
  },
  guestName: {
    header: 'Guest Name',
  },
  bookingAmount: reservationReportCols.bookingAmount,
  noShowCharge: {
    header: 'No Show Charge',
  },
  noShowReason: {
    header: 'No Show Reason',
  },
  otherCharge: reservationReportCols.otherCharges,
  amountPaid: reservationReportCols.amountPaid,
  balance: reservationReportCols.balance,
};

export const cancellationReportCols: ColsData<CancellationReportPartialData> = {
  bookingNumber: reservationReportCols.bookingNo,
  guestName: noShowReportCols.guestName,
  roomType: {
    header: 'Room/Type',
  },
  checkIn: {
    header: 'Check In',
  },
  checkOut: {
    header: 'Check Out',
  },
  night: {
    header: 'Nights',
  },
  cancelledOn: {
    header: 'Cancelled On',
  },
  bookingAmount: reservationReportCols.bookingAmount,
  cancellationCharge: {
    header: 'Cancellation Charge',
  },
  cancellationReason: {
    header: 'Cancellation Charge',
  },
  otherCharge: reservationReportCols.otherCharges,
  amountPaid: reservationReportCols.amountPaid,
  balance: reservationReportCols.balance,
};

export const arrivalReportCols: ColsData<ArrivalReportData> = {
  bookingNo: { ...reservationReportCols.bookingNo },
  guestName: { ...reservationReportCols.guestName },
  roomType: {
    header: 'Room/Type',
  },
  checkIn: {
    header: 'Check In',
  },
  checkOut: {
    header: 'Check Out',
  },
  bookingAmount: { ...reservationReportCols.bookingAmount },
  status: {
    header: 'Status',
  },
  arrivalTime: {
    header: 'Arrival Time',
  },
  remark: {
    header: 'Remarks',
  },
};

export const departureReportCols: ColsData<DepartureReportData> = {
  ...arrivalReportCols,
};
