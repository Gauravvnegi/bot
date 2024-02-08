import { OrderMethod, ReservationStatus } from './reservation-table';

export type MenuForm = {
  orderInformation: OrderInformation;
};

export type OrderInformation = {
  search: string;
  tableNumber: string[];
  staff: string;
  guest: string;
  numberOfPersons: string;
  menu: string[];
  orderType: string;
};

export type MenuOrderResponse = {
  id: string;
  number: string;
  status: ReservationStatus;
  type: OrderMethod;
  items: MenuItemResponse[];
  entityId: string;
  createdBy: string;
  pricingDetails: OutletPricingDetails;
  kots: KotItemsResponse[];
  source: string;
};

export type MenuItemResponse = {
  id: string;
  amount: number;
  description: string;
  remarks?: string;
  transactionType: 'Debit' | 'Credit';
  unit: number;
  type: ItemType;
  currency?: string;
  itemId: string;
  kotId?: string;
};

export type ItemType = 'ITEM_CHARGE' | 'ITEM_TAX' | 'PAID';

export type OutletPricingDetails = {
  paxChildBelowFive: number;
  paxChildAboveFive: number;
  paxChild: number;
  paxAdult: number;
  paxDoubleOccupancy: number;
  paxTripleOccupancy: number;
  totalAmount: number;
  totalPaidAmount: number;
  totalDueAmount: number;
  taxAndFees: number;
  taxAndFeesPerDay: number;
  basePrice: number;
  discountedAmount: number;
};

export type KotItemsResponse = {
  id: string;
  number: string;
  status: KotItemStatus;
  instructions: string;
  items: MenuItemResponse[];
  preparedTime?: 387126;
};

export type KotItemStatus = 'PREPARED' | 'PENDING';
