import {
  DirectAgentBillingReportData,
  DirectCompanyBillingReportData,
} from '../types/direct-billings-reports.types';
import { ColsData } from '../types/reports.types';

export const directAgentBillingReportsCols: ColsData<DirectAgentBillingReportData> = {
  agentCode: {
    header: 'Agent Code',
    isSortDisabled: true,
  },
  agentName: {
    header: 'Agent Name',
    isSortDisabled: true,
  },
  bookingNo: {
    header: 'res. No.',
    isSortDisabled: true,
  },
  guestName: {
    header: 'Guest Name',
    isSortDisabled: true,
  },
  roomType: {
    header: 'Room Type',
    isSortDisabled: true,
  },
  roomNo: {
    header: 'Room No.',
    isSortDisabled: true,
  },
  checkInDate: {
    header: 'Check In',
    isSortDisabled: true,
  },
  checkOutDate: {
    header: 'Check Out',
    isSortDisabled: true,
  },
  totalNights: {
    header: 'Nights',
    isSortDisabled: true,
  },
  pax: {
    header: 'Pax',
    isSortDisabled: true,
  },
  totalAmount: {
    header: 'Total Amount',
    isSortDisabled: true,
  },
  postTaxAmount: {
    header: 'Post Tax Total',
    isSortDisabled: true,
  },
  totalPaidAmount: {
    header: 'Paid Amount',
    isSortDisabled: true,
  },
  totalDueAmount: {
    header: 'Due Amount',
    isSortDisabled: true,
  },
};

export const directCompanyBillingReportCols: ColsData<DirectCompanyBillingReportData> = {
  companyCode: {
    header: 'Company Code',
    isSortDisabled: true,
  },
  companyName: {
    header: 'Company Name',
    isSortDisabled: true,
  },
  bookingNo: {
    header: 'res. No.',
    isSortDisabled: true,
  },
  guestName: {
    header: 'Guest Name',
    isSortDisabled: true,
  },
  roomType: {
    header: 'Room Type',
    isSortDisabled: true,
  },
  roomNo: {
    header: 'Room No.',
    isSortDisabled: true,
  },
  checkInDate: {
    header: 'Check In',
    isSortDisabled: true,
  },
  checkOutDate: {
    header: 'Check Out',
    isSortDisabled: true,
  },
  totalNights: {
    header: 'Nights',
    isSortDisabled: true,
  },
  pax: {
    header: 'Pax',
    isSortDisabled: true,
  },
  totalAmount: {
    header: 'Total Amount',
    isSortDisabled: true,
  },
  postTaxAmount: {
    header: 'Post Tax Amount',
    isSortDisabled: true,
  },
  totalPaidAmount: {
    header: 'Paid Amount',
    isSortDisabled: true,
  },
  totalDueAmount: {
    header: 'Due Amount',
    isSortDisabled: true,
  },
};
