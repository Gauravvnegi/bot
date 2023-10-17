import { ColsData } from '../types/reports.types';
import {
  ArrivalReportData,
  CancellationReportData,
  ReservationReportData,
  DepartureReportData,
  NoShowReportData,
} from '../types/reservation-reports.types';

const reservationReportCols: ColsData<ReservationReportData> = {
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
  ...reservationReportCols,
  dateOfArrival: {
    header: 'Date of Arrival',
  },
  dateOfNoShow: {
    header: 'No-Show On',
  },
  noShowCharges: {
    header: 'No show charges',
  },
  noShowReason: {
    header: 'No show Reason',
  },
};

export const cancellationReportCols: ColsData<CancellationReportData> = {
  ...reservationReportCols,
  roomAndRoomType: {
    header: 'Room/ Type',
  },
  checkInDate: {
    header: 'Check In',
  },
  checkOutDate: {
    header: 'Check out',
  },
  noOfNights: {
    header: 'Nights',
  },
  cancelationDate: {
    header: 'Cancelled ON',
  },
  cancellationCharges: {
    header: 'Cancellation Charge',
  },
  cancellationReason: {
    header: 'Cancellation Reason',
  },
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
