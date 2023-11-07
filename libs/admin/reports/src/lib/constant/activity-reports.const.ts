import {
  ReservationActivityReportData,
  ReservationCreatedReportData,
} from '../types/activity-reports.types';
import { ColsData } from '../types/reports.types';

export const reservationActivityReportCols: ColsData<Omit<
  ReservationActivityReportData,
  'id'
>> = {
  bookingNo: {
    header: 'Res/Group',
    isSortDisabled: true,
  },
  roomType: {
    header: 'Room Type',
    isSortDisabled: true,
  },
  primaryGuest: {
    header: 'Primary Guest',
    isSortDisabled: true,
  },
  sharers: {
    header: 'Sharers',
    isSortDisabled: true,
  },
  arrival: {
    header: 'Arrival',
    isSortDisabled: true,
  },
  departure: {
    header: 'Departure',
    isSortDisabled: true,
  },
  pax: {
    header: 'Pax',
    isSortDisabled: true,
  },
  rateOrPackage: {
    header: 'Rate/Package',
    isSortDisabled: true,
  },
  amount: {
    header: 'Amount',
    isSortDisabled: true,
  },
};

export const reservationCreatedReportCols: ColsData<Omit<
  ReservationCreatedReportData,
  'id'
>> = {
  bookingNo: {
    header: 'Res/Group',
    isSortDisabled: true,
  },
  createdOn: {
    header: 'Created On',
    isSortDisabled: true,
  },
  roomType: {
    header: 'Room Type',
    isSortDisabled: true,
  },
  primaryGuest: {
    header: 'Primary Guest',
    isSortDisabled: true,
  },
  arrival: {
    header: 'Arrival',
    isSortDisabled: true,
  },
  departure: {
    header: 'Departure',
    isSortDisabled: true,
  },
  nights: {
    header: 'Nights',
    isSortDisabled: true,
  },
  amount: {
    header: 'Amount',
    isSortDisabled: true,
  },
};
