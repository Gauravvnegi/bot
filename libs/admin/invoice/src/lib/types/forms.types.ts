import { Option } from '@hospitality-bot/admin/shared';

export class InvoiceForm {
  invoiceNumber: string;
  confirmationNumber: string;
  guestName: string;
  companyName: string;
  invoiceDate: string;
  arrivalDate: string;
  departureDate: string;
  cashierName: string;
  
  tableData: PaymentField[];
  currentAmount: number;
  discountedAmount: number;
  totalDiscount: number;
  paidAmount: number;
  dueAmount: number;
  refundAmount: number;
  paid: number;
  paidValue: number;
}


export type PaymentField = {
  description: string;
  unit: number;
  unitValue: number;
  amount: number;
  tax: Option[];
  totalAmount: number;
  menu: any;
  discount: number;
  discountType: string;
  type: string;
  isDisabled: boolean;
  isSaved: boolean;
};
