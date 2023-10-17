import {
  DailyRevenueReportData,
  FinancialReportData,
  MonthlySummaryReportData,
} from '../types/financial-reports.types';
import { ColsData } from '../types/reports.types';

const financialReportCols: ColsData<FinancialReportData> = {
  emptyCell: {
    header: '',
    isSearchDisabled: true,
    isSortDisabled: true,
  },
};

export const monthlySummaryReportCols: Partial<ColsData<
  MonthlySummaryReportData
>> = {
  day: {
    header: 'Day',
    isSortDisabled: true,
  },
  roomCount: {
    header: 'Room Count',
    isSortDisabled: true,
  },
  occupancy: {
    header: 'OCCUPANCY (%)',
    isSortDisabled: true,
  },
  avgDailyRateIncludeInclusion: {
    header: 'ADR (Incl. Inclusions)',
    isSortDisabled: true,
  },
  avgDailyRateExcludeInclusion: {
    header: 'ADR (Excl. Inclusions)',
    isSortDisabled: true,
  },
  roomRent: {
    header: 'Room Rent',
    isSortDisabled: true,
  },
  roomInclusions: {
    header: 'Room Inclusions',
    isSortDisabled: true,
  },
  totalTaxes: {
    header: 'Total Taxes',
    isSortDisabled: true,
  },
  directSales: {
    header: 'Direct Sales',
    isSortDisabled: true,
  },
  directSaleTax: {
    header: 'Direct Sale Tax',
    isSortDisabled: true,
  },
  grossTotal: {
    header: 'Gross Total',
    isSortDisabled: true,
  },
};

export const dailyRevenueReportCols: Partial<ColsData<
  DailyRevenueReportData
>> = {
  ...financialReportCols,
  gross: {
    header: 'GROSS',
    isSortDisabled: true,
  },
  adj: {
    header: 'ADJ',
    isSortDisabled: true,
  },
  today: {
    header: 'TODAY',
    isSortDisabled: true,
  },
  month: {
    header: 'MONTH',
    isSortDisabled: true,
  },
  year: {
    header: 'YEAR',
    isSortDisabled: true,
  },
};

export const dailyRevenueReportRows = [
  { label: 'Room', name: 'room' },
  { label: 'Room Charge', name: 'roomRevenue' },
  { label: 'Late Check Out', name: 'lateCheckOut' },
  { label: 'Early Check In', name: 'earlyCheckIn' },
  { label: 'Early Check Out', name: 'earlyCheckOut' },
  { label: 'Room Charge(Tax Exempt)', name: 'roomCharge' },
  { label: 'Extra Bed', name: 'extraBed' },
  { label: 'Total', name: 'totalRoom'}, //map total of room
  { label: 'Room others', name: 'roomOthers' },
  { label: 'Cancellation', name: 'cancellation' },
  { label: 'No Show', name: 'noShow' },
  { label: 'Total Others', name: 'totalOthers' },
  { label: 'Add Ons', name: 'addOns' }, //addons header
  { label: 'Add on', name: 'addOn' },
  { label: 'Total Revenue', name: 'totalRevenue' },
  { label: 'payable', name: 'payable' },
  { label: 'CGST', name: 'roomCgstPerDay' },
  { label: 'SGST', name: 'roomSgstPerDay' },
  { label: 'Total Tax', name: 'totalTax' },
  { label: 'Total Payable', name: 'totalPayable' },
];
