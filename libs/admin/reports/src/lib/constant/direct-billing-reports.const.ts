import {
  DirectAgentBillingReportData,
  DirectCompanyBillingReportData,
} from '../types/direct-billings-reports.types';
import { ColsData } from '../types/reports.types';

export const directAgentBillingReportsCols: ColsData<DirectAgentBillingReportData> = {
  agentCode: {
    header: 'Agent Code',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  agentName: {
    header: 'Agent Name',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  bookingNo: {
    header: 'res. No.',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  guestName: {
    header: 'Guest Name',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  roomType: {
    header: 'Room Type',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  roomNo: {
    header: 'Room No.',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  checkInDate: {
    header: 'Check In',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  checkOutDate: {
    header: 'Check Out',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  totalNights: {
    header: 'Nights',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  pax: {
    header: 'Pax',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  totalAmount: {
    header: 'Total Amount',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  postTaxAmount: {
    header: 'Post Tax Total',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  totalPaidAmount: {
    header: 'Paid Amount',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  totalDueAmount: {
    header: 'Due Amount',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
};

export const directCompanyBillingReportCols: ColsData<DirectCompanyBillingReportData> = {
  companyCode: {
    header: 'Company Code',
    isSortDisabled: true,
    isSearchDisabled: false,

  },
  companyName: {
    header: 'Company Name',
    isSortDisabled: true,
    isSearchDisabled: false,

  },
  bookingNo: {
    header: 'res. No.',
    isSortDisabled: true,
    isSearchDisabled: false,

  },
  guestName: {
    header: 'Guest Name',
    isSortDisabled: true,
    isSearchDisabled: false,

  },
  roomType: {
    header: 'Room Type',
    isSortDisabled: true,
    isSearchDisabled: false,

  },
  roomNo: {
    header: 'Room No.',
    isSortDisabled: true,
    isSearchDisabled: false,

  },
  checkInDate: {
    header: 'Check In',
    isSortDisabled: true,
    isSearchDisabled: false,

  },
  checkOutDate: {
    header: 'Check Out',
    isSortDisabled: true,
    isSearchDisabled: false,

  },
  totalNights: {
    header: 'Nights',
    isSortDisabled: true,
    isSearchDisabled: false,

  },
  pax: {
    header: 'Pax',
    isSortDisabled: true,
    isSearchDisabled: false,

  },
  totalAmount: {
    header: 'Total Amount',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  postTaxAmount: {
    header: 'Post Tax Amount',
    isSortDisabled: true,
    isSearchDisabled: false,
    
  },
  totalPaidAmount: {
    header: 'Paid Amount',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  totalDueAmount: {
    header: 'Due Amount',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
};
