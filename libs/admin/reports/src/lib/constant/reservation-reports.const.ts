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
    isSortDisabled: true,
  },
  guestName: {
    header: 'Guest Name',
    isSortDisabled: true,
  },
  otherCharges: {
    header: 'Other Charges',
    isSortDisabled: true,
  },
  amountPaid: {
    header: 'Amount Paid',
    isSortDisabled: true,
  },
  balance: {
    header: 'Balance',
    isSortDisabled: true,
  },
  bookingAmount: {
    header: 'Booking Amount',
    isSortDisabled: true,
  },
};

export const noShowReportCols: ColsData<NoShowReportData> = {
  bookingNumber: reservationReportCols.bookingNo,
  dateOfArrival: {
    header: 'Date of Arrival',
    isSortDisabled: true,
  },
  noShowOn: {
    header: 'No-Show On',
    isSortDisabled: true,
  },
  guestName: {
    header: 'Guest Name',
    isSortDisabled: true,
  },
  bookingAmount: reservationReportCols.bookingAmount,
  noShowCharge: {
    header: 'No Show Charge',
    isSortDisabled: true,
  },
  noShowReason: {
    header: 'No Show Reason',
    isSortDisabled: true,
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
    isSortDisabled: true,
  },
  checkIn: {
    header: 'Check In',
    isSortDisabled: true,
  },
  checkOut: {
    header: 'Check Out',
    isSortDisabled: true,
  },
  night: {
    header: 'Nights',
    isSortDisabled: true,
  },
  cancelledOn: {
    header: 'Cancelled On',
    isSortDisabled: true,
  },
  bookingAmount: reservationReportCols.bookingAmount,
  cancellationCharge: {
    header: 'Cancellation Charge',
    isSortDisabled: true,
  },
  cancellationReason: {
    header: 'Cancellation Reason',
    isSortDisabled: true,
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
    isSortDisabled: true,
  },
  checkIn: {
    header: 'Check In',
    isSortDisabled: true,
  },
  checkOut: {
    header: 'Check Out',
    isSortDisabled: true,
  },
  bookingAmount: { ...reservationReportCols.bookingAmount },
  status: {
    header: 'Status',
    isSortDisabled: true,
  },
  arrivalTime: {
    header: 'Arrival Time',
    isSortDisabled: true,
  },
  remark: {
    header: 'Remarks',
    isSortDisabled: true,
  },
};

export const departureReportCols: ColsData<DepartureReportData> = {
  ...arrivalReportCols,
};
