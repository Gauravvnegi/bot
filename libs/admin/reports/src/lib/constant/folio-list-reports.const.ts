import { FolioListReportData } from '../types/folio-reports.types';
import { ColsData } from '../types/reports.types';

export const folioListReportHeaderCols: ColsData<FolioListReportData> = {
  bookingNo: {
    header: 'Res#',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  folioNo: {
    header: 'Folio#',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  guestName: {
    header: 'Guest Name',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  discount: {
    header: 'Discount',
    isSearchDisabled: false,
    isSortDisabled: true,
  },
  amount: {
    header: 'Amount',
    isSearchDisabled: false,
    isSortDisabled: true,
  },
  tax: {
    header: 'Tax',
    isSearchDisabled: false,
    isSortDisabled: true,
  },
  btc: {
    header: 'BTC',
    isSearchDisabled: false,
    isSortDisabled: true,
  },
  cash: {
    header: 'Cash',
    isSearchDisabled: false,
    isSortDisabled: true,
  },
  bankTransfer: {
    header: 'Bank Transfer',
    isSearchDisabled: false,
    isSortDisabled: true,
  },
  payAtDesk: {
    header: 'Pay at Desk',
    isSearchDisabled: false,
    isSortDisabled: true,
  },
  onlinePaymentGateway: {
    header: 'Online Payment Gateway',
    isSearchDisabled: false,
    isSortDisabled: true,
  },
  other: {
    header: 'Other',
    isSearchDisabled: false,
    isSortDisabled: true,
  },
  paid: {
    header: 'Paid',
    isSearchDisabled: false,
    isSortDisabled: true,
  },
  balance: {
    header: 'Balance',
    isSearchDisabled: false,
    isSortDisabled: true,
  },
  date: {
    header: 'Date',
    isSearchDisabled: false,
    isSortDisabled: true,
  },
};
