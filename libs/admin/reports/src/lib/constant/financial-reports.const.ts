import {
  DailyRevenueReportData,
  FinancialReportData,
  MonthlySummaryReportData,
} from '../types/financial-reports.types';
import { ColsData } from '../types/reports.types';

const financialReportCols: ColsData<FinancialReportData> = {
  day: {
    header: 'DAY',
  },
  month: {
    header: 'MONTH',
  },
  year: {
    header: 'YEAR',
  },
};

export const monthlySummaryReportCols: ColsData<MonthlySummaryReportData> = {
  ...financialReportCols,
};

export const dailyRevenueReportCols: ColsData<DailyRevenueReportData> = {
  ...financialReportCols,
};
