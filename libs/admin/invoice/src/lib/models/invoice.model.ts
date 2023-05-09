import {
  EntityStateCountsResponse,
  InvoiceResponse,
  Item,
  ItemList,
  PaymentHistoryListRespone,
  PaymentHistoryResponse,
  Tax,
} from '../types/response.type';
import { Option } from '@hospitality-bot/admin/shared';
export class Invoice {
  invoiceDate: number;
  arrivalDate: number;
  guestName: string;
  departureDate: number;
  currentAmount: number;
  paidAmount: number;
  paidValue: number;
  dueAmount: number;
  discountedAmount: number;
  totalDiscount: number;

  deserialize(input: InvoiceResponse) {
    this.invoiceDate = input.invoiceDate;
    this.guestName = input.primaryGuest.firstName;
    this.arrivalDate = input.reservation.arrivalTime;
    this.departureDate = input.reservation.departureTime;
    this.currentAmount = input.invoiceAmount;
    this.paidAmount = input.invoicePaidAmount;
    this.paidValue = input.invoicePaidAmount;
    this.totalDiscount = input.originalAmount;
    this.dueAmount = input.invoiceDueAmount;
    this.discountedAmount = input.invoiceAmount;
    return this;
  }
}

export class TableData {
  id: string;
  description: Option;
  unitValue: number;
  unit: number;
  amount: number;
  tax: Option[];
  totalAmount: number;
  discountType: string;
  discount: number;

  deserialize(input: Item) {
    this.description = {
      label: input.description,
      value: input.id,
      amount: 0,
      taxes: [],
    };
    this.unitValue = input.perUnitPrice;
    this.unit = input.unit;
    this.amount = input.unit * input.perUnitPrice;
    this.totalAmount = input.amount;
    this.tax = input.itemTax.map((tax) => ({
      label: `${tax.taxType} ${tax.taxValue}%`,
      value: tax.id,
    }));
    this.discountType = input.discount?.type || '';
    this.discount = input.discount?.value || 0;
    return this;
  }
}

export class TableDataList {
  records: TableData[];
  deserialize(input) {
    this.records = new Array<TableData>();
    input.forEach((item) =>
      this.records.push(new TableData().deserialize(item))
    );
    return this;
  }
}

export class Service {
  id: string;
  name: string;
  code: string;
  source: string;
  type: string;
  amount: number;
  currency: string;
  taxes: Tax[];
  category: string;
  status: boolean;
  unit: string;

  deserialize(input) {
    this.id = input.id;
    this.name = input.name;
    this.code = input.packageCode;
    this.source = input.source;
    this.type = input.type;
    this.amount = input.rate;
    this.taxes =
      input.taxes?.map((item) => ({
        taxType: item.taxType,
        taxValue: item.taxValue,
        id: item.id,
      })) || [];
    this.currency = input.currency;
    this.category = input.categoryName;
    this.status = input.active;
    this.unit = input.unit;
    return this;
  }
}

export class ServiceList {
  allService: Service[];

  deserialize(input) {
    this.allService =
      input.services?.map((item) => new Service().deserialize(item)) ?? [];
    return this;
  }
}

export class PaymentHistory {
  id: string;
  amount: number;
  transactionId: string | null;
  status: string;
  reservationId: string | null;
  created: number;
  paymentMethod: string | null;
  remarks: string | null;

  deserialize(input: PaymentHistoryResponse) {
    this.id = input.id;
    this.amount = input.amount;
    this.transactionId = input.transactionId;
    this.status = input.status;
    this.reservationId = input.reservationId;
    this.created = input.created;
    this.paymentMethod = input.paymentMethod;
    this.remarks = input.remarks;
    return this;
  }
}

export class PaymentHistoryList {
  paymentHistoryData: PaymentHistory[];
  total: number;
  entityStateCounts: EntityStateCounts;

  deserialize(input: PaymentHistoryListRespone) {
    this.paymentHistoryData =
      input.paymentHistoryData.map((item) =>
        new PaymentHistory().deserialize(item)
      ) ?? [];
    this.total = input.total;
    this.entityStateCounts = new EntityStateCounts().deserialize(
      input.entityStateCounts,
      this.total
    );
    return this;
  }
}

export class EntityStateCounts {
  ALL: number;
  PAID: number;
  UNPAID: number;

  deserialize(input: EntityStateCountsResponse, total: number) {
    this.ALL = total ?? 0;
    this.PAID = input.PAID;
    this.UNPAID = input.UNPAID;
    return this;
  }
}
