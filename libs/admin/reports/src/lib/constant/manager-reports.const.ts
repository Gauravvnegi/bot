import {
  ManagerFlashReportData,
  ManagerReportData,
} from '../types/manager-reports.types';
import { ColsData } from '../types/reports.types';

const managerReportCols: ColsData<ManagerReportData> = {
  emptyCell: {
    header: '',
    isSearchDisabled: true,
    isSortDisabled: true,
  },
  day: {
    header: 'DAY',
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

export const managerFlashReportCols: ColsData<ManagerFlashReportData> = {
  ...managerReportCols,
};
export const managerFlashReportRows = [
  { label: 'Total Rooms in Hotel(Incl. DNR)', name: 'totalRooms' },
  { label: 'Rooms Occupied (Incl House Use)', name: 'occupiedRooms' },
  {
    label: 'Total Rooms in Hotel minus OOS Rooms',
    name: 'totalRoomMinusOSS',
  }, // totalroom - outofservice
  { label: 'Available Rooms', name: 'availableRooms' }, //totalroom - occupied
  {
    label: 'Available Rooms minus OOS Rooms',
    name: 'availableRoomsMinusOOSS',
  }, // totalroom - occupied - outof service
  { label: 'Complimentary Rooms', name: 'complimentaryRooms' },
  { label: 'No. of Lettable Rooms', name: 'noOfLettableRooms' }, //total rooms - out of service
  {
    label: 'Rooms Occupied minus Comp And House Use',
    name: 'roomsOccupiedMinusCompAndHouse',
  }, //occupied rooms - complimentary rooms - house use rooms
  {
    label: 'Rooms Occupied minus House Use',
    name: 'roomOccupiedMinusHouseUse',
  }, //`occupied rooms - house use rooms
  { label: 'Rooms Occupied minus Comp', name: 'roomOccupiedMinusComp' }, //occupied rooms - complimentary rooms
  { label: 'Day Use Rooms', name: 'dayUseRooms' },
  { label: 'Out of Service Rooms (DNR)', name: 'outOfServiceRooms' },
  { label: 'Out of Order Rooms (OOO)', name: 'outOfOrderRooms' },
  { label: 'In-House Adults', name: 'inhouseAdults' },
  { label: 'In-House Children', name: 'inhouseChildren' },
  { label: 'Total In-House Persons', name: 'totalPersonInHouse' },
  {
    label: 'Individual Persons In-House',
    name: 'individualPersonInhouse',
  },
  { label: 'VIP Persons In-House', name: 'vipPersonInhouse' },
  { label: 'Individual Rooms In-House', name: 'individualRoomsInhouse' },
  { label: 'Company Rooms In-House', name: 'companyRoomsInhouse' },
  { label: 'Travel Agent Rooms In-House', name: 'agentRoomsInhouse' },
  { label: 'Arrival Rooms', name: 'arrivalRooms' },
  { label: 'Arrival Persons', name: 'arrivalPersons' },
  { label: 'Frontdesk Rooms', name: 'frontDeskRoomsInhouse' },
  { label: 'Walk-in Rooms', name: 'walkInRoomsInhouse' },
  { label: 'Frontdesk Persons', name: 'frontDeskPersonInhouse' },
  { label: 'Walk-in Persons', name: 'walkInPersonInhouse' },
  { label: 'Departure Rooms', name: 'departureRooms' },
  { label: 'Departure Persons', name: 'departurePersons' },
  { label: 'No Show Rooms', name: 'noShowRooms' },
  { label: 'No Show Persons', name: 'noShowPersons' },
  {
    label: 'Reservation Cancellations made Today',
    name: 'cancelledReservationForToday',
  },
  { label: 'Reservations Made Today', name: 'reservationsMadeToday' },
  { label: 'Room Nights Reserved Today', name: 'roomNightsReserved' },
  {
    label: 'Cancelled Reservations for Today',
    name: 'cancelledReservationForToday',
  },
  { label: 'ADR', name: 'averageRate' },
  { label: 'RevPAR Include DNR', name: 'revParInclDNR' }, //revnue/total no
  { label: 'RevPAR', name: 'revPar' },
  { label: 'Room Revenue', name: 'roomRevenue' },
  { label: 'Inclusions and Add-ons', name: 'inclusionOrAddOn' },
  { label: 'Arrival Rooms for Tomorrow', name: 'nextDayArrivalRooms' },
  {
    label: 'Departure Rooms for Tomorrow',
    name: 'nextDayDepartureRooms',
  },
  { label: 'Total Revenue', name: 'totalRevenue' },
];
