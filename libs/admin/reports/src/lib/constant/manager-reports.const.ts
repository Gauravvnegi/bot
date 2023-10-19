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
  { label: 'Total Revenue', name: 'roomRevenue' },
  { label: 'RevPAR', name: 'revPar' },
  { label: 'ADR', name: 'averageRate' },
  { label: 'Total Rooms in Hotel(Incl. DNR)', name: 'totalRooms' },
  { label: 'Rooms Occupied (Incl House Use)', name: 'occupiedRooms' },
  { label: 'Out of Order Rooms', name: 'outOfOrderRooms' },
  { label: 'Out of Service Rooms (DNR)', name: 'outOfServiceRooms' },
  { label: 'Complimentary Rooms ', name: 'complimentaryRooms' },
  { label: 'houseUseRooms', name: 'houseUseRooms' },
  { label: 'occupancyPercentage', name: 'occupancyPercentage' },
  { label: 'Arrival Rooms', name: 'arrivalRooms' },
  { label: 'Departure Rooms', name: 'departureRooms' },
  { label: 'Day Use Rooms', name: 'dayUseRooms' },
  { label: 'Individual Rooms In-House', name: 'individualRoomsInhouse' },
  { label: 'Frontdesk Rooms', name: 'frontDeskRoomsInhouse' },
  { label: 'Company Rooms In-House', name: 'companyRoomsInhouse' },
  { label: 'Travel Agent Rooms In-House', name: 'agentRoomsInhouse' },
  { label: 'Walk-in Rooms', name: 'walkInRoomsInhouse' },
  { label: 'No Show Rooms', name: 'noShowRooms' },
  { label: 'In-House Adults', name: 'inhouseAdults' },
  { label: 'In-House Children', name: 'inhouseChildren' },
  { label: 'Individual Persons In-House', name: 'individualPersonInhouse' },
  { label: 'Frontdesk Persons', name: 'frontDeskPersonInhouse' },
  { label: 'companyPersonInhouse', name: 'companyPersonInhouse' },
  { label: 'Travel Agent Persons In-House', name: 'agentPersonInhouse' },
  { label: 'Walk-in Persons', name: 'walkInPersonInhouse' },
  {
    label: 'Reservation Cancellations made Today',
    name: 'cancelledReservationForToday',
  },
  { label: 'Reservations Made Today', name: 'reservationsMadeToday' },
  { label: 'Arrival Rooms for Tomorrow', name: 'nextDayArrivalRooms' },
  { label: 'Departure Rooms for Tomorrow', name: 'nextDayDepartureRooms' },
  { label: 'ROOM CHARGES PER DAY', name: 'roomChargePerDay' },
  { label: 'roomCgstPerDay', name: 'roomCgstPerDay' },
  { label: 'roomSgstPerDay', name: 'roomSgstPerDay' },
  { label: 'VIP Persons In-House', name: 'vipPersonInhouse' },
  { label: 'Arrival Persons', name: 'arrivalPersons' },
  { label: 'Departure Persons', name: 'departurePersons' },
  { label: 'No Show Persons', name: 'noShowPersons' },
  { label: 'Room Nights Reserved Today', name: 'roomNightsReserved' },
  { label: 'Inclusions and Add-ons', name: 'inclusionOrAddOn' },
  { label: 'totalPersonInHouse', name: 'totalPersonInHouse' },
  { label: 'noShowReservationForToday', name: 'noShowReservationForToday' },
  { label: 'totalTax', name: 'totalTax' },
  { label: 'grossTotal', name: 'grossTotal' },
];
