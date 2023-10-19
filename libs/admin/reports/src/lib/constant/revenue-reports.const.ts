import { ColsData } from '../types/reports.types';
import { CashierReportData } from '../types/revenue-reports.types';

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
