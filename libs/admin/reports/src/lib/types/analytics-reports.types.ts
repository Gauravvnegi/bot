export type CompanyContributionsReportData = {
  //todo
};

export type CompanyContributionsReportResponse = {
  //todo
};

//occupancyAnalysisReport
export type OccupancyAnalysisReportData = {
  roomType: string;
  roomAvailable: number;
  roomRevenue: number;
  soldRooms: number;
  soldRoomsPercent: number;
  singleSoldRooms: number;
  doubleSoldRooms: number;
  tripleSoldRooms: number;
  quadSoldRooms: number;
  moreQuardplSoldRooms: number;
  pax: number;
  arrOrAgr: number;
  arp: number;
  revPar: number;
};

export type OccupancyAnalysisReportResponse = {
  id: string;
  date: number;
  entityId: string;
  roomTypeId: string;
  roomTypeName: string;
  status: string;
  totalRooms: number;
  outOfServiceRooms: number;
  outOfOrderRooms: number;
  roomRevenue: number;
  roomTax: number;
  roomDiscount: number;
  soldRooms: number;
  singleSold: number;
  doubleSold: number;
  tripleSold: number;
  quardplSold: number;
  moreQuardplSold: number;
  pax: number;
  cancelledReservation: number;
  availableRooms: number;
  soldRoomPercentage: number;
  arr: number;
  arp: number;
  revPar: number;
  subTotalObject: boolean;
};

export type BusinessAnalysisReportData = MarketSegmentReportData & {};

export type BusinessAnalysisReportResponse = {
  AGENT: Accommodation;
  OTA: Accommodation;
  OTHERS: Accommodation;
  WALK_IN: Accommodation;
  'Aiosell BE': Accommodation;
  subTotal: Accommodation;
};

type Accommodation = {
  nights: number;
  occupancyPercent: number;
  pax: number;
  roomRevenue: number;
  revenuePercent: number;
  arr: number;
  arp: number;
};

export type MarketSegmentReportData = {
  marketSegment: string;
  nights: number;
  occupancy: string;
  pax: number;
  roomRevenue: string;
  revenue: string;
  arrOrAgr: string;
  arp: string;
};

export type MarketSegmentReportResponse = OccupancyReport;

type OccupancyData = {
  nights: number;
  occupancyPercent: number;
  pax: number;
  roomRevenue: number;
  revenuePercent: number;
  arr: number;
  arp: number;
};

type OccupancyDataMap = {
  [key: string]: OccupancyData;
};

type OccupancyReport = {
  FIT: OccupancyData;
  'Corporate FIT': OccupancyData;
  MICE: OccupancyData;
  Budget: OccupancyData;
  'Aiosell BE': OccupancyData;
  subTotal: OccupancyData;
};

export type NoShowSummaryReportData = {
  createdOn: string;
  bookingNo: string;
  guestName: string;
  pax: number;
  rooms: number;
  roomType: string;
  company: string;
  status: string;
  checkIn: string;
  checkOut: string;
  createdBy: string;
  reservationNumber: string;
  guestId: string;
};

export type NoShowSummaryReportResponse = {
  id: string;
  from: number;
  to: number;
  reservationType: string;
  reservationNumber: string;
  status: string;
  guest: Guest;
  created: number;
  updated: number;
  pricingDetails: PricingDetails;
  bookingItems: BookingItem[];
};

interface ContactDetails {
  cc: string;
  contactNumber: string;
  emailId: string;
}

interface Company {
  id: string;
  firstName: string;
  contactDetails: ContactDetails;
  age: number;
  firstStay: number;
  lastStay: number;
  totalNights: number;
  code: string;
  documentRequired: boolean;
}

interface Guest {
  id: string;
  salutation: string;
  firstName: string;
  lastName: string;
  contactDetails: ContactDetails;
  nationality: string;
  dateOfBirth: number;
  age: number;
  gender: string;
  firstStay: number;
  lastStay: number;
  totalNights: number;
  company: Company;
  code: string;
  documentRequired: boolean;
}

interface RoomDetails {
  roomNumber: string;
  roomTypeId: string;
  roomTypeLabel: string;
  roomCount: number;
}

interface PricingDetails {
  totalAmount: number;
  totalPaidAmount: number;
  totalDueAmount: number;
  taxAndFees: number;
  taxAndFeesPerDay: number;
  basePrice: number;
  discountedAmount: number;
}

interface OccupancyDetails {
  maxChildren: number;
  maxAdult: number;
}

interface BookingItem {
  roomDetails: RoomDetails;
  pricingDetails: PricingDetails;
  id: string;
  occupancyDetails: OccupancyDetails;
}

interface Reservation {}
