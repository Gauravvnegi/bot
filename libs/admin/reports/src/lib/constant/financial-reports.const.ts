import {
  AdvanceDepositPaymentReportData,
  CloseOutBalanceData,
  DailyRevenueReportData,
  DepositReportData,
  FinancialReportData,
  MonthlySummaryReportData,
  PostingAuditReportData,
  RevParRoomReportData,
} from '../types/financial-reports.types';
import { ColsData } from '../types/reports.types';

export const financialReportCols: ColsData<FinancialReportData> = {
  bookingNo: {
    header: 'Res#',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  folioNo: {
    header: 'Folio#',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  nights: {
    header: 'Nights',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  lodging: {
    header: 'Lodging',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  lodgingTax: {
    header: 'Lodging Tax',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  discount: {
    header: 'Discount',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  otherCharges: {
    header: 'Other Charges',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  otherChargesTax: {
    header: 'Other Charges Tax',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  otherChargesDiscount: {
    header: 'Other Charges Discount',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  postTaxTotal: {
    header: 'Post Tax Total',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  paid: {
    header: 'Paid',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  balance: {
    header: 'Balance',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
};

export const advanceDepositPaymentCols: ColsData<Omit<
  AdvanceDepositPaymentReportData,
  'reservationId'
>> = {
  bookingNo: {
    header: 'Res#',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  // groupreservationId: {
  //   header: 'Group Id',
  //   isSortDisabled: true,
  // },
  checkIn: {
    header: 'Check In',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  checkOut: {
    header: 'Check Out',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  advancedDepositDate: {
    header: 'Advanced Deposit Date',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  paymentMode: {
    header: 'Payment Mode',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  // paymentType: {
  //   header: 'Payment Type',
  //   isSortDisabled: true,
  // },
  advancedDepositAmount: {
    header: 'Advanced Deposit Amount',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
};

export const revParReportCols: ColsData<RevParRoomReportData> = {
  totalRoomInventory: {
    header: 'Total Room Inventory',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  revParIncludeInclusion: {
    header: 'RevPAR (Incl. Inclusions)',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  revParExcludeInclusion: {
    header: 'RevPAR (Excl. Inclusions)',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  totalRoomRent: {
    header: 'Total Room Rent',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  totalRoomInclusions: {
    header: 'Total Room Inclusions',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  totalTaxes: {
    header: 'Total Taxes',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  // totalOtherCharges: {
  //   header: 'Total Other Charges',
  //   isSortDisabled: true,
  // },
  // totalOtherTaxes: {
  //   header: 'Total Other Taxes',
  //   isSortDisabled: true,
  // },
  grossTotal: {
    header: 'Gross Total',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
};

export const closeOutBalanceCols: ColsData<CloseOutBalanceData> = {
  bookingNo: {
    header: 'Res#',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  folioNo: {
    header: 'Folio#',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  checkOut: {
    header: 'Check Out',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  guestName: {
    header: 'Guest Name',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  lodgingAndTax: {
    header: 'Lodging & Tax',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  otherChargesAndTax: {
    header: 'Other Charges & Tax',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  amount: {
    header: 'Amount',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  collected: {
    header: 'Collected',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  openBalance: {
    header: 'Open Balance',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
};

export const depositReportCols: ColsData<DepositReportData> = {
  bookingNo: {
    header: 'Res#',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  guestName: {
    header: 'Guest Name',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  checkIn: {
    header: 'Check In',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  checkOut: {
    header: 'Check Out',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  nights: {
    header: 'Nights',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  lodging: {
    header: 'Lodging',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  otherCharges: {
    header: 'Other Charges',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  taxes: {
    header: 'Taxes',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  btc: {
    header: 'BTC',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  cash: {
    header: 'Cash',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  bankTransfer: {
    header: 'Bank Transfer',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  payAtDesk: {
    header: 'Pay At Desk',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  onlinePaymentGateway: {
    header: 'Online Payment Gateway',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  totalPaid: {
    header: 'Total Paid',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  lastDepositDate: {
    header: 'Last Deposit Date',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
};

export const postingAuditReportCols: ColsData<PostingAuditReportData> = {
  room: {
    header: 'Room',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  name: {
    header: 'Name',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  user: {
    header: 'User',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  trxAmount: {
    header: 'Trx Amount',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  baseAmount: {
    header: 'Base Amount',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  cgst: {
    header: 'CGST',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  sgst: {
    header: 'SGST',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
};

export const monthlySummaryReportCols: Partial<ColsData<
  MonthlySummaryReportData
>> = {
  day: {
    header: 'Day',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  roomCount: {
    header: 'Room Count',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  occupancy: {
    header: 'OCCUPANCY (%)',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  avgDailyRateIncludeInclusion: {
    header: 'ADR (Incl. Inclusions)',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  avgDailyRateExcludeInclusion: {
    header: 'ADR (Excl. Inclusions)',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  roomRent: {
    header: 'Room Rent',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  roomInclusions: {
    header: 'Room Inclusions',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  totalTaxes: {
    header: 'Total Taxes',
    isSortDisabled: true,
    isSearchDisabled: false,
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
    isSearchDisabled: false,
  },
};

export const dailyRevenueReportCols: Partial<ColsData<
  DailyRevenueReportData
>> = {
  emptyCell: {
    header: '',
    isSearchDisabled: false,
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
    isSearchDisabled: false,
  },
  month: {
    header: 'MONTH',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  year: {
    header: 'YEAR',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
};

export const dailyRevenueReportRows = [
  { label: 'Room', name: 'room' },
  { label: 'Room Charge', name: 'roomRevenue' },
  { label: 'Late Check Out', name: 'lateCheckOutAmount' },
  { label: 'Early Check In', name: 'earlyCheckInAmount' },
  // { label: 'Early Check Out', name: 'earlyCheckOutAmount' },
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
