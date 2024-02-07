import { ColsData } from '../types/reports.types';
import {
  AddOnRequestReportData,
  ArrivalReportData,
  CancellationReportPartialData,
  DepartureReportData,
  DraftReservationReportData,
  EmployeeWiseReservationReportData,
  ExpressCheckInData,
  HousekeepingReportData,
  IncomeSummaryReportData,
  NoShowReportData,
  ReservationAdrReportData,
  ReservationReportData,
  ReservationSummaryReportData,
} from '../types/reservation-reports.types';

const reservationReportCols: ColsData<Omit<ReservationReportData, 'id'>> = {
  bookingNo: {
    header: 'Res/Group',
    isSortDisabled: true,
  },
  guestName: {
    header: 'Guest Name',
    isSortDisabled: true,
  },
  otherCharges: {
    header: 'Other Charges',
    isSortDisabled: true,
  },
  amountPaid: {
    header: 'Amount Paid',
    isSortDisabled: true,
  },
  balance: {
    header: 'Balance',
    isSortDisabled: true,
  },
  bookingAmount: {
    header: 'Booking Amount',
    isSortDisabled: true,
  },
};

export const noShowReportCols: ColsData<NoShowReportData> = {
  bookingNumber: reservationReportCols.bookingNo,
  dateOfArrival: {
    header: 'Date of Arrival',
    isSortDisabled: true,
  },
  noShowOn: {
    header: 'No-Show On',
    isSortDisabled: true,
  },
  guestName: {
    header: 'Guest Name',
    isSortDisabled: true,
  },
  bookingAmount: reservationReportCols.bookingAmount,
  noShowCharge: {
    header: 'No Show Charge',
    isSortDisabled: true,
    isSearchDisabled: true,
  },
  noShowReason: {
    header: 'No Show Reason',
    isSortDisabled: true,
  },
  otherCharge: reservationReportCols.otherCharges,
  amountPaid: reservationReportCols.amountPaid,
  balance: reservationReportCols.balance,
};

export const cancellationReportCols: ColsData<CancellationReportPartialData> = {
  bookingNumber: reservationReportCols.bookingNo,
  guestName: noShowReportCols.guestName,
  roomType: {
    header: 'Room/Type',
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
  night: {
    header: 'Nights',
    isSortDisabled: true,
  },
  cancelledOn: {
    header: 'Cancelled On',
    isSortDisabled: true,
  },
  bookingAmount: reservationReportCols.bookingAmount,
  cancellationCharge: {
    header: 'Cancellation Charge',
    isSortDisabled: true,
  },
  cancellationReason: {
    header: 'Cancellation Reason',
    isSortDisabled: true,
  },
  otherCharge: reservationReportCols.otherCharges,
  amountPaid: reservationReportCols.amountPaid,
  balance: reservationReportCols.balance,
};

export const arrivalReportCols: ColsData<ArrivalReportData> = {
  bookingNo: { ...reservationReportCols.bookingNo },
  guestName: { ...reservationReportCols.guestName },
  roomType: {
    header: 'Room/Type',
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
  bookingAmount: { ...reservationReportCols.bookingAmount },
  status: {
    header: 'Status',
    isSortDisabled: true,
  },
  remark: {
    header: 'Remarks',
    isSortDisabled: true,
  },
  arrivalTime: {
    header: 'Arrival Time',
    isSortDisabled: true,
  },
};
const { arrivalTime, ...rest } = arrivalReportCols;

export const departureReportCols: ColsData<DepartureReportData> = {
  ...rest,
  departureTime: {
    header: 'Departure Time',
    isSortDisabled: true,
  },
};

export const draftReservationReportCols: ColsData<Omit<
  DraftReservationReportData,
  'id'
>> = {
  bookingNo: reservationReportCols.bookingNo,
  guestName: reservationReportCols.guestName,
  roomType: {
    header: 'Room/Type',
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
  tempReservedNumber: {
    header: 'Temp Reserved No.',
    isSortDisabled: true,
  },
  bookingAmount: reservationReportCols.bookingAmount,
  paidAmount: reservationReportCols.amountPaid,
  balance: reservationReportCols.balance,
  status: {
    header: 'Status',
    isSortDisabled: true,
  },
};

export const employeeWiseReservationReportCols: ColsData<Omit<
  EmployeeWiseReservationReportData,
  'id'
>> = {
  userName: {
    header: 'User Name',
    isSortDisabled: true,
  },
  bookingNo: reservationReportCols.bookingNo,
  guestName: reservationReportCols.guestName,
  checkIn: arrivalReportCols.checkIn,
  checkOut: arrivalReportCols.checkOut,
  nights: {
    header: 'Nights',
    isSortDisabled: true,
  },
  roomCharge: {
    header: 'Room Charge',
    isSortDisabled: true,
    isSearchDisabled: true,
  },
  tax: {
    header: 'Tax',
    isSortDisabled: true,
    isSearchDisabled: true,
  },
  otherCharges: {
    header: 'Other Charges',
    isSortDisabled: true,
    isSearchDisabled: true,
  },
  totalCharge: {
    header: 'Total Charge',
    isSortDisabled: true,
    isSearchDisabled: true,
  },
  amountPaid: reservationReportCols.amountPaid,
};

export const reservationAdrReportCols: ColsData<Omit<
  ReservationAdrReportData,
  'id'
>> = {
  bookingNo: reservationReportCols.bookingNo,
  guestName: reservationReportCols.guestName,
  roomType: {
    header: 'Room Type',
    isSortDisabled: true,
  },
  roomNo: {
    header: 'Room No.',
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
  roomRent: {
    header: 'Room Rent',
    isSortDisabled: true,
  },
  adr: {
    header: 'ADR',
    isSortDisabled: true,
    isSearchDisabled: true,
  },
};

export const incomeSummaryReportCols: ColsData<Omit<
  IncomeSummaryReportData,
  'id'
>> = {
  bookingNo: reservationReportCols.bookingNo,
  guestName: reservationReportCols.guestName,
  checkIn: arrivalReportCols.checkIn,
  checkOut: arrivalReportCols.checkOut,
  nights: {
    header: 'Nights',
    isSortDisabled: true,
  },
  lodgingAndOtherCharges: {
    header: 'Lodging & Other Charges',
    isSortDisabled: true,
    isSearchDisabled: true,
  },
  taxTotal: {
    header: 'Post Tax Total',
    isSortDisabled: true,
    isSearchDisabled: true,
  },
  paidAmount: {
    header: 'Total Paid',
    isSortDisabled: true,
    isSearchDisabled: true,
  },
};

export const reservationSummaryReportCols: ColsData<Omit<
  ReservationSummaryReportData,
  'id'
>> = {
  businessSource: {
    header: 'Business Source',
    isSortDisabled: true,
  },
  marketSegment: {
    header: 'Market Segment',
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
  roomType: {
    header: 'Room Type',
    isSortDisabled: true,
  },
  room: {
    header: 'Room',
    isSortDisabled: true,
  },
  createdOn: {
    header: 'Created On',
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
  lodging: {
    header: 'Lodging',
    isSortDisabled: true,
    isSearchDisabled: true,
  },
  lodgingTax: {
    header: 'Lodging Tax',
    isSortDisabled: true,
    isSearchDisabled: true,
  },
  otherCharges: {
    header: 'Other Charges',
    isSortDisabled: true,
  },
  otherChargesTax: {
    header: 'Other Charges Tax',
    isSortDisabled: true,
    isSearchDisabled: true,
  },
  avgRoomRate: {
    header: 'Avg Room Rate',
    isSortDisabled: true,
    isSearchDisabled: true,
  },
  paidAndRevenueLoss: {
    header: 'Paid & Revenue Loss',
    isSortDisabled: true,
    isSearchDisabled: true,
  },
  balance: {
    header: 'Balance',
    isSortDisabled: true,
    isSearchDisabled: true,
  },
};

export const housekeepingReportCols: ColsData<Omit<
  HousekeepingReportData,
  'id'
>> = {
  roomNo: {
    header: 'Room No.',
    isSortDisabled: true,
  },
  roomType: {
    header: 'Room Type',
    isSortDisabled: true,
  },
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
  roomNotes: {
    header: 'Room Notes',
    isSortDisabled: true,
  },
  status: {
    header: 'Status',
    isSortDisabled: true,
  },
};

//expressCheckIn
export const expressCheckInReportCols: ColsData<ExpressCheckInData> = {
  bookingNo: {
    header: 'Res#',
    isSortDisabled: true,
  },
  guestName: {
    header: 'Guest Name',
    isSortDisabled: true,
  },
  roomType: {
    header: 'Room/Type',
    isSearchDisabled: true,
  },
  checkIn: {
    header: 'Check In',
    isSortDisabled: true,
  },
  checkOut: {
    header: 'Check Out',
    isSortDisabled: true,
  },
  bookingAmount: {
    header: 'Booking Amount',
    isSortDisabled: true,
    isSearchDisabled: true,
  },
  status: {
    header: 'Status',
    isSortDisabled: true,
  },
};

export const addOnRequestReportCols: ColsData<AddOnRequestReportData> = {
  packageName: {
    header: 'Package Name',
    isSortDisabled: true,
  },
  packageCode: {
    header: 'Package Code',
    isSortDisabled: true,
  },
  source: {
    header: 'Source',
    isSortDisabled: true,
  },
  amount: {
    header: 'Amount',
    isSortDisabled: true,
    isSearchDisabled: true,
  },
  category: {
    header: 'Category',
    isSortDisabled: true,
  },
  active: {
    header: 'Active',
    isSortDisabled: true,
  },
  bookingNo: {
    header: 'Res#',
    isSortDisabled: true,
  },
};
