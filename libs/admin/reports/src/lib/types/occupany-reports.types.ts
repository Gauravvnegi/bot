import { HistoryAndForecastReportData } from '../models/occupancy-reports.models';
import { ManagerReportResponse } from './manager-reports.types';
import { RowStylesKeys } from './reports.types';

export type HistoryAndForecastColumns = Omit<
  HistoryAndForecastReportData,
  'deserialize' | RowStylesKeys
>;

export type HistoryAndForecastReportResponse = ManagerReportResponse & {
  subTotalObject: boolean;
};

export type HouseCountReportData = {
  date: string;
  roomsAvailable: string;
  roomsOccupied: string;
  roomReserved: string;
  roomsSold: string;
  total: number;
  guestOccupied: number;
  guestReserved: number;
  totalGuest: number;
};

export type HouseCountReportResponse = {
  id: string;
  date: number;
  entityId: string;
  roomRevenue: number;
  revPar: number;
  averageRate: number;
  occupiedRoomPercentage: number;
  availableRoomPercentage: number;
  averageRateIncl: number;
  availableRoom: number;
  totalRooms: number;
  occupiedRooms: number;
  outOfOrderRooms: number;
  outOfServiceRooms: number;
  complimentaryRooms: number;
  houseUseRooms: number;
  occupancyPercentage: number;
  arrivalRooms: number;
  departureRooms: number;
  dayUseRooms: number;
  individualRoomsInhouse: number;
  frontDeskRoomsInhouse: number;
  companyRoomsInhouse: number;
  agentRoomsInhouse: number;
  walkInRoomsInhouse: number;
  noShowRooms: number;
  inhouseAdults: number;
  inhouseChildren: number;
  inhouseGuest: number;
  individualPersonInhouse: number;
  frontDeskPersonInhouse: number;
  companyPersonInhouse: number;
  agentPersonInhouse: number;
  walkInPersonInhouse: number;
  cancelledReservationForToday: number;
  reservationsMadeToday: number;
  nextDayArrivalRooms: number;
  nextDayDepartureRooms: number;
  roomChargePerDay: number;
  roomCgstPerDay: number;
  roomSgstPerDay: number;
  vipPersonInhouse: number;
  arrivalPersons: number;
  departurePersons: number;
  noShowPersons: number;
  roomNightsReserved: number;
  inclusionOrAddOn: number;
  totalPersonInHouse: number;
  noShowReservationForToday: number;
  totalTax: number;
  grossTotal: number;
  occupiedRoomGuests: number;
  noShowReservationAmount: number;
  canceledReservationAmount: number;
  dayUseRoomGuests: number;
  cancellationRoomGuest: number;
  earlyCheckInAmount: number;
  lateCheckOutAmount: number;
  noShowNightcount: number;
  cancellationNightCount: number;
  subTotalObject: boolean;
};
