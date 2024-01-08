export type AuditRoomDetailsReportData = {
  roomDetails: string;
  noOfRooms: number;
  noOfGuests: number;
};

export type AuditRoomDetailsReportResponse = {
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
  reservationsMadeToday: number;
  nextDayArrivalRooms: number;
  nextDayDepartureRooms: number;
  roomChargePerDay: number;
  roomCgstPerDay: number;
  roomSgstPerDay: number;
  calenderType: string;
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
  dayUseRoomGuests: number;
  subTotalObject: boolean;
  todayAvailableRooms: number | string;
};

export type AuditTaxReportData = {
  taxName: string;
  taxAmount: number;
  isSubTotal?: boolean;
  isBold?: boolean;
};

export type AuditTaxReportCols = Omit<
  AuditTaxReportData,
  'isSubTotal' | 'isBold'
>;

export type AuditTaxReportResponse = {
  amount: number;
  category: string;
  type: 'CGST' | 'SGST';
};

//mtdAndYtdReport
export type MtdAndYtdReportData = {
  name: string;
  day: string;
  month: string;
  year: string;
};

//nightAuditRevenue
export type NightAuditRevenueData = {
  firstCol: string;
  secondCol: string| number;
  thirdCol: string | number;
  fourthCol: string;
  fifthCol: string;
};

export type NightAuditRevenueResponse = {
  auditData: {
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
    subTotalObject: false;
  };
  bookingRevenue: {
    AGENT: number;
    Corporate: number;
    Frontdesk: number;
  };
  itemPayments: {
    amount: number;
    description: string;
    quantity: number;
    totalTaxAmount: number;
  }[];
};

export type MtdAndYtdReportResponse = {
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
  reservationsMadeToday: number;
  nextDayArrivalRooms: number;
  nextDayDepartureRooms: number;
  roomChargePerDay: number;
  roomCgstPerDay: number;
  roomSgstPerDay: number;
  calenderType: 'DAY' | 'MONTH' | 'YEAR';
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
  dayUseRoomGuests: number;
};
