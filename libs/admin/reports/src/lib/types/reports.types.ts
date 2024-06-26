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
  | 'NIGHT_AUDIT_REPORTS'
  | 'TAX_REPORTS'
  | 'GUEST_REPORTS'
  | 'ACTIVITY_REPORTS'
  | 'ANALYTICS_REPORTS'
  | 'DISCOUNT_REPORTS'
  | 'DIRECT_BILLING_REPORTS'
  | 'SOURCE_REPORTS'
  | 'FOLIO_REPORTS'
  | 'FUND_REPORTS'
  | 'RATE_PACKAGE_REPORTS'
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
    | 'departureReport'
    | 'draftReservationReport'
    | 'employeeWiseReservation'
    | 'reservationAdrReport'
    | 'incomeSummaryReport'
    | 'reservationSummaryReport'
    | 'housekeepingReport'
    | 'expressCheckIn'
    | 'addOnRequestReport';
  MANAGER_REPORTS: 'managerFlashReport';
  OCCUPANCY_REPORTS: 'historyAndForecastReport' | 'houseCountReport';
  FINANCIAL_REPORTS:
    | 'monthlySummaryReport'
    | 'dailyRevenueReport'
    | 'financialReport'
    | 'closeOutBalance'
    | 'depositReport'
    | 'postingAuditReport'
    | 'advanceDepositPayment'
    | 'revParRoomReport';

  REVENUE_REPORTS: 'cashierReport' | 'payTypeReport';
  NIGHT_AUDIT_REPORTS:
    | 'auditRoomDetailsReport'
    | 'auditTaxReport'
    | 'revenueReport'
    | 'mtdAndYtdReport'
    | 'nightAuditRevenue'
    | 'nightAuditOperation';
  TAX_REPORTS: 'monthlyTaxReport' | 'lodgingTaxReport' | 'taxReport';
  GUEST_REPORTS:
    | 'guestHistory'
    | 'salesByGuest'
    | 'guestTypeReport'
    | 'guestLedger'
    | 'guestContactReport'
    | 'guestComplaintReport'
    | 'guestEscalationComplaintReport';
  ACTIVITY_REPORTS: 'reservationCreatedReport' | 'reservationActivityReport';
  ANALYTICS_REPORTS:
    | 'companyContributionsReport'
    | 'noShowSummaryReport'
    | 'businessAnalysisReport'
    | 'marketSegmentReport'
    | 'occupancyAnalysisReport';
  DISCOUNT_REPORTS: 'discountReport' | 'promoCodeReport' | 'allowanceReport';
  DIRECT_BILLING_REPORTS:
    | 'directAgentBillingReport'
    | 'directCompanyBillingReport';
  SOURCE_REPORTS: 'marketSource';
  FOLIO_REPORTS: 'folioListReport';
  RATE_PACKAGE_REPORTS: 'rateVariation';
  FUND_REPORTS: 'addWithdrawalFundReport';
  COMPLAINT_REPORT:
    | 'serviceItemWiseComplaintReport'
    | 'categoryWiseComplaintReport';
  ORDER_REPORT: 'orderSummary';
  CAMPAIGN_REPORTS:
    | 'emailCampaign'
    | 'whatsappCampaign'
    | 'emailMarketingTemplate'
    | 'whatsappMarketingTemplate';
};

export type ReportsTypeValues = ReportsType[keyof ReportsType];

export type ReportsConfig = {
  [K in ReportModules]?: {
    menu: Array<{ label: string; value: ReportsType[K] }>;
  };
};

export type ReportType = ReportsConfig[ReportModules]['menu'][number]['value'];
export type ReportsMenu = ReportsConfig[ReportModules]['menu'];

export type ReportFilters = {
  date?: number;
  toDate?: number;
  fromDate?: number;
  roomType?: string;
  month?: number;
  cashierId?: string;
  employeeId?: string;
};

export type AvailableFilters = keyof ReportFilters;

export type ReportFiltersKey = keyof ReportFilters;

export type RowValue = {
  isBold?: boolean;
  value: string;
};
export type Rows = RowValue[];

export type ClassType<T = ReportClass<any, any>> = new (...args: any[]) => T;
export interface ReportClass<T, K> {
  records: T[];
  deserialize(value: K[] | {}): this;
}

export type ColsInfo = Omit<Cols, 'field'>;
export type ColsData<T = {}> = Record<keyof T, ColsInfo>;

export class RowStyles {
  isHeader?: boolean;
  isSubTotal?: boolean;
  isTotal?: boolean;
}

export type RowStylesKeys = keyof RowStyles;
export type CalendarType = 'DAY' | 'MONTH' | 'YEAR' | 'GROSS' | 'ADJ';
