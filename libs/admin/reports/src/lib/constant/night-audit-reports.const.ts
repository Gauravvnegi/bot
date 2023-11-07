import {
  AuditRoomDetailsReportData,
  AuditTaxReportData,
  MtdAndYtdReportData,
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

//MtdAndYtdReportData
export const mtdAndYtdReportCols: ColsData<MtdAndYtdReportData> = {
  name: {
    header: 'Name',
    isSortDisabled: true,
    isSearchDisabled: true,
  },
  day: {
    header: 'Day',
    isSortDisabled: true,
    isSearchDisabled: true,
  },
  month: {
    header: 'Month',
    isSortDisabled: true,
    isSearchDisabled: true,
  },
  year: {
    header: 'Year',
    isSortDisabled: true,
    isSearchDisabled: true,
  },
};

export const mtdAndYtdReportRows = [
  {
    name: '% Rooms Occupied minus OOS and House Use',
    label: 'roomsOccupiedMinusOOSAndHouseUsePercentage',
  },
  {
    name: '% Rooms Occupied minus OOS',
    label: 'roomsOccupiedMinusOOSPercentage',
  },
  {
    name: '% Rooms Occupied minus Comp',
    label: 'roomsOccupiedMinusCompPercentage',
  },
  {
    name: 'ADR',
    label: 'averageRate',
  },
  {
    name: 'ADR minus Comp',
    label: 'adrMinusComp',
  },
  {
    name: 'Total Revenue',
    label: 'totalRevenue',
  },
  {
    name: 'Inclusions and Add-ons',
    label: 'inclusionOrAddOn',
  },
  {
    name: 'Room Revenue',
    label: 'roomRevenue',
  },
  {
    name: 'Total Rooms in Hotel(Incl. DNR)',
    label: 'totalRooms',
  },
  {
    name: 'Rooms Occupied (Excl House Use)',
    label: 'occupiedRoomsExclHouseUse',
  },
  {
    name: 'Rooms Occupied minus Comp',
    label: 'roomsOccupiedMinusComp',
  },
  {
    name: 'Day Use Rooms',
    label: 'dayUseRooms',
  },
  {
    name: 'Complimentary Rooms',
    label: 'complimentaryRooms',
  },
  {
    name: 'House Use Rooms',
    label: 'houseUseRooms',
  },
  {
    name: 'Out of Service Rooms (DNR)',
    label: 'outOfServiceRooms',
  },
  {
    name: 'Out of Order Rooms (OOO)',
    label: 'outOfOrderRooms',
  },
  {
    name: 'No. of Lettable Rooms',
    label: 'noOfLettableRooms',
  },
  {
    name: 'Available Rooms',
    label: 'availableRooms',
  },
  {
    name: 'Arrival Rooms',
    label: 'arrivalRooms',
  },
  {
    name: 'Departure Rooms',
    label: 'departureRooms',
  },
  {
    name: 'No Show Rooms',
    label: 'noShowRooms',
  },
  {
    name: 'Cancelled Reservations',
    label: 'cancelledReservationForToday',
  },
  {
    name: 'Frontdesk Rooms',
    label: 'frontDeskRoomsInhouse',
  },
  {
    name: 'Walk-in Rooms',
    label: 'walkInRoomsInhouse',
  },
  {
    name: 'Total In-House Persons',
    label: 'totalPersonInHouse',
  },
  {
    name: 'Arrival Rooms for Tomorrow',
    label: 'nextDayArrivalRooms',
  },
  {
    name: 'Departure Rooms for Tomorrow',
    label: 'nextDayDepartureRooms',
  },
  {
    name: 'Revenue per Available Room(RevPAR)',
    label: 'revPAR',
  },
  {
    name: 'Revenue per Available Room minus OOS',
    label: 'revPar',
  },
];
