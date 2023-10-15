import {
  DailyRevenueReportData,
  MonthlySummaryReportData,
} from '../../types/financial-reports.types';
import { ManagerFlashReportData } from '../../types/manager-reports.types';
import { HistoryAndForecastReportData } from '../../types/occupany-reports.types';
import { ColsData } from '../../types/reports.types';
import {
  DefaultReservationReportData,
  NoShowReportData,
  ArrivalReportData,
  DepartureReportData,
  CancellationReportData,
} from '../../types/reservation-reports.types';
import { CashierReportData } from '../../types/revenue-reports.types';

const reservationReportCols: ColsData<DefaultReservationReportData> = {
  bookingNo: {
    header: 'Res/Group',
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
  guestName: {
    header: 'Guest Name',
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

export const arrivalReportCols: ColsData<ArrivalReportData> = {
  ...reservationReportCols,
};

export const departureReportCols: ColsData<DepartureReportData> = {
  ...reservationReportCols,
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

export const cashierReportCols: ColsData<CashierReportData> = {
  // ToDO
  bookingNo: {
    header: 'Res/Group',
  },
  dateOfArrival: {
    header: 'Date of Arrival',
  },
};

export const dailyRevenueReportCols: ColsData<DailyRevenueReportData> = {
  // ToDO
  bookingNo: {
    header: 'Res/Group',
  },
  dateOfArrival: {
    header: 'Date of Arrival',
  },
};

export const historyAndForecastReportCols: ColsData<HistoryAndForecastReportData> = {
  // ToDO
  bookingNo: {
    header: 'Res/Group',
  },
  dateOfArrival: {
    header: 'Date of Arrival',
  },
};

export const managerFlashReportCols: ColsData<ManagerFlashReportData> = {
  // ToDO
  bookingNo: {
    header: 'Res/Group',
  },
  dateOfArrival: {
    header: 'Date of Arrival',
  },
};

export const monthlySummaryReportCols: ColsData<MonthlySummaryReportData> = {
  // ToDO
  bookingNo: {
    header: 'Res/Group',
  },
  dateOfArrival: {
    header: 'Date of Arrival',
  },
};
