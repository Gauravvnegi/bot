import { OrderSummaryReportData } from '../types/order-reports.types';
import { ColsData } from '../types/reports.types';

export const orderSummaryReportCols: ColsData<OrderSummaryReportData> = {
  orderNo: {
    header: '#',
    isSortDisabled: true,
  },
  type: {
    header: 'Type',
    isSortDisabled: true,
  },
  date: {
    header: 'Date',
    isSortDisabled: true,
  },
  areaOrTable: {
    header: 'Area/Table',
    isSortDisabled: true,
  },
  guest: {
    header: 'Guest',
    isSortDisabled: true,
  },
  phoneNumber: {
    header: 'Phone',
    isSortDisabled: true,
  },
  email: {
    header: 'Email',
    isSortDisabled: true,
  },
  totalAmount: {
    header: 'Total',
    isSortDisabled: true,
  },
  paidAmount: {
    header: 'Paid',
    isSortDisabled: true,
  },
  dueAmount: {
    header: 'Due',
    isSortDisabled: true,
  },
};
