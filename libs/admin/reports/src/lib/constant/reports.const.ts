import { Cols } from '@hospitality-bot/admin/shared';
import {
  DailyRevenueReport,
  MonthlySummaryReport,
} from '../models/financial-reports.models';
import { ManagerFlashReport } from '../models/manager-reports.models';
import { HistoryAndForecastReport } from '../models/occupancy-reports.models';
import {
  ArrivalReport,
  CancellationReport,
  DepartureReport,
  NoShowReport,
} from '../models/reservation-reports.models';
import { CashierReport } from '../models/revenue-reports.models';
import {
  AvailableFilters,
  ClassType,
  ColsData,
  ColsInfo,
  ReportsConfig,
  ReportsTypeValues,
  RowStylesKeys,
} from '../types/reports.types';
import {
  arrivalReportCols,
  cancellationReportCols,
  departureReportCols,
  noShowReportCols,
} from './reservation-reports.const';
import {
  dailyRevenueReportCols,
  monthlySummaryReportCols,
} from './financial-reports.const';
import { cashierReportCols } from './revenue-reports.const';
import { historyAndForecastReportCols } from './occupancy-reports.const';
import { managerFlashReportCols } from './manager-reports.const';

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
};

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
};

export const reportFiltersMapping: Record<
         ReportsTypeValues,
         AvailableFilters[]
       > = {
         noShowReport: ['fromDate', 'toDate'],
         arrivalReport: ['fromDate', 'toDate', 'roomType'],
         cancellationReport: ['fromDate', 'toDate', 'roomType'],
         departureReport: ['fromDate', 'toDate', 'roomType'],
         cashierReport: ['fromDate', 'toDate', 'roomType'],
         historyAndForecastReport: ['fromDate', 'toDate', 'roomType'],
         managerFlashReport: ['fromDate', 'toDate', 'roomType'],
         dailyRevenueReport: ['fromDate', 'toDate', 'roomType'],
         monthlySummaryReport: ['roomType', 'month'],
       };

export const rowStylesMapping: Record<RowStylesKeys, string> = {
  isBold: 'is-bold',
  isGreyBg: 'is-grey-bg',
  isBlueBg: 'is-babyBlue-bg',
};
