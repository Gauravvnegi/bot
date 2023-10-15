export type NoShowReportData = {
  bookingNo: string;
  dateOfArrival: number;
  dateOfNoShow: number;
  guestName: string;
  bookingAmount: number;
  noShowCharges: number;
  noShowReason: string;
  otherCharges: number;
  amountPaid: number;
  balance: number;
};

export type ArrivalReportData = {
  bookingNo: string;
  dateOfArrival: number;
};

export type DepartureReportData = {
  bookingNo: string;
  dateOfArrival: number;
};

export type CancellationReportData = {
  bookingNo: string;
  dateOfArrival: number;
};

export type CashierReportData = {
  bookingNo: string;
  dateOfArrival: number;
};

export type DailyRevenueReportData = {
  bookingNo: string;
  dateOfArrival: number;
};

export type HistoryAndForecastReportData = {
  bookingNo: string;
  dateOfArrival: number;
};

export type ManagerFlashReportData = {
  bookingNo: string;
  dateOfArrival: number;
};

export type MonthlySummaryReportData = {
  bookingNo: string;
  dateOfArrival: number;
};
