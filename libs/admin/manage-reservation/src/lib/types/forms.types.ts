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
  id?: string;
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
  id?: string;
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
  tableNumberOrRoomNumber?: number;
  occupancyDetails?: {
    maxChildren?: number;
    maxAdult: number;
  };
};

export type OccupancyDetails = {
  adultCount: number;
  roomCount: number;
  childCount: number;
};

export type InitialFormData = {
  cashierFirstName?: string;
  cashierLastName?: string;
  currency?: string;
}