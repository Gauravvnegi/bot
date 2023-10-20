import { TableObjectData } from '../../../types/table-view.type';

export interface AuditSummaryResponse {
  id: string;
  date: number;
  entityId: string;
  roomRevenue: number;
  revPar: number;
  averageRate: number;
  averageRateIncl: number;
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
  roomStatusMap: {
    count: number;
    status: string;
  }[];
  vipPersonInhouse: number;
  arrivalPersons: number;
  departurePersons: number;
  noShowPersons: number;
  roomNightsReserved: number;
  inclusionOrAddOn: number;
  totalPersonInHouse: number;
  bookingAmount: number;
  cashiersPayment: {
    UserPermission: string;
  };
  outlets?: {
    id: string;
    name: string;
    totalAmount: number;
  }[];
  subTotalObject: boolean;
}

type AuditDataType = {
  title: string;
  values: Record<string, number | string> | TableObjectData[];
};
export interface AuditViewType {
  rooms: AuditDataType;
  houseKeeping: AuditDataType;
  accountDetails: AuditDataType;
  revenueList: AuditDataType;
}

export type AuditSummaryColumn = keyof AuditViewType;
