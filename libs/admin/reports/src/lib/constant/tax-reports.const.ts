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
    isSearchDisabled: false,
  },

  taxCategory: {
    header: 'Tax Category',
    isSortDisabled: true,
    isSearchDisabled: false,
  },

  amount: {
    header: 'Amount',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
};

export const lodgingTaxReportCols: ColsData<LodgingTaxReportData> = {
  res: {
    header: 'Res#',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  guestName: {
    header: 'Guest Name',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  checkInDate: {
    header: 'Check In',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  checkOutDate: {
    header: 'Check Out',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  roomType: {
    header: 'Room Type',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  rate: {
    header: 'Rate',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  discounts: {
    header: 'Discounts',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  netRate: {
    header: 'Net Rate',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  occupancyTax: {
    header: 'Occupancy Tax',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  otherTax: {
    header: 'Other Tax',
    isSortDisabled: true,
    isSearchDisabled: false,
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
    isSearchDisabled: false,
  },
  checkInDate: {
    header: 'Check In',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  checkOutDate: {
    header: 'Check Out',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  roomCharge: {
    header: 'Room Charge',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  otherCharge: {
    header: 'Other Charge',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  cgst: {
    header: 'CGST',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  sgst: {
    header: 'SGST',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  postTaxTotal: {
    header: 'Post Tax Total',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
};
