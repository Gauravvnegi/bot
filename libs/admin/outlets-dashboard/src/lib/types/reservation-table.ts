import { EntityState, EntitySubType } from '@hospitality-bot/admin/shared';
import { KotItemsResponse, OutletPricingDetails } from './form';
import { OrderTypes } from './menu-order';
import { MenuItemResponse } from 'libs/admin/all-outlets/src/lib/types/outlet';
import { GuestType } from 'libs/admin/guests/src/lib/types/guest.type';

export type ReservationTableListResponse = {
  total: number;
  entityTypeCounts: EntityState<string>;
  entityStateCounts: EntityState<string>;
  records: PosOrderResponse[];
};

export type PosOrderResponse = {
  id: string;
  number: string;
  status: OrderReservationStatus;
  type: OrderTypes;
  reservationId: string;
  items: KotMenuItem[];
  entityId: string;
  createdBy: string;
  deliveryAddress?: {
    addressLine1: string;
    city: string;
    state: string;
    countryCode: string;
    postalCode: string;
    id?: string;
  };
  pricingDetails: OutletPricingDetails & {
    containerCharge: number;
    allowance: number;
  };
  offer?: { id?: string };
  kots: KotItemsResponse[];
  guest?: GuestType;
  reservation?: Omit<PosReservationResponse, 'order'>;
  source: 'Offline';
  nextStates: string[];
  selectedOffer: OrderOffer;
};

export type PosReservationResponse = {
  id: string;
  from: number;
  to: number;
  occupancyDetails?: {
    maxChildren: number;
    maxAdult: number;
  };
  deliveryAddress?: {
    addressLine1: string;
    city: string;
    state: string;
    countryCode: string;
    postalCode: string;
    id?: string;
  };
  specialRequest: string;
  source: string;
  sourceName: string;
  reservationNumber: string;
  status: OrderReservationStatus;
  tableNumberOrRoomNumber: string;
  created: number;
  updated: number;
  outletType: EntitySubType;
  systemAction: boolean;
  totalReservationAmount: number;
  printRate: boolean;
  tableIdOrRoomId: string;
  externalBooking: boolean;
  guest: GuestType;
  areaId: string;
  areaName: string;
  order?: Omit<PosOrderResponse, 'reservation'>;
};

export type KotMenuItem = {
  id: string;
  amount: number;
  description: string;
  remarks?: string;
  transactionType: string;
  unit: number;
  type: string;
  currency: string;
  itemId: string;
  kotId?: string;
  parentItem: string;
  menuItem?: MenuItemResponse;
};

export type PaymentStatus = 'PAID' | 'UNPAID';

export type OrderReservationStatus =
  | 'COMPLETED'
  | 'CONFIRMED'
  | 'CANCELED'
  | 'DRAFT';

export type PaymentData = {
  icon: string;
  text: string;
};

export type ReservationStatusData = {
  borderColor: string;
};

export type TableStatus =
  | 'RUNNING_KOT_TABLE'
  | 'RUNNING_TABLE'
  | 'PRINTED_TABLE'
  | 'VACANT_TABLE';

export type OrderOffer = {
  label: string;
  value: string;
  offerDescription?: string;
  validDate?: number;
  discountType?: string;
  discountValue?: string;
};
