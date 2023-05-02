
import {
  Option,
} from '@hospitality-bot/admin/shared';

export class InvoiceForm {
    invoiceNumber: string;
    confirmationNumber: string;
    guestName: string;
    companyName: string;
    invoiceDate: string;
    arrivalDate: string;
    departureDate: string;

    tableData: PaymentField[];
    currentAmount: number;
    discountedAmount: number;
    totalDiscount: number;
    paidAmount: number;
    dueAmount: number;

    discountType: string;
    discount: number;

    paidValue: number;
    paid: number;
  };
  
  export type PaymentField = {
    description: string;
    unit: number;
    unitValue: number;
    amount: number;
    tax: Option[];
    totalAmount: number;
  };


  