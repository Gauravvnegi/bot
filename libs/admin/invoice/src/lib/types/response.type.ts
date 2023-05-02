export class InvoiceResponse {
  id: string;
  cashier: string;
  invoiceCode: string;
  reservation: ReservationData;
  primaryGuest: PrimaryGuest;
  invoiceDate: number;
  invoiceGenerated: boolean;
  originalAmount: number;
  invoicePaidAmount: number;
  invoiceDueAmount: number;
  invoiceAmount: number;
  roomNumber: number;
}

interface PrimaryGuest {
  id: string;
  firstName: string;
  lastName: string;
  nameTitle: string;
  contactDetails: Contact;
  age: number;
  documentRequired: boolean;
}

interface Contact {
  cc: string;
  contactNumber: string;
  emailId: string;
}

interface ReservationData {
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
  description: string;
  unit: number;
  unitValue: number;
  transactionType: string;
  amount: number;
  itemTax: Tax[];
};

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
