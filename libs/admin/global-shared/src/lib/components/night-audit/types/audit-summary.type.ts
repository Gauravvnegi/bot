import { TableDataType, TableObjectData } from '../../../types/table-view.type';

interface RoomStatus {
  count: number;
  status: string;
}

export interface AuditSummaryResponse {
  id: string;
  date: number;
  entityId: string;
  roomRevenue: number;
  revPar: number;
  averageRate: number;
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
  individualPersonInhouse: number;
  frontDeskPersonInhouse: number;
  companyPersonInhouse: number;
  agentPersonInhouse: number;
  walkInPersonInhouse: number;
  cancelledReservationForToday: number;
  noShowReservationForToday: number;
  reservationsMadeToday: number;
  nextDayArrivalRooms: number;
  nextDayDepartureRooms: number;
  roomCgstPerDay: number;
  roomSgstPerDay: number;
  totalTax: number;
  grossTotal: number;
  roomStatusMap: RoomStatus[];
  vipPersonInhouse: number;
  arrivalPersons: number;
  departurePersons: number;
  noShowPersons: number;
  roomNightsReserved: number;
  inclusionOrAddOn: number;
  totalPersonInHouse: number;
  subTotalObject: boolean;
}

export interface AuditViewType {
  [key: string]: {
    title: string;
    values: Record<string, number | string> | TableObjectData[];
  };
}
