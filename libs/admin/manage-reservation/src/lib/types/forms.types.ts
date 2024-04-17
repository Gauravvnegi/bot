import { EntitySubType } from '@hospitality-bot/admin/shared';
import { AgentTableResponse } from 'libs/admin/agent/src/lib/types/response';
import { CompanyResponseType } from 'libs/admin/company/src/lib/types/response';
import { GuestType } from 'libs/admin/guests/src/lib/types/guest.type';
import { SessionType } from '../constants/form';

export class RoomReservationFormData {
  from: number;
  to: number;
  reservationType: string;
  source: string;
  sourceName: string;
  agentSourceName: string;
  otaSourceName: string;
  marketSegment: string;
  guestId: string;
  bookingItems: BookingItemFormData[] = [];
  id?: string;
  specialRequest: string;
  offer?: {
    id?: string;
    offerType?: string;
  };
  paymentDetails: {
    amount: number;
    paymentMethod: string;
    remarks: string;
    transactionId: string;
    cashierId: string;
  };
  paymentRule: PaymentRule;
  remarks?: string;
  printRate?: boolean;
  chargedAmount?: number;
  sessionType: string;
  slotId: string;
}

export type BookingItemFormData = {
  roomDetails: {
    ratePlan: {
      id: string;
    };
    roomTypeId: string;
    roomCount: number;
    roomTypeLabel?: string;
    roomNumbers?: string[];
    roomNumber?: string;
  };
  occupancyDetails: {
    maxChildren: number;
    maxAdult: number;
  };
  id?: string;
};

export type GuestDetails = {
  label: string;
  value: string;
  cc: string;
  phoneNumber: string;
  email: string;
};

export class OutletFormData {
  occupancyDetails: {
    maxAdult: number;
  };
  from: number;
  to: number;
  reservationType: string;
  status: string;
  source: string;
  sourceName: string;
  marketSegment: string;
  paymentMethod: string;
  pricingDetails: {
    totalPaidAmount: number;
  };
  offerId: string;
  paymentRemark: string;
  eventType: string;
  guestId: string;
  guest: GuestType;
  items: ItemsData[];
  outletType: string;
  id?: string;
  nextStates: string[];
  specialRequest: string;
}

export type ItemsData = {
  itemId: string;
  unit: number;
  amount: number;
};

export type PaymentRule = {
  amount: number;
  type: string;
  dueDate: number;
  remarks: string;
};

export type ReservationSummary = {
  from: string;
  to: string;
  adultCount?: number;
  outletType?: EntitySubType;
  bookingItems?: BookingItemFormData[];
  items?: ItemsData[];
  tableNumberOrRoomNumber?: number;
  occupancyDetails?: {
    maxChildren?: number;
    maxAdult: number;
  };
  offerId?: string;
  guestId?: string;
  source?: string;
  sourceName?: string;
  slotId?: string;
};

export type OccupancyDetails = {
  adultCount: number;
  roomCount: number;
  childCount: number;
};

export type SourceData = {
  source: string;
  sourceName: string;
  agent?: AgentTableResponse;
  marketSegment?: string;
  company?: CompanyResponseType;
};
