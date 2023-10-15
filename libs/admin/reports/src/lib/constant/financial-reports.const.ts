import {
  DailyRevenueReportData,
  MonthlySummaryReportData,
} from '../types/financial-reports.types';
import { ColsData } from '../types/reports.types';

export const monthlySummaryReportCols: ColsData<MonthlySummaryReportData> = {
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
