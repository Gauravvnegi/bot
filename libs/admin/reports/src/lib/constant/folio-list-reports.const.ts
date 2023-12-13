import { FolioListReportData } from '../types/folio-reports.types';
import { ColsData } from '../types/reports.types';

export const folioListReportHeaderCols: ColsData<FolioListReportData> = {
  bookingNo: {
    header: 'Res#',
    isSortDisabled: true,
  },
  folioNo: {
    header: 'Folio#',
    isSortDisabled: true,
  },
  guestName: {
    header: 'Guest Name',
    isSortDisabled: true,
  },
  discount: {
    header: 'Discount',
    isSearchDisabled: true,
    isSortDisabled: true,
  },
  amount: {
    header: 'Amount',
    isSearchDisabled: true,
    isSortDisabled: true,
  },
  tax: {
    header: 'Tax',
    isSearchDisabled: true,
    isSortDisabled: true,
  },
  btc: {
    header: 'BTC',
    isSearchDisabled: true,
    isSortDisabled: true,
  },
  cash: {
    header: 'Cash',
    isSearchDisabled: true,
    isSortDisabled: true,
  },
  bankTransfer: {
    header: 'Bank Transfer',
    isSearchDisabled: true,
    isSortDisabled: true,
  },
  payAtDesk: {
    header: 'Pay at Desk',
    isSearchDisabled: true,
    isSortDisabled: true,
  },
  onlinePaymentGateway: {
    header: 'Online Payment Gateway',
    isSearchDisabled: true,
    isSortDisabled: true,
  },
  other: {
    header: 'Other',
    isSearchDisabled: true,
    isSortDisabled: true,
  },
  paid: {
    header: 'Paid',
    isSearchDisabled: true,
    isSortDisabled: true,
  },
  balance: {
    header: 'Balance',
    isSearchDisabled: true,
    isSortDisabled: true,
  },
  date: {
    header: 'Date',
    isSearchDisabled: true,
    isSortDisabled: true,
  },
};
