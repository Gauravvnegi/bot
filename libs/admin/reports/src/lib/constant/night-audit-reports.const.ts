import {
  AuditRoomDetailsReportData,
  AuditTaxReportData,
} from '../types/night-audit-reports.types';
import { ColsData } from '../types/reports.types';

export const auditRoomDetailsReportCols: Partial<ColsData<
  AuditRoomDetailsReportData
>> = {
  roomDetails: {
    header: 'Room Details',
    isSortDisabled: true,
    isSearchDisabled: true,
  },
  noOfRooms: {
    header: 'No. of Rooms',
    isSortDisabled: true,
    isSearchDisabled: true,
  },
  noOfGuests: {
    header: 'No. of Guests',
    isSortDisabled: true,
    isSearchDisabled: true,
  },
};

export const auditRoomDetailsReportRows = [
  {
    label: 'Today`s Occupied Rooms',
    noOfRooms: 'occupiedRooms',
    noOfGuests: 'occupiedGuests',
  },
  { label: 'Today`s Available Rooms', noOfRooms: 'arrivalRooms' }, //total rooms - occupied rooms
  {
    label: 'Today`s CheckIn',
    noOfRooms: 'arrivalRooms',
    noOfGuests: 'arrivalGuests',
  },
  {
    label: 'Today`s CheckOut',
    noOfRooms: 'departureRooms',
    noOfGuests: 'departureGuests',
  },
  {
    label: 'Today`s No Show',
    noOfRooms: 'noShowRooms',
    noOfGuests: 'noShowGuests',
  },
  {
    label: 'Today`s Cancellation',
    noOfRooms: 'cancelledReservationForToday',
    noOfGuests: 'cancelledReservationForToday',
  },
  {
    label: 'Today`s Complimentary Rooms',
    noOfRooms: 'complimentaryRooms',
    noOfGuests: 'complimentaryGuests',
  },
  {
    label: 'Today`s Use Rooms',
    noOfRooms: 'dayUseRooms',
    noOfGuests: 'dayUseGuests',
  },
];

export const auditTaxReportCols: ColsData<AuditTaxReportData> = {
  taxName: {
    header: 'Tax Name',
    isSortDisabled: true,
    isSearchDisabled: true,
  },
  taxAmount: {
    header: 'Tax Amount',
    isSortDisabled: true,
    isSearchDisabled: true,
  },
};

export const auditTaxReportRows = [
  {
    label: 'CGST',
    name: 'totalCgstTax',
  },
  {
    label: 'SGST',
    name: 'totalSgstTax',
  },
  {
    label: 'Total Tax',
    name: 'totalTax',
  },
];
