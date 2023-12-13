import { ColsData } from '../types/reports.types';
import {
  CashierReportData,
  PayTypeReportData,
} from '../types/revenue-reports.types';

export const cashierReportCols: ColsData<CashierReportData> = {
  id: {
    header: '#',
    isSearchDisabled: true,
    isSortDisabled: true,
  },
  paymentType: {
    header: 'Payment Type',
    isSearchDisabled: true,
    isSortDisabled: true,
  },
  amount: {
    header: 'Amount',
    isSearchDisabled: true,
    isSortDisabled: true,
  },
};

export const payTypeReportCols: Partial<ColsData<PayTypeReportData>> = {
         paymentMode: {
           header: 'Payment Mode',
           isSortDisabled: true,
         },
         paymentType: {
           header: 'Payment Type',
           isSortDisabled: true,
         },
         employee: {
           header: 'Employee',
           isSortDisabled: true,
         },
         bookingNo: {
           header: 'Res',
           isSortDisabled: true,
         },
         folioNo: {
           header: 'Folio No',
           isSortDisabled: true,
         },
         guestName: {
           header: 'Guest Name',
           isSortDisabled: true,
         },
         room: {
           header: 'Room',
           isSortDisabled: true,
         },
         // counter: {
         //   header: 'Counter',
         //   isSortDisabled: true,
         // },
         dateAndTime: {
           header: 'Date & Time',
           isSortDisabled: true,
         },
         amount: {
           header: 'Amount',
           isSortDisabled: true,
           isSearchDisabled: true,
         },
         description: {
           header: 'Description',
           isSortDisabled: true,
         },
       };
