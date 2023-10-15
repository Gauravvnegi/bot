import {
  DailyRevenueReportData,
  FinancialReportData,
  MonthlySummaryReportData,
} from '../types/financial-reports.types';
import { ColsData } from '../types/reports.types';

const financialReportCols: ColsData<FinancialReportData> = {
  todo: {
    header: 'TODO',
    // TODO
  },
};

export const monthlySummaryReportCols: ColsData<MonthlySummaryReportData> = {
  ...financialReportCols,
  // TODO
};

export const dailyRevenueReportCols: ColsData<DailyRevenueReportData> = {
  ...financialReportCols,
  // TODO
};
