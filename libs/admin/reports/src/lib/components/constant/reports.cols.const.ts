import { ColsData } from '../../types/reports.type';
import {
  ArrivalReportData,
  NoShowReportData,
  DepartureReportData,
  CancellationReportData,
  CashierReportData,
  DailyRevenueReportData,
  HistoryAndForecastReportData,
  ManagerFlashReportData,
  MonthlySummaryReportData,
} from '../../types/reportsData.type';

export const noShowReportCols: ColsData<NoShowReportData> = {
  bookingNo: {
    header: 'Res/Group',
  },
  dateOfArrival: {
    header: 'Date of Arrival',
  },
  dateOfNoShow: {
    header: 'No-Show On',
  },
  guestName: {
    header: 'Guest Name',
  },
  bookingAmount: {
    header: 'Booking Amount',
  },
  noShowCharges: {
    header: 'No show charges',
  },
  noShowReason: {
    header: 'No show Reason',
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
};

export const arrivalReportCols: ColsData<ArrivalReportData> = {
  // ToDO
  bookingNo: {
    header: 'Res/Group',
  },
  dateOfArrival: {
    header: 'Date of Arrival',
  },
};

export const departureReportCols: ColsData<DepartureReportData> = {
  // ToDO
  bookingNo: {
    header: 'Res/Group',
  },
  dateOfArrival: {
    header: 'Date of Arrival',
  },
};

export const cancellationReportCols: ColsData<CancellationReportData> = {
  // ToDO
  bookingNo: {
    header: 'Res/Group',
  },
  dateOfArrival: {
    header: 'Date of Arrival',
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
