import { Cols } from '@hospitality-bot/admin/shared';
import {
  DailyRevenueReport,
  MonthlySummaryReport,
} from '../models/financial-reports.models';
import { GuestHistory, SalesByGuest } from '../models/guest-reports.model';
import { ManagerFlashReport } from '../models/manager-reports.models';
import {
  AuditRoomDetailsReport,
  AuditTaxReport,
} from '../models/night-audit-reports.model';
import { HistoryAndForecastReport } from '../models/occupancy-reports.models';
import {
  ArrivalReport,
  CancellationReport,
  DepartureReport,
  NoShowReport,
} from '../models/reservation-reports.models';
import { CashierReport } from '../models/revenue-reports.models';
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
  dailyRevenueReportCols,
  monthlySummaryReportCols,
} from './financial-reports.const';
import { SalesByGuestCols, guestHistoryCols } from './guest-reports.const';
import { managerFlashReportCols } from './manager-reports.const';
import {
  auditRoomDetailsReportCols,
  auditTaxReportCols,
} from './night-audit-reports.const';
import { historyAndForecastReportCols } from './occupancy-reports.const';
import {
  arrivalReportCols,
  cancellationReportCols,
  departureReportCols,
  noShowReportCols,
} from './reservation-reports.const';
import { cashierReportCols } from './revenue-reports.const';
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
        label: 'History And Forecast',
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
    ],
  },
  TAX_REPORTS: {
    menu: [
      {
        label: 'Monthly',
        value: 'monthlyTaxReport',
      },
      {
        label: 'Lodging Tax Report',
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
      // {
      //   label: 'Guest History',
      //   value: 'guestHistory',
      // },
      {
        label: 'Sales By Guest',
        value: 'salesByGuest',
      },
      // {
      //   label: 'Guest Type Report',
      //   value: 'guestTypeReport',
      // },
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
};

export const reportFiltersMapping: Record<
  ReportsTypeValues,
  AvailableFilters[]
> = {
  noShowReport: ['fromDate', 'toDate'],
  arrivalReport: ['fromDate', 'toDate'],
  cancellationReport: ['fromDate', 'toDate'],
  departureReport: ['fromDate', 'toDate'],
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
};

export const rowStylesMapping: Record<RowStylesKeys, string> = {
  isBold: 'is-bold',
  isGreyBg: 'is-grey-bg',
  isBlueBg: 'is-babyBlue-bg',
  isBlackBg: 'is-black-bg',
};
