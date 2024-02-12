import { Kot } from '../models/kot-datatable.model';

export type MenuItem = {
  name: string;
  instructions: string;
  isExpandedInstruction: boolean;
  quantity: number;
};

export type Config = Kot & {};

export type OrderListResponse = {
  total: number;
  entityTypeCounts: {
    ONLINE_ORDER: number;
    PICKUP: number;
    DINE_IN: number;
    DELIVERY: number;
  };
  records: OrderResponse[];
};

export type OrderResponse = {
  id: string;
  number: string;
  status: string;
  type: string;
  reservationId: string;
  items: Item[];
  entityId: string;
  createdBy: string;
  pricingDetails: PricingDetails;
  kots: KotResponse[];
  guest: Guest;
  reservation: Reservation;
  source: string;
};

export type Item = {
  id: string;
  amount: number;
  description: string;
  remarks?: string;
  transactionType: string;
  unit: number;
  type: string;
  currency: string;
  itemId?: string;
  parentItem?: string;
  kotId?: string;

  menuItem: {
    mealPreference: string;
  };
};

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

export interface KotResponse {
  id: string;
  number: string;
  status: string;
  instructions: string;
  items: Item[];
  preparedTime: number;
  created: number;
}

interface ContactDetails {
  cc: string;
  contactNumber: string;
  emailId: string;
}

interface Guest {
  id: string;
  firstName: string;
  lastName: string;
  contactDetails: ContactDetails;
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
  tableNumberOrRoomNumber: string;
  created: number;
  updated: number;
  items: any[]; // Assuming items is of any type
  outletType: string;
  systemAction: boolean;
  totalReservationAmount: number;
  printRate: boolean;
  externalBooking: boolean;
}

interface Type {
  key: string;
  value: string;
}

interface KotStatus {
  key: string;
  value: string;
}

interface KotTimeFilter {
  key: string;
  value: string;
  colorCode: string;
}

export type OrderConfigResponse = {
  type: Type[];
  kotStatus: KotStatus[];
  kotTimeFilter: KotTimeFilter[];
};
