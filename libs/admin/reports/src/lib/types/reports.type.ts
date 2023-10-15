import { Cols, ModuleNames } from '@hospitality-bot/admin/shared';

export type GetReportQuery = {
  reportName: ReportType;
  entityId: string;
} & Partial<ReportFilters>;

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

export type ReportsTypeValues = ReportsType[keyof ReportsType];

export type ReportsConfig = {
  [K in ReportModules]: {
    menu: Array<{ label: string; value: ReportsType[K] }>;
  };
};

export type ReportType = ReportsConfig[ReportModules]['menu'][number]['value'];
export type ReportsMenu = ReportsConfig[ReportModules]['menu'];

export type ReportFilters = {
  toDate?: string;
  fromDate?: string;
  roomType?: string;
};

export type ReportFiltersKey = keyof ReportFilters;

export type RowValue = {
  isBold?: boolean;
  value: string;
};
export type Rows = RowValue[];

export type ClassType<T = ReportClass<any, any>> = new (...args: any[]) => T;
export interface ReportClass<T, K> {
  records: T[];
  deserialize(value: K[]): this;
}

export type ColsInfo = Omit<Cols, 'field'>;
export type ColsData<T = {}> = Record<keyof T, ColsInfo>;
