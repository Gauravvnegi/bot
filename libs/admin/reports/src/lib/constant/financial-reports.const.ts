import {
  CloseOutBalanceData,
  DailyRevenueReportData,
  DepositReportData,
  FinancialReportData,
  MonthlySummaryReportData,
  PostingAuditReportData,
} from '../types/financial-reports.types';
import { ColsData } from '../types/reports.types';

export const financialReportCols: ColsData<FinancialReportData> = {
  bookingNo: {
    header: 'Res#',
    isSortDisabled: true,
  },
  folioNo: {
    header: 'Folio#',
    isSortDisabled: true,
  },
  nights: {
    header: 'Nights',
    isSortDisabled: true,
  },
  lodging: {
    header: 'Lodging',
    isSortDisabled: true,
  },
  lodgingTax: {
    header: 'Lodging Tax',
    isSortDisabled: true,
  },
  discount: {
    header: 'Discount',
    isSortDisabled: true,
  },
  otherCharges: {
    header: 'Other Charges',
    isSortDisabled: true,
  },
  otherChargesTax: {
    header: 'Other Charges Tax',
    isSortDisabled: true,
  },
  otherChargesDiscount: {
    header: 'Other Charges Discount',
    isSortDisabled: true,
  },
  postTaxTotal: {
    header: 'Post Tax Total',
    isSortDisabled: true,
  },
  paid: {
    header: 'Paid',
    isSortDisabled: true,
  },
  balance: {
    header: 'Balance',
    isSortDisabled: true,
  },
};

export const closeOutBalanceCols: ColsData<CloseOutBalanceData> = {
  bookingNo: {
    header: 'Res#',
    isSortDisabled: true,
  },
  folioNo: {
    header: 'Folio#',
    isSortDisabled: true,
  },
  checkOut: {
    header: 'Check Out',
    isSortDisabled: true,
  },
  guestName: {
    header: 'Guest Name',
    isSortDisabled: true,
  },
  lodgingAndTax: {
    header: 'Lodging & Tax',
    isSortDisabled: true,
  },
  otherChargesAndTax: {
    header: 'Other Charges & Tax',
    isSortDisabled: true,
  },
  amount: {
    header: 'Amount',
    isSortDisabled: true,
  },
  collected: {
    header: 'Collected',
    isSortDisabled: true,
  },
  openBalance: {
    header: 'Open Balance',
    isSortDisabled: true,
  },
};

export const depositReportCols: ColsData<DepositReportData> = {
  bookingNo: {
    header: 'Res#',
    isSortDisabled: true,
  },
  guestName: {
    header: 'Guest Name',
    isSortDisabled: true,
  },
  checkIn: {
    header: 'Check In',
    isSortDisabled: true,
  },
  checkOut: {
    header: 'Check Out',
    isSortDisabled: true,
  },
  nights: {
    header: 'Nights',
    isSortDisabled: true,
  },
  lodging: {
    header: 'Lodging',
    isSortDisabled: true,
  },
  otherCharges: {
    header: 'Other Charges',
    isSortDisabled: true,
  },
  taxes: {
    header: 'Taxes',
    isSortDisabled: true,
  },
  btc: {
    header: 'BTC',
    isSortDisabled: true,
  },
  cash: {
    header: 'Cash',
    isSortDisabled: true,
  },
  bankTransfer: {
    header: 'Bank Transfer',
    isSortDisabled: true,
  },
  payAtDesk: {
    header: 'Pay At Desk',
    isSortDisabled: true,
  },
  onlinePaymentGateway: {
    header: 'Online Payment Gateway',
    isSortDisabled: true,
  },
  totalPaid: {
    header: 'Total Paid',
    isSortDisabled: true,
  },
  lastDepositDate: {
    header: 'Last Deposit Date',
    isSortDisabled: true,
  },
};

export const postingAuditReportCols: ColsData<PostingAuditReportData> = {
  room: {
    header: 'Room',
    isSortDisabled: true,
  },
  name: {
    header: 'Name',
    isSortDisabled: true,
  },
  user: {
    header: 'User',
    isSortDisabled: true,
  },
  trxAmount: {
    header: 'Trx Amount',
    isSortDisabled: true,
  },
  baseAmount: {
    header: 'Base Amount',
    isSortDisabled: true,
  },
  cgst: {
    header: 'CGST',
    isSortDisabled: true,
  },
  sgst: {
    header: 'SGST',
    isSortDisabled: true,
  },
};

export const monthlySummaryReportCols: Partial<ColsData<
  MonthlySummaryReportData
>> = {
  day: {
    header: 'Day',
    isSortDisabled: true,
  },
  roomCount: {
    header: 'Room Count',
    isSortDisabled: true,
  },
  occupancy: {
    header: 'OCCUPANCY (%)',
    isSortDisabled: true,
  },
  avgDailyRateIncludeInclusion: {
    header: 'ADR (Incl. Inclusions)',
    isSortDisabled: true,
  },
  avgDailyRateExcludeInclusion: {
    header: 'ADR (Excl. Inclusions)',
    isSortDisabled: true,
  },
  roomRent: {
    header: 'Room Rent',
    isSortDisabled: true,
  },
  roomInclusions: {
    header: 'Room Inclusions',
    isSortDisabled: true,
  },
  totalTaxes: {
    header: 'Total Taxes',
    isSortDisabled: true,
  },
  // directSales: {
  //   header: 'Direct Sales',         //to be added in future
  //   isSortDisabled: true,
  // },
  // directSaleTax: {
  //   header: 'Direct Sale Tax',
  //   isSortDisabled: true,
  // },
  grossTotal: {
    header: 'Gross Total',
    isSortDisabled: true,
  },
};

export const dailyRevenueReportCols: Partial<ColsData<
  DailyRevenueReportData
>> = {
  emptyCell: {
    header: '',
    isSearchDisabled: true,
    isSortDisabled: true,
  },
  // gross: {
  //   header: 'GROSS',
  //   isSortDisabled: true,
  //   isSearchDisabled: true,
  // },
  // adj: {
  //   header: 'ADJ',
  //   isSortDisabled: true,
  //   isSearchDisabled: true,
  // },
  today: {
    header: 'TODAY',
    isSortDisabled: true,
    isSearchDisabled: true,
  },
  month: {
    header: 'MONTH',
    isSortDisabled: true,
    isSearchDisabled: true,
  },
  year: {
    header: 'YEAR',
    isSortDisabled: true,
    isSearchDisabled: true,
  },
};

export const dailyRevenueReportRows = [
  { label: 'Room', name: 'room' },
  { label: 'Room Charge', name: 'roomRevenue' },
  { label: 'Late Check Out', name: 'lateCheckOut' },
  { label: 'Early Check In', name: 'earlyCheckIn' },
  { label: 'Early Check Out', name: 'earlyCheckOut' },
  // { label: 'Room Charge(Tax Exempt)', name: 'roomCharge' },
  // { label: 'Extra Bed', name: 'extraBed' },
  { label: 'Total', name: 'totalRoom' }, //map total of room
  // { label: 'Room others', name: 'roomOthers' },
  // { label: 'Cancellation', name: 'cancellation' },
  // { label: 'No Show', name: 'noShow' },
  // { label: 'Total Others', name: 'totalOthers' },
  { label: 'Add Ons', name: 'addOns' }, //addons header
  { label: 'Add on', name: 'inclusionOrAddOn' },
  { label: 'Total Revenue', name: 'totalRevenue' },
  { label: 'Payable', name: 'payable' },
  { label: 'CGST', name: 'roomCgstPerDay' },
  { label: 'SGST', name: 'roomSgstPerDay' },
  { label: 'Total Tax', name: 'totalTax' },
  { label: 'Total Payable', name: 'totalPayable' },
];
