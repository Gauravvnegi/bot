import {
  EntityStateCountsResponse,
  EntityTypeCountsResponse,
  ReservationCurrentStatus,
} from '../models/reservations.model';
import { GuestType } from 'libs/admin/guests/src/lib/types/guest.type';
import { RatePlanRes } from 'libs/admin/room/src/lib/types/service-response';
import { ItemsData } from './forms.types';
import { JourneyState, JourneyType } from '../constants/reservation';
import { AgentTableResponse } from 'libs/admin/agent/src/lib/types/response';
import { CompanyResponseType } from 'libs/admin/company/src/lib/types/response';
import { Option } from '@hospitality-bot/admin/shared';
import { ReservationRatePlan } from 'libs/admin/room/src/lib/constant/form';
import { SessionType } from '../constants/form';

/* Reservation List Response Types deceleration */
export type ReservationListResponse = {
  records?: RoomReservationResponse[];
  total: number;
  entityStateCounts: EntityStateCountsResponse;
  entityTypeCounts: EntityTypeCountsResponse;
};

export type RoomReservationResponse = {
  id: string;
  from: number;
  to: number;
  source: string;
  reservationType: string;
  sourceName: string;
  reservationNumber: string;
  status: ReservationCurrentStatus;
  guest: GuestType;
  created: number;
  nextStates: string[];
  bookingItems?: BookingItems[];
  pricingDetails: PricingDetails;
  specialRequest: string;
  marketSegment?: string;
  journeysStatus: Record<JourneyType, JourneyState>;
  invoiceId?: string;
  agent?: AgentTableResponse;
  company?: CompanyResponseType;
  externalBooking?: boolean;
  offer?: OfferResponse;
  paymentRule?: PaymentRuleResponse;
  printRate?: boolean;
  groupCode?: string;
  sessionType: SessionType;
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
  refund?: number;
  miscellaneousCharges?: number;
  allowance?: number;
  roomCharges?: number;
};

export type SummaryPricing = {
  totalAmount: number;
  totalPaidAmount: number;
  totalDueAmount: number;
  taxAndFees: number;
};

export type PaymentRuleResponse = {
  id: string;
  amount: number;
  dueDate: number;
  remarks: string;
  type: string;
  depositNight: number;
  payAtDesk: boolean;
  label: string;
};

export type SourceResponse = {
  name: string;
  type?: { code: string; label: string }[];
};

export type OfferResponse = {
  id?: string;
  created?: number;
  updated?: number;
  offerType: string;
  discountType?: string;
  discountValue?: number;
};

export type RoomUpgradeType = {
  roomTypeId: string;
  ratePlanId: string;
  roomNumber: string;
  chargeable: boolean;
  chargedAmount: number;
  remarks: string;
  effectiveDate: number;
  ratePlans: ReservationRatePlan[];
  rooms: Option[];
};

export type BookingSlotPrice = {
  id: string;
  slotId: string;
  inventoryId: string;
  price: number;
  entityId: string;
};

export type BookingSlotResponse = {
  id: string;
  duration: number;
  status: boolean;
  entityId: string;
  bookingSlotPrices: BookingSlotPrice[];
};
