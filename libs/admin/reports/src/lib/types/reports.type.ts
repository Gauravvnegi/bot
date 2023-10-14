import { ModuleNames } from '@hospitality-bot/admin/shared';

export type GetReportQuery = {
  reportName: string;
  toDate: string;
  fromDate: string;
  entityId: string;
};

// Need typescript 4.0
// export type ReportModules = Extract<keyof typeof ModuleNames, `${string}_REPORTS`>;
export type ReportModules = Extract<
  keyof typeof ModuleNames,
  | 'RESERVATION_REPORTS'
  | 'MANAGER_REPORTS'
  | 'OCCUPANCY_REPORTS'
  | 'FINANCIAL_REPORTS'
  | 'REVENUE_REPORTS'
>;

// export enum ReportModules {
//   RESERVATION_REPORTS = 'RESERVATION_REPORTS',
//   MANAGER_REPORTS = 'MANAGER_REPORTS',
//   OCCUPANCY_REPORTS = 'OCCUPANCY_REPORTS',
//   FINANCIAL_REPORTS = 'FINANCIAL_REPORTS',
//   REVENUE_REPORTS = 'REVENUE_REPORTS',
// }

export type ReportsType = {
  RESERVATION_REPORTS:
    | 'noShowReport'
    | 'cancellationReport'
    | 'arrivalReport'
    | 'departureReport';
  MANAGER_REPORTS: 'managerFlashReport';
  OCCUPANCY_REPORTS: 'historyAndForecastReport';
  FINANCIAL_REPORTS: 'monthlySummaryReport' | 'dailyRevenueReport';
  REVENUE_REPORTS: 'cashierReport';
};
