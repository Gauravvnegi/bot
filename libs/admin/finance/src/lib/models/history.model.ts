import { DateService } from '@hospitality-bot/shared/utils';
import {
  EntityStateCountsResponse,
  InvoiceHistoryResponse,
  TransactionHistoryListResponse,
  TransactionHistoryResponse,
} from '../types/history';

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
  dateAndTime: number;
  status: string;
  paymentMethod: string;
  remarks: string;
  credit: number;
  // balanceDue: string;

  deserialize(input: TransactionHistoryResponse) {
    this.transactionId = input.transactionId;
    this.dateAndTime = input.created;
    this.status = input.status;
    this.paymentMethod = input.paymentMethod;
    this.remarks = input.remarks;
    this.credit = input.amount;
    // this.balanceDue = input.balanceDue;
    return this;
  }
}

export class TransactionHistoryList {
  records: TransactionHistory[];
  total: number;
  entityStateCounts: EntityStateCounts;
  deserialize(input: TransactionHistoryListResponse) {
    this.records = input.records?.map((item) =>
      new TransactionHistory().deserialize(item)
    );
    this.total = input.total;
    this.entityStateCounts = new EntityStateCounts().deserialize(input.entityStateCounts, input.total);
    return this;
  }
}

export class EntityStateCounts {
  ALL: number;
  PAID: number;
  UNPAID: number;
  deserialize(input: EntityStateCountsResponse, total: number) {
    this.ALL = total ?? 0;
    this.PAID = input.Paid;
    this.UNPAID = input.Unpaid;
    return this;
  }
}
