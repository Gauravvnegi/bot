import { EntityState } from '@hospitality-bot/admin/shared';
import {
  ReservationStatus,
  PaymentStatus,
  TableStatus,
  KotMenuItem,
  PosOrderResponse,
} from './reservation-table';
import { OrderTypes } from './menu-order';

export type OutletReservationListResponse = {
  reservationData: OutletReservationResponse[];
  entityStateCounts: EntityState<string>;
  entityTypeCounts: EntityState<string>;
  total: number;
};

export type OutletReservationResponse = {
  name: string;
  reservationTime: string;
  adultCount: number;
  orderNumber: number;
  price: number;
  preparationTime: string;
  paymentStatus: PaymentStatus;
  numberOfItems: number;
  orderMethod: OrderTypes;
  reservationStatus: ReservationStatus;
  invoiceId: string;
  tableNumber: string;
  area: string;
  bookingNumber: string;
  date: number;
  time: string;
  paymentMethod: string;
  groupId: string;
  totalAmount: number;
  totalDueAmount: number;
  nextStates: string[];
  tableStatus: TableStatus;
};

export type TableListResponse = {
  tables: TableResponse[];
  entityTypeCounts: {
    AREA: number;
    TABLE: number;
  };
  entityStateCounts: {
    OCCUPIED: number;
    INACTIVE: number;
  };
  total: number;
};

export type TableResponse = {
  created: number;
  entityId: string;
  frontOfficeState: string;
  id: string;
  inventoryType: string;
  number: string;
  pax: number;
  remark: string;
  updated: string;
  status: boolean;
  area: {
    description: string;
    id: string;
    name: string;
    shortDescription: string;
    status: true;
  };
};

export type Table = {};

export type AreaListResponse = {
  areas: AreaResponse[];
  entityTypeCounts: {
    AREA: number;
    TABLE: number;
  };
  entityStateCounts: {
    OCCUPIED: number;
    INACTIVE: number;
  };
  total: number;
};

export type AreaResponse = {
  created: number;
  description: string;
  id: string;
  name: string;
  status: true;
  updated: number;
  tables: {
    areaId: string;
    created: number;
    id: string;
    number: string;
    updated: number;
  }[];
};

export type OutletConfigType = Record<
  'HOURS' | 'WEEKDAYS' | 'DIMENSIONS',
  { label: string; value: string }[]
>;

interface OccupancyDetails {
  maxChildren: number;
  maxAdult: number;
}

interface Kot {
  id: string;
  number: string;
  status: string;
  instructions: string;
  items: KotMenuItem[];
  preparedTime: number;
  created: number;
}

interface PricingDetails {
  paxChildBelowFive: number;
  paxChildAboveFive: number;
  paxChild: number;
  paxAdult: number;
  paxDoubleOccupancy: number;
  paxTripleOccupancy: number;
  totalAmount: number;
  totalPaidAmount: number;
  totalDueAmount: number;
  taxAndFees: number;
  taxAndFeesPerDay: number;
  basePrice: number;
  discountedAmount: number;
  containerCharge: number;
  allowance: number;
}

interface Guest {
  id: string;
  firstName: string;
  lastName: string;
  contactDetails: {
    cc: string;
    contactNumber: string;
    emailId: string;
  };
  dateOfBirth: number;
  age: number;
  type: string;
  isVerified: boolean;
  status: boolean;
  code: string;
  created: number;
  updated: number;
  gender: string;
  creditLimit: number;
  creditLimitUsed: number;
}

interface PricingDetails {
  paxChildBelowFive: number;
  paxChildAboveFive: number;
  paxChild: number;
  paxAdult: number;
  paxDoubleOccupancy: number;
  paxTripleOccupancy: number;
  totalAmount: number;
  totalPaidAmount: number;
  totalDueAmount: number;
  taxAndFees: number;
  taxAndFeesPerDay: number;
  basePrice: number;
  discountedAmount: number;
  containerCharge: number;
  allowance: number;
}

interface OccupancyDetails {
  maxChildren: number;
  maxAdult: number;
}

interface Reservation {
  id: string;
  from: number;
  to: number;
  occupancyDetails: OccupancyDetails;
  specialRequest: string;
  source: string;
  sourceName: string;
  reservationNumber: string;
  status: string;
  tableNumberOrRoomNumber?: string;
  created: number;
  updated: number;
  items: any[]; // Replace 'any[]' with appropriate type if known
  outletType: string;
  pricingDetails: PricingDetails;
  systemAction: boolean;
  totalReservationAmount: number;
  printRate: boolean;
  tableIdOrRoomId: string;
  externalBooking: boolean;
}

export type GuestReservationResponse = {
  id: string;
  from: number;
  to: number;
  occupancyDetails: OccupancyDetails;
  nightsCount: number;
  specialRequest: string;
  source: string;
  sourceName: string;
  marketSegment: string;
  reservationNumber: string;
  status: string;
  tableNumberOrRoomNumber?: string;
  created: number;
  updated: number;
  items: any[]; // Replace 'any[]' with appropriate type if known
  outletType: string;
  pricingDetails: PricingDetails;
  systemAction: boolean;
  totalReservationAmount: number;
  printRate: boolean;
  tableIdOrRoomId: string;
  externalBooking: boolean;
  order: Omit<PosOrderResponse, 'reservation'>;
  guest: Guest;
  currentJourney: 'WAITLISTED' | 'SEATED';
  currentJoureyStatus: string;
  currentJourneyState: string;
  remarks: string;
};

export type GuestReservationListResponse = {
  total: number;
  entityTypeCounts: Record<string, number>;
  entityStateCounts: Record<string, number>;
  records: GuestReservationResponse[];
};
