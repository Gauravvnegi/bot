import {
  ReservationActivityReportData,
  ReservationCreatedReportData,
} from '../types/activity-reports.types';
import { ColsData } from '../types/reports.types';

export const reservationActivityReportCols: ColsData<Omit<
  ReservationActivityReportData,
  'reservationId'
>> = {
  bookingNo: {
    header: 'Res/Group',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  roomType: {
    header: 'Room Type',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  primaryGuest: {
    header: 'Primary Guest',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  sharers: {
    header: 'Sharers',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  arrival: {
    header: 'Arrival',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  departure: {
    header: 'Departure',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  pax: {
    header: 'Pax',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  rateOrPackage: {
    header: 'Rate/Package',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  amount: {
    header: 'Amount',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
};

export const reservationCreatedReportCols: ColsData<Omit<
  ReservationCreatedReportData,
  'reservationId'
>> = {
  bookingNo: {
    header: 'Res/Group',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  createdOn: {
    header: 'Created On',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  roomType: {
    header: 'Room Type',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  primaryGuest: {
    header: 'Primary Guest',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  arrival: {
    header: 'Arrival',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  departure: {
    header: 'Departure',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  nights: {
    header: 'Nights',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  amount: {
    header: 'Amount',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
};
