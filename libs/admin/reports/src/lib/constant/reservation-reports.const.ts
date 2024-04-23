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

const reservationReportCols: ColsData<Omit<
  ReservationReportData,
  'reservationId'
>> = {
  bookingNo: {
    header: 'Res/Group',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  guestName: {
    header: 'Guest Name',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  otherCharges: {
    header: 'Other Charges',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  amountPaid: {
    header: 'Amount Paid',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  balance: {
    header: 'Balance',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  bookingAmount: {
    header: 'Booking Amount',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
};

export const noShowReportCols: ColsData<Omit<
  NoShowReportData,
  'reservationId'
>> = {
  bookingNumber: reservationReportCols.bookingNo,
  dateOfArrival: {
    header: 'Date of Arrival',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  noShowOn: {
    header: 'No-Show On',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  guestName: {
    header: 'Guest Name',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  bookingAmount: reservationReportCols.bookingAmount,
  noShowCharge: {
    header: 'No Show Charge',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  noShowReason: {
    header: 'No Show Reason',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  otherCharge: reservationReportCols.otherCharges,
  amountPaid: reservationReportCols.amountPaid,
  balance: reservationReportCols.balance,
};

export const cancellationReportCols: ColsData<Omit<
  CancellationReportPartialData,
  'reservationId'
>> = {
  bookingNumber: reservationReportCols.bookingNo,
  guestName: noShowReportCols.guestName,
  roomType: {
    header: 'Room/Type',
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
  night: {
    header: 'Nights',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  cancelledOn: {
    header: 'Cancelled On',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  bookingAmount: reservationReportCols.bookingAmount,
  cancellationCharge: {
    header: 'Cancellation Charge',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  cancellationReason: {
    header: 'Cancellation Reason',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  otherCharge: reservationReportCols.otherCharges,
  amountPaid: reservationReportCols.amountPaid,
  balance: reservationReportCols.balance,
};

export const arrivalReportCols: ColsData<Omit<
  ArrivalReportData,
  'reservationId'
>> = {
  bookingNo: { ...reservationReportCols.bookingNo },
  guestName: { ...reservationReportCols.guestName },
  roomType: {
    header: 'Room/Type',
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
  bookingAmount: { ...reservationReportCols.bookingAmount },
  status: {
    header: 'Status',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  remark: {
    header: 'Remarks',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  arrivalTime: {
    header: 'Arrival Time',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
};
const { arrivalTime, ...rest } = arrivalReportCols;

export const departureReportCols: ColsData<Omit<
  DepartureReportData,
  'reservationId'
>> = {
  ...rest,
  departureTime: {
    header: 'Departure Time',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
};

export const draftReservationReportCols: ColsData<Omit<
  DraftReservationReportData,
  'reservationId'
>> = {
  bookingNo: reservationReportCols.bookingNo,
  guestName: reservationReportCols.guestName,
  roomType: {
    header: 'Room/Type',
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
  tempReservedNumber: {
    header: 'Temp Reserved No.',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  bookingAmount: reservationReportCols.bookingAmount,
  paidAmount: reservationReportCols.amountPaid,
  balance: reservationReportCols.balance,
  status: {
    header: 'Status',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
};

export const employeeWiseReservationReportCols: ColsData<Omit<
  EmployeeWiseReservationReportData,
  'reservationId'
>> = {
  userName: {
    header: 'User Name',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  bookingNo: reservationReportCols.bookingNo,
  guestName: reservationReportCols.guestName,
  checkIn: arrivalReportCols.checkIn,
  checkOut: arrivalReportCols.checkOut,
  nights: {
    header: 'Nights',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  roomCharge: {
    header: 'Room Charge',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  tax: {
    header: 'Tax',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  otherCharges: {
    header: 'Other Charges',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  totalCharge: {
    header: 'Total Charge',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  amountPaid: reservationReportCols.amountPaid,
};

export const reservationAdrReportCols: ColsData<Omit<
  ReservationAdrReportData,
  'reservationId'
>> = {
  bookingNo: reservationReportCols.bookingNo,
  guestName: reservationReportCols.guestName,
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
  roomRent: {
    header: 'Room Rent',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  adr: {
    header: 'ADR',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
};

export const incomeSummaryReportCols: ColsData<Omit<
  IncomeSummaryReportData,
  'reservationId'
>> = {
  bookingNo: reservationReportCols.bookingNo,
  guestName: reservationReportCols.guestName,
  checkIn: arrivalReportCols.checkIn,
  checkOut: arrivalReportCols.checkOut,
  nights: {
    header: 'Nights',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  lodgingAndOtherCharges: {
    header: 'Lodging & Other Charges',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  taxTotal: {
    header: 'Post Tax Total',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  paidAmount: {
    header: 'Total Paid',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
};

export const reservationSummaryReportCols: ColsData<Omit<
  ReservationSummaryReportData,
  'reservationId'
>> = {
  businessSource: {
    header: 'Business Source',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  marketSegment: {
    header: 'Market Segment',
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
  roomType: {
    header: 'Room Type',
    isSearchDisabled: false,
    isSortDisabled: true,
  },
  room: {
    header: 'Room',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  createdOn: {
    header: 'Created On',
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
  otherCharges: {
    header: 'Other Charges',
    isSortDisabled: true,
  },
  otherChargesTax: {
    header: 'Other Charges Tax',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  avgRoomRate: {
    header: 'Avg Room Rate',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  paidAndRevenueLoss: {
    header: 'Paid & Revenue Loss',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  balance: {
    header: 'Balance',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
};

export const housekeepingReportCols: ColsData<Omit<
  HousekeepingReportData,
  'reservationId'
>> = {
  roomNo: {
    header: 'Room No.',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  roomType: {
    header: 'Room Type',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
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
  roomNotes: {
    header: 'Room Notes',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  status: {
    header: 'Status',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
};

//expressCheckIn
export const expressCheckInReportCols: ColsData<Omit<
  ExpressCheckInData,
  'reservationId'
>> = {
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
  roomType: {
    header: 'Room/Type',
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
  bookingAmount: {
    header: 'Booking Amount',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  status: {
    header: 'Status',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
};

export const addOnRequestReportCols: ColsData<AddOnRequestReportData> = {
  packageName: {
    header: 'Package Name',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  packageCode: {
    header: 'Package Code',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  source: {
    header: 'Source',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  amount: {
    header: 'Amount',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  category: {
    header: 'Category',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  active: {
    header: 'Active',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  bookingNo: {
    header: 'Res#',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
};
