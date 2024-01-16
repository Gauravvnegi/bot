import { Option } from '@hospitality-bot/admin/shared';
import { Invoice, Service, TableData } from '../models/invoice.model';

export type InvoiceForm = Omit<Invoice, 'deserialize' | 'serviceIds'>;

export type BillItemFields = Omit<TableData, 'deserialize'>;

export type PaymentForm = {
  remarks: string;
  paymentMethod?: string;
  receivedPayment: number;
  refundMethod?: string;
  transactionId: string;
};

export type UseForm = InvoiceForm & PaymentForm;

export type DescriptionOption = Option & Partial<Service>;

export type ChargesType = 'discount' | 'refund' | 'miscellaneous' | 'other';

export type BillItemChargeType =
  | 'ROOM'
  | 'TAX'
  | 'DISCOUNT'
  | 'MISCELLANEOUS'
  | 'REFUND'
  | 'PAYMENT'
  | 'EARLY_CHECKIN'
  | 'LATE_CHECKOUT'
  | 'SERVICE'
  | 'ALLOWANCE';
