import { ServiceListResponse } from 'libs/admin/services/src/lib/types/response';
import { BillItem, BillSummaryData } from '../types/invoice.type';

export class Invoice {
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
  serviceIds: Set<string>;

  totalAmount: number;
  paidAmount: number;
  dueAmount: number;

  currency: string;
  cashierName: string;

  deserialize(
    input: BillSummaryData,
    data: {
      cashierName: string;
      guestName: string;
      currency: string;
    }
  ) {
    const companyDetails = input?.companyDetails;

    this.invoiceNumber = input.invoiceCode;

    this.guestName = data.guestName;

    this.companyName = companyDetails?.companyName ?? '';

    this.gstNumber = companyDetails?.gstNumber ?? '';
    this.contactName = companyDetails?.companyName ?? '';
    this.contactNumber = companyDetails?.contactNumber ?? '';
    this.email = companyDetails?.email ?? '';

    this.address = companyDetails?.address?.addressLine1 ?? '';
    this.state = companyDetails?.address?.state ?? '';
    this.city = companyDetails?.address?.city ?? '';
    this.pin = companyDetails?.address?.postalCode ?? '';
    this.additionalNote = input.remarks ?? '';

    const tableData = new TableList().deserialize(input.billItems);

    this.tableData = tableData.records;
    this.serviceIds = tableData.serviceIds;

    this.totalAmount = input.totalAmount;
    this.paidAmount = input.totalPaidAmount;
    this.dueAmount = input.totalDueAmount;

    this.currency = data.currency;
    this.cashierName = data.cashierName;

    return this;
  }
}

export class TableList {
  records: TableData[];
  serviceIds: Set<string>;
  deserialize(input: BillSummaryData['billItems']) {
    this.records = new Array<TableData>();
    this.serviceIds = new Set<string>();

    input.forEach((item) => {
      const billItem = new TableData().deserialize({ ...item });
      this.records.push(billItem);
      this.serviceIds.add(billItem.itemId);
    });

    return this;
  }
}

export class TableData {
  key: string;
  description: string;
  billItemId: string;
  unit: number;
  creditAmount: number;
  debitAmount: number;
  transactionType: BillItem['transactionType'];
  itemId: string;
  taxId: string;
  date: number;
  isNew: boolean;
  isDiscount: boolean;
  isRefund: boolean;
  isDisabled: boolean;

  deserialize(input: BillItem) {
    this.key = input.id;
    this.billItemId = input.id;
    this.description = input.description;
    this.unit = input.unit;
    this.creditAmount = input.creditAmount;
    this.debitAmount = input.debitAmount;
    this.transactionType = input.transactionType;
    this.itemId = input.itemId ?? input.id; // itemId will not be present for refund and payment
    this.taxId = input.taxId;
    this.date = input.date;
    this.isNew = false;
    this.isDisabled = !input.isAddOn || !!input.taxId || !input.itemId;
    this.isDiscount = !!input.isCoupon;
    this.isRefund = !input.itemId;

    return this;
  }
}

export class Tax {
  taxType: string;
  taxValue: number;
  id: string;

  deserialize(input) {
    this.taxType = input.taxType;
    this.taxValue = input.taxValue;
    this.id = input.id;
    return this;
  }
}

export class Service {
  value: string;
  label: string;
  amount: number;
  currency: string;
  taxes: Tax[];

  deserialize(input) {
    this.value = input.id;
    this.label = input.name;

    this.amount = input.discountedPrice ? input.discountedPrice : input.rate;
    this.taxes = input.taxes?.map((item) => new Tax().deserialize(item)) || [];

    return this;
  }
}

export class ServiceList {
  allService: Service[];

  deserialize(input: ServiceListResponse) {
    this.allService = new Array<Service>();

    input.paidPackages?.forEach((item) => {
      this.allService.push(new Service().deserialize(item));
    });

    return this;
  }
}
