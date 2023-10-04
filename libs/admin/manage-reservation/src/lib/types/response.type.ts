import {
  EntityStateCountsResponse,
  EntityTypeCountsResponse,
} from '../models/reservations.model';
import { GuestType } from 'libs/admin/guests/src/lib/types/guest.type';
import { RatePlanRes } from 'libs/admin/room/src/lib/types/service-response';
import { ItemsData } from './forms.types';
import { JourneyState } from '../constants/reservation';

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
  bookingItems?: BookingItems[];
  pricingDetails: PricingDetails;
  specialRequest: string;
  marketSegment?: string;
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

export type SummaryResponse = {
  bookingItems?: BookingItems[];
  items?: ItemsData[];
  from: number;
  to: number;
  occupancyDetails?: { maxAdult: number };
  location: string;
  pricingDetails: PricingDetails;
  offer: { discountedPrice: number };
};

export type BookingItems = {
  roomDetails: {
    ratePlan: RatePlanRes;
    roomNumber: string;
    roomTypeId: string;
    roomTypeLabel: string;
    roomCount: number;
  };
  pricingDetails: PricingDetails;
  occupancyDetails: {
    maxChildren: number;
    maxAdult: number;
  };
  offer?: {
    id: string;
    discountedPrice: number;
    offerType: string;
  };
  id?: string;
};

export type BookingItemsSummary = {
  ratePlan: RatePlanRes;
  roomNumber: string;
  roomTypeId: string;
  roomTypeLabel: string;
  roomCount: number;
  totalPaidAmount: number;
  totalAmount: number;
  taxAndFees: number;
  basePrice: number;
  totalDueAmount: number;
  maxChildren: number;
  maxAdult: number;
  min: number;
  max: number;
  base: number;
  id: string;
  offerId?: string;
  discountedPrice?: string;
};

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
  discountedAmount?: number;
};

export type SummaryPricing = {
  totalAmount: number;
  totalPaidAmount: number;
  totalDueAmount: number;
  taxAndFees: number;
};

export type RoomReservationResponse = {
  id: string;
  from: number;
  to: number;
  totalAmount: number;
  source: string;
  reservationType: string;
  sourceName: string;
  marketSegment: string;
  totalPaidAmount: number;
  totalDueAmount: number;
  reservationNumber: string;
  status: string;
  guest: GuestType;
  created: number;
  offerAmount: number;
  nextStates: string[];
  bookingItems: BookingItems[];
  pricingDetails?: PricingDetails;
  specialRequest: string;
  offer: {
    id: string;
    created: number;
    updated: number;
    offerType: string;
  };
  journeysStatus: {
    CHECKIN: JourneyState;
  };
};

export type SourceResponse = {
  name: string;
  type?: { code: string; label: string }[];
};
