import { DateService } from '@hospitality-bot/shared/utils';
import {
  EntityStateCountsResponse,
  InvoiceHistoryListResponse,
  InvoiceHistoryResponse,
  TransactionHistoryListResponse,
  TransactionHistoryResponse,
} from '../types/history';
import { EntityState } from '@hospitality-bot/admin/shared';

export class InvoiceHistory {
  invoiceId: string;
  bookingNumber: string;
  invoiceDate: number;
  totalBill: number;

  deserialize(input: InvoiceHistoryResponse) {
    this.invoiceId = input?.invoiceCode ?? '';
    this.bookingNumber = input?.bookingNumber ?? '';
    this.invoiceDate = input?.invoiceDate ?? 0;
    this.totalBill = input?.totalAmount ?? 0;
    return this;
  }
}

export class InvoiceHistoryList {
  records: InvoiceHistory[];
  total: number;

  deserialize(input: InvoiceHistoryListResponse) {
    this.records = input.records?.map((item) =>
      new InvoiceHistory().deserialize(item)
    );
    this.total = input.total;
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
    this.transactionId = input.transactionId ?? '';
    this.dateAndTime = input.created ?? 0;
    this.status = input.status ?? '';
    this.paymentMethod = input.paymentMethod ?? '';
    this.remarks = input.remarks ?? '';
    this.credit = input.amount ?? 0;
    // this.balanceDue = input.balanceDue;
    return this;
  }
}

export class TransactionHistoryList {
  records: TransactionHistory[];
  totalRecords: number;
  entityStateCounts: EntityState<string>;
  entityTypeCounts: EntityState<string>
  deserialize(input: TransactionHistoryListResponse) {
    this.records = input.records?.map((item) =>
      new TransactionHistory().deserialize(item)
    ) ?? [];
    this.totalRecords = input.total;
    this.entityStateCounts = input.entityStateCounts;
    this.entityTypeCounts = input.entityTypeCounts
    return this;
  }
}

// export class EntityStateCounts {
//   ALL: number;
//   PAID: number;
//   UNPAID: number;
//   deserialize(input: EntityStateCountsResponse, total: number) {
//     this.ALL = total ?? 0;
//     this.PAID = input.Paid;
//     this.UNPAID = input.Unpaid;
//     return this;
//   }
// }
