import { NumberValueAccessor } from "@angular/forms";
import { InvoiceHistoryResponse } from "../types/history";
import { DateService } from "@hospitality-bot/shared/utils";

export class InvoiceHistory {
  invoiceId: string;
  bookingNumber: string;
  invoiceDate: number;
  totalBill: number;

  deserailize(input: InvoiceHistoryResponse) {
    this.invoiceId = input.invoiceCode;
    this.bookingNumber = input.bookingNumber;
    this.invoiceDate = input.invoiceDate;
    this.totalBill = input.totalAmount; 
    return this;
  }
}


export class TransactionHistory {
  transactionId: string;
  dateAndTime: string;
  status: string;
  paymentMethod: string;
  remarks: string;
  credit: number;
  balanceDue: string;

  deserialize(input) {
    this.transactionId = input.transactionId;
    this.dateAndTime = input.dateAndTime;
    this.status = input.status;
    this.paymentMethod = input.paymentMethod;
    this.remarks = input.remarks;
    this.credit = input.credit;
    this.balanceDue = input.balanceDue;
    return this;
  }
}
