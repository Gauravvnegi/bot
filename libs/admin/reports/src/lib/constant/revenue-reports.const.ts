import { ColsData } from '../types/reports.types';
import {
  CashierReportData,
  PayTypeReportData,
} from '../types/revenue-reports.types';

export const cashierReportCols: ColsData<CashierReportData> = {
  index: {
    header: '#',
    isSearchDisabled: false,
    isSortDisabled: true,
  },
  paymentType: {
    header: 'Payment Type',
    isSearchDisabled: false,
    isSortDisabled: true,
  },
  amount: {
    header: 'Amount',
    isSearchDisabled: false,
    isSortDisabled: true,
  },
};

export const payTypeReportCols: Partial<ColsData<PayTypeReportData>> = {
  paymentMode: {
    header: 'Payment Mode',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  paymentType: {
    header: 'Payment Type',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  employee: {
    header: 'Employee',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  bookingNo: {
    header: 'Res',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  folioNo: {
    header: 'Folio No',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  guestName: {
    header: 'Guest Name',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  room: {
    header: 'Room',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  // counter: {
  //   header: 'Counter',
  //   isSortDisabled: true,
  // },
  dateAndTime: {
    header: 'Date & Time',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  amount: {
    header: 'Amount',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  description: {
    header: 'Description',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
};
