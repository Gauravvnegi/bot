import { FolioListReportData } from '../types/folio-reports.types';
import { ColsData } from '../types/reports.types';

export const folioListReportHeaderCols: ColsData<FolioListReportData> = {
  bookingNo: {
    header: 'Res#',
    isSearchDisabled: true,
  },
  folioNo: {
    header: 'Folio#',
    isSearchDisabled: true,
  },
  guestName: {
    header: 'Guest Name',
    isSearchDisabled: true,
  },
  discount: {
    header: 'Discount',
    isSearchDisabled: true,
  },
  amount: {
    header: 'Amount',
    isSearchDisabled: true,
  },
  tax: {
    header: 'Tax',
    isSearchDisabled: true,
  },
  btc: {
    header: 'BTC',
    isSearchDisabled: true,
  },
  cash: {
    header: 'Cash',
    isSearchDisabled: true,
  },
  bankTransfer: {
    header: 'Bank Transfer',
    isSearchDisabled: true,
  },
  payAtDesk: {
    header: 'Pay at Desk',
    isSearchDisabled: true,
  },
  onlinePaymentGateway: {
    header: 'Online Payment Gateway',
    isSearchDisabled: true,
  },
  other: {
    header: 'Other',
    isSearchDisabled: true,
  },
  paid: {
    header: 'Paid',
    isSearchDisabled: true,
  },
  balance: {
    header: 'Balance',
    isSearchDisabled: true,
  },
  date: {
    header: 'Date',
    isSearchDisabled: true,
  },
};
