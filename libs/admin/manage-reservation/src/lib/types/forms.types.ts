import { C } from '@angular/cdk/keycodes';

export type InvoiceForm = {
  invoiceNumber: string;
  confirmationNumber: string;
  guestName: string;
  companyName: string;
  invoiceDate: string;
  arrivalDate: string;
  departureDate: string;
  roomNumber: string;
  roomType: string;
  adults: string;
  children: string;
};

export type PaymentField = {
  description: string;
  unit: number;
  unitPrice: number;
  amount: number;
  tax: string;
  totalAmount: number;
};

export type PaymentForm = {
  table: {
    de;
  };
};

export class ReservationFormData {
  firstName: string;
  lastName: string;
  email: string;
  contact: Contact;
  roomTypeId: string;
  adultCount: number;
  childCount: number;
  roomCount: number;
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
