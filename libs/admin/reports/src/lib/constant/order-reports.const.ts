import { OrderSummaryReportData } from '../types/order-reports.types';
import { ColsData } from '../types/reports.types';

export const orderSummaryReportCols: ColsData<OrderSummaryReportData> = {
  orderNo: {
    header: '#',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  type: {
    header: 'Type',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  date: {
    header: 'Date',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  areaOrTable: {
    header: 'Area/Table',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  guest: {
    header: 'Guest',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  phoneNumber: {
    header: 'Phone',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  email: {
    header: 'Email',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  totalAmount: {
    header: 'Total',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  paidAmount: {
    header: 'Paid',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  dueAmount: {
    header: 'Due',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
};
