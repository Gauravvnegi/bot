export class InvoiceResponse {
  id: string;
  reservation: ReservationData;
  companyDetails: CompanyDetails;
  invoiceCode: string;
  primaryGuest: PrimaryGuest;
  invoiceDate: number;
  invoiceGenerated: boolean;
  originalAmount: number;
  invoicePaidAmount: number;
  invoiceDueAmount: number;
  invoiceAmount: number;
  roomNumber: number;
}

type CompanyDetails = {
  id: string;
  companyName: string;
  email: string;
  address : Address;
  contactNumber: string;
  gstNumber: string;
}

type Address = {
  created: number;
  updated: number;
  id: string;
  city: string;
  country: string;
  countryCode: string;
  postalCode: string;
  addressLine1: string;
  addressLine2: string;
  state: string;
  reservationId: string;
  guestId: string | null;
  guestType: string;
}

type PrimaryGuest = {
  id: string;
  firstName: string;
  lastName: string;
  nameTitle: string;
  contactDetails: Contact;
  age: number;
  documentRequired: boolean;
}

type Contact = {
  cc: string;
  contactNumber: string;
  emailId: string;
}

type ReservationData = {
  arrivalTime: number;
  departureTime: number;
  number: string;
  stateCompletedSteps: number;
  totalRoomCount: number;
  totalDueAmount: number;
  totalPaidAmount: number;
  totalAmount: number;
  invoicePrepareRequest: boolean;
  vip: boolean;
}

export type ItemList = {
  items: Item[];
};

export type Item = {
  id: string;
  created: number;
  updated: number;
  description: string;
  unit: number;
  billDate: number;
  perUnitPrice: number;
  transactionType: string;
  amount: number;
  discount?: Discount;
  itemTax: Tax[];
};

export type Discount = {
  type?: string;
  value?: number;
}

export type Tax = {
  created: number;
  updated: number;
  id: string;
  country: string;
  taxType: string;
  taxValue: number;
  category: string;
  status: boolean;
};

export type PaymentHistoryResponse = {
  id: string;
  amount: number;
  transactionId: string | null;
  status: string;
  reservationId: string | null;
  created: number;
  paymentMethod: string | null;
  remarks: string | null;
};

export type PaymentHistoryListRespone = {
  paymentHistoryData: PaymentHistoryResponse[];
  total: number;
  entityStateCounts: EntityStateCountsResponse;
};

export type EntityStateCountsResponse = {
  ALL: number;
  PAID: number;
  UNPAID: number;
};
