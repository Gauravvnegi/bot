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
  invoiceId: string;
  invoiceNumber: string;
  confirmationNumber: string;
  guestName: string;
  companyName: string;

  gstNumber: string;
  contactName: string;
  contactNumber: string;
  email: string;
  address: string;
  state: string;
  city: string;
  pin: string;

  additionalNote: string;
  tableData: TableData[];

  currentAmount: number;
  discountedAmount: number;
  totalDiscount: number;
  paidAmount: number;
  dueAmount: number;

  currency: string;
  refundAmount: number;

  cashierName: string;
  paymentMethod: string;
  receivedPayment: number;
  remarks: string;
  transactionId: string;

  deserialize(input: InvoiceResponse, data: { cashierName: string }) {
    this.invoiceId = input.id;
    this.invoiceNumber = input.invoiceCode;
    this.confirmationNumber = input.reservation.number;
    this.guestName =
      (input.primaryGuest.firstName ?? '') +
      (input.primaryGuest.lastName ?? '');
    this.companyName = input.companyDetails?.companyName ?? '';
    this.gstNumber = input.companyDetails?.gstNumber ?? '';
    this.contactName = input.companyDetails?.contactName ?? '';
    this.contactNumber = input.companyDetails?.contactNumber ?? '';
    this.email = input.companyDetails?.email ?? '';
    this.address = input.companyDetails?.address.addressLine1 ?? '';
    this.state = input.companyDetails?.address.state ?? '';
    this.city = input.companyDetails?.address.city ?? '';
    this.pin = input.companyDetails?.address.postalCode ?? '';
    this.additionalNote = '';

    this.tableData = new TableList().deserialize(input.itemList).records;

    this.currentAmount = 0;
    this.totalDiscount = 0;

    // calculation below
    this.tableData.map((item) => {
      if (item.type === 'discount') {
        this.totalDiscount = item.totalAmount + this.totalDiscount;
      }
      if (item.type === 'price') {
        this.currentAmount = item.totalAmount + this.currentAmount;
      }
    });

    this.discountedAmount = input.invoiceAmount;
    this.paidAmount = input.reservation.totalPaidAmount;
    this.dueAmount = input.invoiceDueAmount;

    this.currency = 'INR';
    this.refundAmount = 0;

    this.cashierName = data.cashierName;
    this.paymentMethod = '';
    this.receivedPayment = null;
    this.remarks = '';
    this.transactionId = '';

    return this;
  }
}

export class TableList {
  records: TableData[];
  deserialize(input: InvoiceResponse['itemList']) {
    this.records = new Array<TableData>();


    input.forEach((item) => {
      const taxRate =
        item.itemTax.reduce((acc, val) => acc + val.taxValue, 0) ?? 0;
      const amount = item.unit * item.amount;

      const key = `${Date.now()}-${item.id}`;

      const priceItem = this.getTableData({
        key:key,
        description: item.id,
        unit: item.unit,
        unitValue: item.amount,
        amount: amount,
        tax: item.itemTax.map((tax) => tax.id),
        totalAmount: amount + (amount * taxRate) / 100,
        type: 'price',
        isDisabled: !item.isAddOn,
        discountState: item.discount ? 'applied' : 'notApplied',
      });

      this.records.push(priceItem);

      if (item.discount) {
        const discountItem = this.getTableData({
          key:key,
          description: 'Discount',
          discountType: item.discount.type,
          discount: item.discount.value,
          type: 'discount',
          totalAmount:
            item.discount.type === 'FLAT'
              ? item.discount.value
              : amount * (item.discount.value / 100),
          isDisabled: true,
        });
        this.records.push(discountItem);
      }
    });

    return this;
  }

  getTableData(data: Partial<TableData>) {
    const res: TableData = {
      key:'',
      description: '',
      unit: 0,
      unitValue: 0,
      amount: 0,
      tax: [],
      totalAmount: 0,
      discount: 0,
      discountType: 'PERCENT',
      type: 'price',
      isDisabled: false,
      discountState: 'notApplied',
      ...data,
    };
    return res;
  }
}
export type TableData = {
  key: string;
  description: string;
  unit: number;
  unitValue: number;
  amount: number;
  tax: string[];
  totalAmount: number;
  discount: number;
  discountType: 'FLAT' | 'PERCENT';
  type: 'price' | 'discount';
  isDisabled: boolean;
  discountState: 'notApplied' | 'editing' | 'applied';
};

export class Service {
  value: string;
  label: string;
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
    this.value = input.id;
    this.label = input.name;
    this.code = input.packageCode;
    this.source = input.source;
    this.type = input.type;
    this.amount = input.discountedPrice ? input.discountedPrice : input.rate;
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
      input.paidPackages?.map((item) => new Service().deserialize(item)) ?? [];
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


