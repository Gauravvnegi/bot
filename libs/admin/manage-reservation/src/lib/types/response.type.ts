import { EntityState } from '@hospitality-bot/admin/shared';
import {
  EntityStateCountsResponse,
  EntityTypeCountsResponse,
} from '../models/reservations.model';
import { GuestType } from 'libs/admin/guests/src/lib/types/guest.type';

/* Reservation List Response Types deceleration */
export type ReservationListResponse = {
  records?: RoomReservationRes[];
  total: number;
  entityStateCounts: EntityStateCountsResponse;
  entityTypeCounts: EntityTypeCountsResponse;
};

export type RoomReservationRes = {
  id: string;
  from: number;
  to: number;
  source: string;
  reservationType: string;
  sourceName: string;
  reservationNumber: string;
  status: string;
  guest: GuestType;
  created: number;
  nextStates: string[];
  bookingItems: BookingItems[];
  pricingDetails: PricingDetails;
}

/* Reservation Response Types Deceleration*/
export type ReservationResponse = {
  id: string;
  entityId: string;
  invoiceId: string;
  rooms: number;
  roomType: string;
  confirmationNo: string;
  name: string;
  company: string;
  outletType?: string;
  outletName?: string;
  date: string;
  amount: number;
  source: string;
  payment: string;
  status: string;
  reservationTypes: string;
  reservationNumber: string;
  totalDueAmount: number;
  firstName: string;
  lastName: string;
  paymentMethod: string;
  totalPaidAmount: number;
  roomCount: number;
  reservationType: string;
  from: number;
  to: number;
  totalAmount: number;
  fullName: string;
  roomNumber: number;
  nextStates: string[];
  sourceName: string;
};

export type PaymentConfigResponse = {
  label: string;
  description: string;
  iconUrl: string;
  type: PaymentMethodConfig[];
};

export type PaymentMethodConfig = {
  id: string;
  entityId: string;
  merchantId?: string;
  accessCode?: string;
  chainId?: string;
  secretKey?: string;
  externalRedirect: boolean;
  iconUrl: string;
  currency?: string;
  description: string;
  status: boolean;
  type: string;
  imageUrl?: string;
  label: string;
  instructions?: any;
};

export type RoomTypeResponse = {
  id: string;
  name: string;
  imageUrls: string[];
  description: string;
  roomCount: number;
  activeRoomCount: number;
  unavailableRoomCount: number;
  ratePlans: RatePlanRes[];
  soldOutCount: number;
  maxChildren: number;
  maxAdult: number;
  area: number;
  status: boolean;
  maxOccupancy: number;
  discountedPrice: number;
  originalPrice: number;
  currency: string;
};

export type RatePlanRes = {
  basePriceCurrency: string;
  basePrice: string;
  discountType: string;
  discountValue: number;
  bestAvailablePrice: string;
  maxPriceCurrency: string;
  maxPrice: number;
  minPriceCurrency: string;
  minPrice: number;
  paxPriceCurrency: string;
  paxPrice: string;
  ratePlanTypeId: string;
  discount: {
    type: string;
    value: number;
  };
  id: string;
};

export type SummaryResponse = {
  name: string;
  from: number;
  to: number;
  roomCount: number;
  adultCount: number;
  childCount: number;
  location: string;
  originalPrice: number;
  basePrice: number;
  offerAmount: number;
  taxAndFees: number;
  totalAmount: number;
  taxes: string[];
};

export type ServiceListResponse = {
  services?: ServiceResponse[];
  paidPackages?: ServiceResponse[];
  complimentaryPackages?: ServiceResponse[];
  total: number;
  entityStateCounts: EntityState<string>;
  entityTypeCounts: EntityState<string>;
};

export type ServiceResponse = {
  id: string;
  name: string;
  description: string;
  rate: number;
  startDate: number;
  endDate: number;
  active: boolean;
  currency: string;
  packageCode: string;
  imageUrl: string;
  entityId: string;
  source: string;
  type: string;
  unit: string;
  autoAccept: boolean;
  hasChild: boolean;
  parentId: string;
  categoryName: string;
  enableVisibility: string[];
  taxes: any[];
};

export type MenuItemForm = {
  name: string;
  description: string;
  mealPreference: string;
  category: string;
  type: string;
  preparationTime: number;
  quantity: number;
  unit: string;
  dineInPrice: number;
  dineInPriceCurrency: string;
  deliveryPrice: number;
  deliveryPriceCurrency: string;
  hsnCode: string;
  taxes: any[];
  status: boolean;
};

export type MenuItemResponse = MenuItemForm & {
  id: string;
  code?: string;
};

export type MenuItemListResponse = {
  records: MenuItemResponse[];
  total: number;
  entityStateCounts: EntityState<string>;
  entityTypeCounts: EntityState<string>;
};

export class RoomTypeInfoRes {
  adultCount: number;
  childCount: number;
  roomCount: number;
  roomTypeId: string;
  roomNumbers: string[];
  ratePlanTypeId: string;
}

export type BookingItems = {
  roomDetails: {
    ratePlan: {
      id: string;
      basePrice: number;
      sellingPrice: number;
      type: string;
      isBase: boolean;
    }
    roomNumber: string;
    roomTypeId: string;
    roomTypeName: string;
    roomCount: number;
  }
  pricingDetails: PricingDetails;
  occupancyDetails: {
    maxChildren: number;
    maxAdult: number;
  }
  id: string;
}

export type PricingDetails = {
  max: number;
  min: number;
  base: number;
  paxChild: number;
  paxAdult: number;
  totalAmount: number;
  totalPaidAmount: number;
  totalDueAmount: number;
  taxAndFees: number;
  basePrice: number;
}
