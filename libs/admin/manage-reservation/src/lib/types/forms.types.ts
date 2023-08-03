import { GuestType } from 'libs/admin/guests/src/lib/types/guest.type';

export class ReservationFormData {
  // firstName: string;
  // lastName: string;
  // email: string;
  // contact: Contact;
  // guestDetails: GuestDetails;
  guestId: string;
  from: number;
  to: number;
  reservationType: string;
  source: string;
  sourceName: string;
  paymentMethod: string;
  marketSegment: string;
  address: Address;
  totalPaidAmount: number;
  paymentRemark: string;
  offerId: string;
}

export class Contact {
  countryCode: string;
  phoneNumber: string;
}

export class Address {
  addressLine1: any;
  city: string;
  state: string;
  countryCode: string;
  postalCode: string;
}

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

// export type RoomTypeSummary = {
//   roomTypeName: string;
//   roomTypeCount: number;
//   numberOfRooms: number;
// }

export type OutletConfig = {};
