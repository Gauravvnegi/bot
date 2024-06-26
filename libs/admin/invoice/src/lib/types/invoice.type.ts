import { BillItemChargeType } from './forms.types';

export type QueryConfig = {
  params: string;
};

export type BillItem = {
  id: string;
  date: number;
  description: string;
  unit: number;
  creditAmount: number;
  debitAmount: number;
  transactionType: 'DEBIT' | 'CREDIT';
  itemCode?: string;
  isAddOn?: boolean;
  itemId?: string;
  reservationItemId?: string;
  taxId?: string;
  isCoupon?: boolean;
  isRefund?: boolean;
  isRealised?: boolean;
  chargeType: BillItemChargeType;
  remarks?: string;
};

export type CompanyDetails = {
  gstNumber: string;
  contactNumber: string;
  email: string;
  companyName: string;
  id: string;
  address: {
    city: string;
    country: string;
    countryCode: string;
    state: string;
    postalCode: string;
    addressLine1: string;
    addressLine2: string;
    reservationId: string;
    guestId: string;
    guestType: string;
  };
};

export type BillSummaryData = {
  billItems: BillItem[];
  companyDetails: CompanyDetails;
  cashier: string;
  cashierId: string;
  remarks: string;
  deleteInvoiceItems: string[];
  totalAmount: number;
  totalPaidAmount: number;
  totalDueAmount: number;
  totalDiscount: number;
  refund: number;
  totalPayableAmount: number;
  invoiceCode: string;
  invoiceGenerated: boolean;
  invoiceDate: number;
  pdfUrl: string;
  isRefund?: boolean;
} & PaymentData;

export type PaymentData = {
  paymentRemarks: string;
  paymentMethod?: string;
  refundMethod?: string;
  transactionId: string;
  paymentAmount: string | number;
};
