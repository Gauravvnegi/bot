import { ModuleNames } from '@hospitality-bot/admin/shared';

export type GetReportQuery = {
  reportName: string;
  toDate: string;
  fromDate: string;
  entityId: string;
};

// Need typescript 4.0
// export type ReportModules = Extract<keyof typeof ModuleNames, `${string}_REPORTS`>;
export enum ReportModules {
  RESERVATION_REPORTS = 'RESERVATION_REPORTS',
  MANAGER_REPORTS = 'MANAGER_REPORTS',
  OCCUPANCY_REPORTS = 'OCCUPANCY_REPORTS',
  FINANCIAL_REPORTS = 'FINANCIAL_REPORTS',
  REVENUE_REPORTS = 'REVENUE_REPORTS',
}

// Need typescript 4.0
export type ReportType = {
  [ReportModules.RESERVATION_REPORTS]:
    | 'noShowReport'
    | 'cancellationReport'
    | 'arrivalReport'
    | 'departureReport';
  [ReportModules.MANAGER_REPORTS]: 'managerFlashReport';
  [ReportModules.OCCUPANCY_REPORTS]: 'historyAndForecastReport';
  [ReportModules.FINANCIAL_REPORTS]:
    | 'monthlySummaryReport'
    | 'dailyRevenueReport';
  [ReportModules.REVENUE_REPORTS]: 'cashierReport';
};
