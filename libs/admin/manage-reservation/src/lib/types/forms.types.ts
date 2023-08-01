import { C } from '@angular/cdk/keycodes';
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

export type GuestType = {
  active: boolean;
  firstName: string;
  email: string;
  cc: string;
  phoneNo: string;
  companyName: string;
  gender: string;
  dateOfBirth: string;
  age: string;
};

export class OutletFormData {
  adultCount: number;
  from: number;
  to: number;
  reservationType: string;
  source: string;
  sourceName: string;
  marketSegment: string;
  paymentMethod: string;
  totalPaidAmount: number;
  offerId: string;
  paymentRemark: string;
  eventType: string;
  guestId: string;
  items: ItemsData[];
  outletType: string;
}

type ItemsData = {
  itemId: string;
  unit: number;
  amount: number;
};

// export type RoomTypeSummary = {
//   roomTypeName: string;
//   roomTypeCount: number;
//   numberOfRooms: number;
// }
