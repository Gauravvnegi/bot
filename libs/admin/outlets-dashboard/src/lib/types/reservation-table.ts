import { EntityState, EntitySubType } from '@hospitality-bot/admin/shared';
import { KotItemsResponse, OutletPricingDetails } from './form';
import { OutletGuest } from './guest.type';
import { OrderTypes } from './menu-order';
import { MenuItemResponse } from 'libs/admin/all-outlets/src/lib/types/outlet';

export type ReservationTableListResponse = {
  total: number;
  entityTypeCounts: EntityState<string>;
  records: ReservationTableResponse[];
};

export type ReservationTableResponse = {
  id: string;
  number: string;
  status: ReservationStatus;
  type: OrderTypes;
  reservationId: string;
  items: {
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
  }[];
  entityId: string;
  createdBy: string;
  pricingDetails: OutletPricingDetails & {
    containerCharge: number;
    allowance: number;
  };
  kots: (Omit<KotItemsResponse, 'items'> & { menuItems: MenuItemResponse })[];
  guest: OutletGuest;
  reservation: PosReservationResponse;
  source: 'Offline';
};

export type PosReservationResponse = {
  id: string;
  from: number;
  to: number;
  occupancyDetails: {
    maxChildren: number;
    maxAdult: number;
  };
  specialRequest: string;
  source: string;
  sourceName: string;
  reservationNumber: string;
  status: ReservationStatus;
  tableNumberOrRoomNumber: string;
  created: number;
  updated: number;
  outletType: EntitySubType;
  systemAction: boolean;
  totalReservationAmount: number;
  printRate: boolean;
  tableIdOrRoomId: string;
  externalBooking: boolean;
};

export type ReservationStatus =
  | 'COMPLETED'
  | 'CONFIRMED'
  | 'CANCELED'
  | 'PREPARING'
  | 'BLANK_TABLE'
  | 'PAID'
  | 'RUNNING_KOT_TABLE'
  | 'RUNNING_TABLE'
  | 'PRINTED_TABLE'
  | 'DRAFT';

export type PaymentStatus = 'PAID' | 'UNPAID';

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
  | 'PRINTED_TABLE';
