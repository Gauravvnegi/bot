import { EntitySubType } from '@hospitality-bot/admin/shared';
import { GuestType } from 'libs/admin/guests/src/lib/types/guest.type';

export class RoomReservationFormData {
  from: number;
  to: number;
  reservationType: string;
  source: string;
  sourceName: string;
  marketSegment: string;
  paymentMethod: string;
  paymentRemark: string;
  guestId: string;
  bookingItems: BookingItemFormData[];
}

export type BookingItemFormData = {
  roomDetails: {
    ratePlan: {
      id: string;
    };
    roomTypeId: string;
    roomCount: number;
  };
  occupancyDetails: {
    maxChildren: number;
    maxAdult: number;
  };
};

export type GuestDetails = {
  label: string;
  value: string;
  cc: string;
  phoneNumber: string;
  email: string;
};

export class OutletFormData {
  adultCount: number;
  from: number;
  to: number;
  reservationType: string;
  status: string;
  source: string;
  sourceName: string;
  marketSegment: string;
  paymentMethod: string;
  totalPaidAmount: number;
  offerId: string;
  paymentRemark: string;
  eventType: string;
  guestId: string;
  guest: GuestType;
  items: ItemsData[];
  outletType: string;
}

export type ItemsData = {
  itemId: string;
  unit: number;
  amount: number;
};

export type ReservationSummary = {
  fromDate: string;
  toDate: string;
  adultCount?: number;
  outletType?: EntitySubType;
  bookingItems?: BookingItemFormData[];
  items?: ItemsData[];
};

export type OccupancyDetails = {
  adultCount: number;
  roomCount: number;
  childCount: number;
};
