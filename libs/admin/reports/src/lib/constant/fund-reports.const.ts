import { AddWithdrawReportData } from '../types/fund-reports.types';
import { ColsData } from '../types/reports.types';

export const addWithdrawReportCols: ColsData<AddWithdrawReportData> = {
  createdDate: {
    header: 'Created Date',
    isSortDisabled: true,
  },
  fundTransferredBy: {
    header: 'Fund Transferred By',
    isSortDisabled: true,
  },
  action: {
    header: 'Action',
    isSortDisabled: true,
  },
  amount: {
    header: 'Amount',
    isSortDisabled: true,
  },
  paymentMode: {
    header: 'Payment Type',
    isSortDisabled: true,
  },
  comments: {
    header: 'Comments',
    isSortDisabled: true,
  },
};
