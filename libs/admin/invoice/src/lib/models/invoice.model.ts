import { ServiceListResponse } from 'libs/admin/services/src/lib/types/response';
import { BillItem, BillSummaryData } from '../types/invoice.type';
import {
  MenuItemListResponse,
  MenuItemResponse,
} from 'libs/admin/all-outlets/src/lib/types/outlet';
import { BillItemChargeType } from '../types/forms.types';

export class Invoice {
  invoiceNumber: string;
  confirmationNumber: string;
  guestName: string;
  companyName: string;
  arrivalDate: number;
  departureDate: number;

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
  discountedAmount: number;
  netAmount: number;
  refund: number;

  currency: string;
  cashierName: string;
  cashierId: string;

  deserialize(
    input: BillSummaryData,
    data: {
      cashierId: string;
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
    this.discountedAmount = input.totalDiscount;
    this.dueAmount = input.totalDueAmount;
    this.netAmount = input.totalPayableAmount;
    this.refund = input?.refund ?? 0;
    this.currency = data.currency;
    this.cashierName = data.cashierName;
    this.cashierId = data?.cashierId;
    return this;
  }
}

export class TableList {
  records: TableData[];
  serviceIds: Set<string>;
  deserialize(input: BillSummaryData['billItems']) {
    this.records = new Array<TableData>();
    this.serviceIds = new Set<string>();

    /**
     * Logic Here
     * Tax has id of main-item as itemId
     * Discount has itemId of main-item as itemId
     */
    const idOfItemIdRecord = input.reduce((value, item) => {
      if (item.isCoupon || item.isRefund || item.taxId) {
        return value;
      }
      return {
        ...value,
        [item.itemId]: item.id,
      };
    }, {});

    input.forEach((item) => {
      const billItem = new TableData().deserialize(
        { ...item },
        idOfItemIdRecord
      );
      this.records.push(billItem);

      if (!billItem.isRealised) {
        this.serviceIds.add(billItem.itemId);
      }
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
  isNonEditableBillItem: boolean;
  isDisabled: boolean;
  isAddOn: boolean;
  isMiscellaneous: boolean;
  reservationItemId: string;
  isRefund: boolean;
  discountType?: string;
  discountValue?: number;
  isRealised?: boolean;
  chargeType?: BillItemChargeType;
  remarks?: string;

  deserialize(input: BillItem, idOfItemIdRecord: Record<string, string>) {
    let reservationId = input.id;
    if (input?.taxId) {
      reservationId = input.itemId;
    }
    if (input?.isCoupon) {
      reservationId = idOfItemIdRecord[input.itemId];
    }

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
    this.isDisabled = !input.isAddOn || !!input.taxId;
    this.isDiscount = !!input.isCoupon;
    this.isNonEditableBillItem = !input.itemId;
    this.isMiscellaneous = !input.itemId && !input.isCoupon;
    this.isAddOn = input.isAddOn;
    this.reservationItemId = reservationId;
    this.isRefund = input?.isRefund;
    this.isRealised = input?.isRealised;
    this.chargeType = input?.chargeType;
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

export class MenuItems {
  value: string;
  label: string;
  amount: number;
  currency: string;
  taxes: Tax[];

  deserialize(input: MenuItemResponse) {
    this.value = input.id;
    this.label = input.name;

    this.amount = input.dineInPrice;
    this.taxes = input.taxes?.map((item) => new Tax().deserialize(item)) || [];

    return this;
  }
}

export class MenuItemsList {
  menuItems: MenuItems[];

  deserialize(input: MenuItemListResponse) {
    this.menuItems = new Array<MenuItems>();

    input.records?.forEach((item) => {
      this.menuItems.push(new MenuItems().deserialize(item));
    });

    return this;
  }
}

export class Service {
  value: string;
  label: string;
  amount: number;
  currency: string;
  taxes: Tax[];
  extras?: string;
  itemAmount?: number;

  deserialize(input) {
    this.value = input.id;
    this.label = input.name;
    this.extras = `Code - ${input?.packageCode}`;
    this.amount = input.discountedPrice ? input.discountedPrice : input.rate;
    this.taxes = input.taxes?.map((item) => new Tax().deserialize(item)) || [];
    this.itemAmount = input.discountedPrice
      ? input.discountedPrice
      : input.rate;
    return this;
  }
}

export class ServiceList {
  allService: Service[];

  deserialize(input: ServiceListResponse, removeIds: Set<string>) {
    this.allService = new Array<Service>();

    input?.paidPackages?.forEach((item) => {
      if (!removeIds.has(item.id))
        this.allService.push(new Service().deserialize(item));
    });

    return this;
  }
}
