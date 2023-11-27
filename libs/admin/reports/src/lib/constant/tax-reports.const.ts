import { ColsData } from '../types/reports.types';
import {
  LodgingTaxReportData,
  MonthlyTaxReportData,
  TaxReportData,
} from '../types/tax-reports.types';

export const monthlyTaxReportCols: ColsData<MonthlyTaxReportData> = {
  taxName: {
    header: 'Tax Name',
    isSortDisabled: true,
    isSearchDisabled: true,
  },

  taxCategory: {
    header: 'Tax Category',
    isSortDisabled: true,
    isSearchDisabled: true,
  },

  amount: {
    header: 'Amount',
    isSortDisabled: true,
    isSearchDisabled: true,
  },
};

export const lodgingTaxReportCols: ColsData<LodgingTaxReportData> = {
  res: {
    header: 'Res#',
    isSortDisabled: true,
    isSearchDisabled: true,
  },
  guestName: {
    header: 'Guest Name',
    isSortDisabled: true,
    isSearchDisabled: true,
  },
  checkInDate: {
    header: 'Check In',
    isSortDisabled: true,
    isSearchDisabled: true,
  },
  checkOutDate: {
    header: 'Check Out',
    isSortDisabled: true,
    isSearchDisabled: true,
  },
  roomType: {
    header: 'Room Type',
    isSortDisabled: true,
    isSearchDisabled: true,
  },
  rate: {
    header: 'Rate',
    isSortDisabled: true,
    isSearchDisabled: true,
  },
  discounts: {
    header: 'Discounts',
    isSortDisabled: true,
    isSearchDisabled: true,
  },
  netRate: {
    header: 'Net Rate',
    isSortDisabled: true,
    isSearchDisabled: true,
  },
  occupancyTax: {
    header: 'Occupancy Tax',
    isSortDisabled: true,
    isSearchDisabled: true,
  },
  otherTax: {
    header: 'Other Tax',
    isSortDisabled: true,
    isSearchDisabled: true,
  },
};

export const monthlyTaxReportRows = [
  {
    label: 'CGST',
    taxName: 'cgst',
    taxCategory: 'Room',
    amount: 'amount',
  },
  {
    label: 'SGST',
    taxName: 'sgst',
    taxCategory: 'Room',
    amount: 'amount',
  },
];

export const taxReportCols: ColsData<TaxReportData> = {
  res: {
    header: 'Res#',
    isSortDisabled: true,
    isSearchDisabled: true,
  },
  checkInDate: {
    header: 'Check In',
    isSortDisabled: true,
    isSearchDisabled: true,
  },
  checkOutDate: {
    header: 'Check Out',
    isSortDisabled: true,
    isSearchDisabled: true,
  },
  roomCharge: {
    header: 'Room Charge',
    isSortDisabled: true,
    isSearchDisabled: true,
  },
  otherCharge: {
    header: 'Other Charge',
    isSortDisabled: true,
    isSearchDisabled: true,
  },
  cgst: {
    header: 'CGST',
    isSortDisabled: true,
    isSearchDisabled: true,
  },
  sgst: {
    header: 'SGST',
    isSortDisabled: true,
    isSearchDisabled: true,
  },
  postTaxTotal: {
    header: 'Post Tax Total',
    isSortDisabled: true,
    isSearchDisabled: true,
  },
};
