import { Cols } from '@hospitality-bot/admin/shared';
import {
  ReservationActivityReport,
  ReservationCreatedReport,
} from '../models/activity-reports.models';
import {
  BusinessAnalysisReport,
  CompanyContributionsReport,
  MarketSegmentReport,
  NoShowSummaryReport,
} from '../models/analytics-reports.models';
import {
  DirectAgentBillingReport,
  DirectCompanyBillingReport,
} from '../models/direct-billing-reports.models';
import { DiscountAllowanceReport } from '../models/discount-reports.models';
import {
  CloseOutBalanceReport,
  DailyRevenueReport,
  DepositReport,
  FinancialReport,
  MonthlySummaryReport,
  PostingAuditReport,
} from '../models/financial-reports.models';
import { FolioListReport } from '../models/folio-list-reports.models';
import {
  GuestContactReport,
  GuestHistory,
  GuestLedger,
  SalesByGuest,
} from '../models/guest-reports.model';
import { ManagerFlashReport } from '../models/manager-reports.models';
import {
  AuditRoomDetailsReport,
  AuditTaxReport,
  MtdAndYtdReport,
} from '../models/night-audit-reports.model';
import { HistoryAndForecastReport } from '../models/occupancy-reports.models';
import {
  ArrivalReport,
  CancellationReport,
  DepartureReport,
  DraftReservationReport,
  EmployeeWiseReservationReport,
  HousekeepingReport,
  IncomeSummaryReport,
  NoShowReport,
  ReservationAdrReport,
  ReservationSummaryReport,
} from '../models/reservation-reports.models';
import { CashierReport, PayTypeReport } from '../models/revenue-reports.models';
import { MarketSourceReport } from '../models/scource-reports.models';
import {
  LodgingTaxReport,
  MonthlyTaxReport,
  TaxReport,
} from '../models/tax-reports.models';
import {
  AvailableFilters,
  ClassType,
  ColsData,
  ColsInfo,
  ReportsConfig,
  ReportsType,
  ReportsTypeValues,
  RowStylesKeys,
} from '../types/reports.types';
import {
  reservationActivityReportCols,
  reservationCreatedReportCols,
} from './activity-reports.const';
import {
  businessAnalysisReportCols,
  companyContributionsReportCols,
  marketSegmentReportCols,
  noShowSummaryReportCols,
} from './analytics-reports.const';
import {
  directAgentBillingReportsCols,
  directCompanyBillingReportCols,
} from './direct-billing-reports.const';
import { discountAllowanceReportCols } from './discount-reports.const';
import {
  closeOutBalanceCols,
  dailyRevenueReportCols,
  depositReportCols,
  financialReportCols,
  monthlySummaryReportCols,
  postingAuditReportCols,
} from './financial-reports.const';
import { folioListReportHeaderCols } from './folio-list-reports.const';
import {
  SalesByGuestCols,
  guestContactReportCols,
  guestHistoryCols,
  guestLedgerCols,
} from './guest-reports.const';
import { managerFlashReportCols } from './manager-reports.const';
import {
  auditRoomDetailsReportCols,
  auditTaxReportCols,
  mtdAndYtdReportCols,
} from './night-audit-reports.const';
import { historyAndForecastReportCols } from './occupancy-reports.const';
import {
  arrivalReportCols,
  cancellationReportCols,
  departureReportCols,
  draftReservationReportCols,
  employeeWiseReservationReportCols,
  housekeepingReportCols,
  incomeSummaryReportCols,
  noShowReportCols,
  reservationAdrReportCols,
  reservationSummaryReportCols,
} from './reservation-reports.const';
import { cashierReportCols, payTypeReportCols } from './revenue-reports.const';
import { marketSourceReportCols } from './source-reports.const';
import {
  lodgingTaxReportCols,
  monthlyTaxReportCols,
  taxReportCols,
} from './tax-reports.const';

export const reportsConfig: ReportsConfig = {
  RESERVATION_REPORTS: {
    menu: [
      {
        label: 'No Show',
        value: 'noShowReport',
      },
      {
        label: 'Cancellation',
        value: 'cancellationReport',
      },
      {
        label: 'Arrival',
        value: 'arrivalReport',
      },
      {
        label: 'Departure',
        value: 'departureReport',
      },
      {
        label: 'Draft Reservation',
        value: 'draftReservationReport',
      },
      {
        label: 'Employee Wise Reservation',
        value: 'employeeWiseReservation',
      },
      {
        label: 'Reservation ADR',
        value: 'reservationAdrReport',
      },
      {
        label: 'Income Summary',
        value: 'incomeSummaryReport',
      },
      {
        label: 'Reservation Summary',
        value: 'reservationSummaryReport',
      },
      {
        label: 'Housekeeping',
        value: 'housekeepingReport',
      },
    ],
  },
  MANAGER_REPORTS: {
    menu: [
      {
        label: 'Flash Report',
        value: 'managerFlashReport',
      },
    ],
  },
  OCCUPANCY_REPORTS: {
    menu: [
      {
        label: 'History', //In future it will be History & Forecast
        value: 'historyAndForecastReport',
      },
    ],
  },
  REVENUE_REPORTS: {
    menu: [
      {
        label: 'Cashier',
        value: 'cashierReport',
      },
      {
        label: 'Pay Type',
        value: 'payTypeReport',
      },
    ],
  },
  FINANCIAL_REPORTS: {
    menu: [
      {
        label: 'Daily Summary',
        value: 'dailyRevenueReport',
      },
      {
        label: 'Monthly Summary',
        value: 'monthlySummaryReport',
      },
      {
        label: 'Financial Report',
        value: 'financialReport',
      },
      {
        label: 'Close Out Balance Report',
        value: 'closeOutBalance',
      },
      { label: 'Deposit Report', value: 'depositReport' },
      {
        label: 'Posting Audit Report',
        value: 'postingAuditReport',
      },
    ],
  },
  NIGHT_AUDIT_REPORTS: {
    menu: [
      {
        label: 'Room Details',
        value: 'auditRoomDetailsReport',
      },
      {
        label: 'TAX',
        value: 'auditTaxReport',
      },
      {
        label: 'Revenue Report',
        value: 'revenueReport',
      },
      {
        label: 'MTD & YTD Report',
        value: 'mtdAndYtdReport',
      },
    ],
  },
  TAX_REPORTS: {
    menu: [
      {
        label: 'Monthly',
        value: 'monthlyTaxReport',
      },
      {
        label: 'Lodging Tax',
        value: 'lodgingTaxReport',
      },
      {
        label: 'Report',
        value: 'taxReport',
      },
    ],
  },
  GUEST_REPORTS: {
    menu: [
      {
        label: 'Guest History',
        value: 'guestHistory',
      },
      {
        label: 'Sales By Guest',
        value: 'salesByGuest',
      },
      // {
      //   label: 'Guest Type Report',
      //   value: 'guestTypeReport',
      // },
      {
        label: 'Guest Ledger',
        value: 'guestLedger',
      },
      {
        label: 'Guest Contact Report',
        value: 'guestContactReport',
      },
    ],
  },
  ACTIVITY_REPORTS: {
    menu: [
      {
        label: 'Reservation Created',
        value: 'reservationCreatedReport',
      },
      {
        label: 'Reservation Activity',
        value: 'reservationActivityReport',
      },
    ],
  },
  ANALYTICS_REPORTS: {
    menu: [
      {
        label: 'Company Contributions',
        value: 'companyContributionsReport',
      },
      {
        label: 'No Show Summary',
        value: 'noShowSummaryReport',
      },
      {
        label: 'Business Analysis',
        value: 'businessAnalysisReport',
      },
      {
        label: 'Market Segment',
        value: 'marketSegmentReport',
      },
    ],
  },
  DISCOUNT_REPORTS: {
    menu: [
      {
        label: 'Discount Allowance',
        value: 'discountAllowance',
      },
    ],
  },
  DIRECT_BILLING_REPORTS: {
    menu: [
      {
        label: 'Direct Agent Billing',
        value: 'directAgentBillingReport',
      },
      {
        label: 'Direct Company Billing',
        value: 'directCompanyBillingReport',
      },
    ],
  },
  SOURCE_REPORTS: {
    menu: [
      {
        label: 'Market Source',
        value: 'marketSource',
      },
    ],
  },
  FOLIO_REPORTS: {
    menu: [
      {
        label: 'Folio List',
        value: 'folioListReport',
      },
    ],
  },
};

export const reservationReportsMenu: ReportsType['RESERVATION_REPORTS'][] = reportsConfig.RESERVATION_REPORTS.menu.map(
  (item) => item.value
);

export const reportsModelMapping: Record<ReportsTypeValues, ClassType> = {
  noShowReport: NoShowReport,
  arrivalReport: ArrivalReport,
  cancellationReport: CancellationReport,
  departureReport: DepartureReport,
  draftReservationReport: DraftReservationReport,
  employeeWiseReservation: EmployeeWiseReservationReport,
  reservationAdrReport: ReservationAdrReport,
  reservationCreatedReport: ReservationCreatedReport,
  reservationActivityReport: ReservationActivityReport,
  incomeSummaryReport: IncomeSummaryReport,
  reservationSummaryReport: ReservationSummaryReport,
  marketSegmentReport: MarketSegmentReport,
  housekeepingReport: HousekeepingReport,
  cashierReport: CashierReport,
  dailyRevenueReport: DailyRevenueReport,
  historyAndForecastReport: HistoryAndForecastReport,
  managerFlashReport: ManagerFlashReport,
  monthlySummaryReport: MonthlySummaryReport,
  auditRoomDetailsReport: AuditRoomDetailsReport,
  auditTaxReport: AuditTaxReport,
  revenueReport: AuditRoomDetailsReport, //to be decided
  monthlyTaxReport: MonthlyTaxReport,
  lodgingTaxReport: LodgingTaxReport,
  taxReport: TaxReport,
  guestHistory: GuestHistory,
  salesByGuest: SalesByGuest,
  guestTypeReport: AuditRoomDetailsReport, //to be decided
  guestLedger: GuestLedger,
  discountAllowance: DiscountAllowanceReport,
  companyContributionsReport: CompanyContributionsReport, //to be decided
  noShowSummaryReport: NoShowSummaryReport,
  mtdAndYtdReport: MtdAndYtdReport,
  directAgentBillingReport: DirectAgentBillingReport,
  directCompanyBillingReport: DirectCompanyBillingReport,
  marketSource: MarketSourceReport,
  businessAnalysisReport: BusinessAnalysisReport,
  financialReport: FinancialReport, //to be decided
  closeOutBalance: CloseOutBalanceReport,
  depositReport: DepositReport,
  postingAuditReport: PostingAuditReport,
  folioListReport: FolioListReport, //to be decided
  guestContactReport: GuestContactReport, //to be decided
  payTypeReport: PayTypeReport, //to be decided
};

function getColsArray(colsData: ColsData): Cols[] {
  const colsArr: [string, ColsInfo][] = Object.entries(colsData);

  const data = colsArr.map(([key, value]) => ({
    ...value,
    field: key,
  }));

  return data;
}

export const reportsColumnMapping: Record<ReportsTypeValues, Cols[]> = {
  noShowReport: getColsArray(noShowReportCols),
  arrivalReport: getColsArray(arrivalReportCols),
  cancellationReport: getColsArray(cancellationReportCols),
  departureReport: getColsArray(departureReportCols),
  draftReservationReport: getColsArray(draftReservationReportCols),
  employeeWiseReservation: getColsArray(employeeWiseReservationReportCols),
  reservationAdrReport: getColsArray(reservationAdrReportCols),
  reservationCreatedReport: getColsArray(reservationCreatedReportCols),
  reservationActivityReport: getColsArray(reservationActivityReportCols),
  incomeSummaryReport: getColsArray(incomeSummaryReportCols),
  reservationSummaryReport: getColsArray(reservationSummaryReportCols),
  marketSegmentReport: getColsArray(marketSegmentReportCols),
  housekeepingReport: getColsArray(housekeepingReportCols),
  cashierReport: getColsArray(cashierReportCols),
  historyAndForecastReport: getColsArray(historyAndForecastReportCols),
  managerFlashReport: getColsArray(managerFlashReportCols),
  dailyRevenueReport: getColsArray(dailyRevenueReportCols),
  monthlySummaryReport: getColsArray(monthlySummaryReportCols),
  auditRoomDetailsReport: getColsArray(auditRoomDetailsReportCols),
  auditTaxReport: getColsArray(auditTaxReportCols),
  revenueReport: getColsArray(auditTaxReportCols), //to be decided
  monthlyTaxReport: getColsArray(monthlyTaxReportCols),
  lodgingTaxReport: getColsArray(lodgingTaxReportCols),
  taxReport: getColsArray(taxReportCols),
  guestHistory: getColsArray(guestHistoryCols),
  salesByGuest: getColsArray(SalesByGuestCols),
  guestTypeReport: getColsArray({}), //to be decided
  guestLedger: getColsArray(guestLedgerCols),
  discountAllowance: getColsArray(discountAllowanceReportCols),
  companyContributionsReport: getColsArray(companyContributionsReportCols),
  noShowSummaryReport: getColsArray(noShowSummaryReportCols), //to be decided
  mtdAndYtdReport: getColsArray(mtdAndYtdReportCols), //to be decided
  directAgentBillingReport: getColsArray(directAgentBillingReportsCols),
  directCompanyBillingReport: getColsArray(directCompanyBillingReportCols),
  marketSource: getColsArray(marketSourceReportCols),
  businessAnalysisReport: getColsArray(businessAnalysisReportCols),
  financialReport: getColsArray(financialReportCols),
  closeOutBalance: getColsArray(closeOutBalanceCols),
  depositReport: getColsArray(depositReportCols),
  postingAuditReport: getColsArray(postingAuditReportCols),
  folioListReport: getColsArray(folioListReportHeaderCols), //to be decided
  guestContactReport: getColsArray(guestContactReportCols), //to be decided
  payTypeReport: getColsArray(payTypeReportCols), //to be decided
};

export const reportFiltersMapping: Record<
  ReportsTypeValues,
  AvailableFilters[]
> = {
  noShowReport: ['fromDate', 'toDate'],
  arrivalReport: ['fromDate', 'toDate'],
  cancellationReport: ['fromDate', 'toDate'],
  departureReport: ['fromDate', 'toDate'],
  draftReservationReport: ['fromDate', 'toDate'],
  employeeWiseReservation: ['fromDate', 'toDate'],
  reservationAdrReport: ['fromDate', 'toDate'],
  reservationCreatedReport: ['fromDate', 'toDate'],
  reservationActivityReport: ['fromDate', 'toDate'],
  incomeSummaryReport: ['fromDate', 'toDate'],
  reservationSummaryReport: ['fromDate', 'toDate'],
  marketSegmentReport: ['fromDate', 'toDate'],
  housekeepingReport: ['fromDate', 'toDate'],
  cashierReport: ['fromDate', 'toDate'],
  historyAndForecastReport: ['fromDate', 'toDate'],
  managerFlashReport: ['date'],
  dailyRevenueReport: ['fromDate', 'toDate', 'roomType'],
  monthlySummaryReport: ['roomType', 'month'],
  auditRoomDetailsReport: ['fromDate', 'toDate'],
  revenueReport: ['fromDate', 'toDate'],
  auditTaxReport: ['fromDate', 'toDate'],
  monthlyTaxReport: ['fromDate', 'toDate'],
  lodgingTaxReport: ['fromDate', 'toDate'],
  taxReport: ['fromDate', 'toDate'],
  guestHistory: ['fromDate', 'toDate'],
  salesByGuest: ['fromDate', 'toDate'],
  guestTypeReport: ['fromDate', 'toDate'],
  guestLedger: ['fromDate', 'toDate'],
  discountAllowance: ['fromDate', 'toDate'],
  companyContributionsReport: ['fromDate', 'toDate'],
  noShowSummaryReport: ['fromDate', 'toDate'],
  mtdAndYtdReport: ['fromDate', 'toDate'],
  directAgentBillingReport: ['fromDate', 'toDate'], //extra filter to be integrated
  directCompanyBillingReport: ['fromDate', 'toDate'],
  marketSource: ['fromDate', 'toDate'],
  businessAnalysisReport: ['fromDate', 'toDate'],
  financialReport: ['fromDate', 'toDate'],
  closeOutBalance: ['fromDate', 'toDate'],
  depositReport: ['fromDate', 'toDate'],
  postingAuditReport: ['fromDate', 'toDate'],
  folioListReport: ['fromDate', 'toDate'],
  guestContactReport: ['fromDate', 'toDate'],
  payTypeReport: ['fromDate', 'toDate'],
};

export const rowStylesMapping: Record<RowStylesKeys, string> = {
  isBold: 'is-bold',
  isGreyBg: 'is-grey-bg',
  isBlueBg: 'is-babyBlue-bg',
  isBlackBg: 'is-black-bg',
};
