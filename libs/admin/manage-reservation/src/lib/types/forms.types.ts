import { GuestType } from 'libs/admin/guests/src/lib/types/guest.type';

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
  quantity: number;
  amount: number;
};

export type OutletConfig = {};
