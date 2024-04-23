import { AddWithdrawReportData } from '../types/fund-reports.types';
import { ColsData } from '../types/reports.types';

export const addWithdrawReportCols: ColsData<AddWithdrawReportData> = {
  createdDate: {
    header: 'Created Date',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  fundTransferredBy: {
    header: 'Fund Transferred By',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  action: {
    header: 'Action',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  amount: {
    header: 'Amount',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  paymentMode: {
    header: 'Payment Type',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  comments: {
    header: 'Comments',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
};
