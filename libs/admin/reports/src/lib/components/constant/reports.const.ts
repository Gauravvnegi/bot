import { ReportsConfig } from '../../types/reports.type';

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
