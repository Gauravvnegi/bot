import { EntitySubType } from '@hospitality-bot/admin/shared';
import { MealPreferences, OrderTypes } from './menu-order';
import { ReservationStatus } from './reservation-table';

export class MenuForm {
  orderInformation: OrderInformation;
  paymentInformation: PaymentInformation;
  kotInformation: KotInformation;
}

export type OrderInformation = {
  search: string;
  tableNumber: string[];
  staff: string;
  guest: string;
  numberOfPersons: number;
  menu: string[];
  orderType: OrderTypes;
};

export type PaymentInformation = {
  complementary: boolean;
  paymentMethod: string;
  paymentRecieved: number;
  transactionId: string;
};

export type KotInformation = {
  kotItems: {
    items: KotItemsForm[];
    kotInstruction: string;
    kotOffer: string[];
    viewKotOffer?: boolean;
    viewKotInstruction?: boolean;
  }[];
};

export type KotItemsForm = {
  id: string;
  itemName: string;
  unit: number;
  mealPreference: MealPreferences;
  price: number;
  itemInstruction: string;
  image: string;
  viewItemInstruction: boolean;
};

export type MenuOrderResponse = {
  id: string;
  number: string;
  status: ReservationStatus;
  type: OrderTypes;
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
  preparedTime?: number;
};

export type CreateOrderData = {
  status: 'CONFIRMED' | 'DRAFT';
  type: OrderTypes;
  source?: string;
  kots: {
    instructions: string;
    items: {
      itemId: string;
      unit: number;
      amount: number;
      remarks: string;
    }[];
  }[];
  outletType: EntitySubType;
  guestId: string;
  reservation: {
    id?: string;
    occupancyDetails: {
      maxAdult: number;
    };
    status: 'CONFIRMED' | 'DRAFT';
    tableIds: string[];
    from?: number;
    to?: number;
    source?: string;
    sourceName?: string;
    marketSegment?: string;
  };
};

export type AddGuestForm = {
  tables: string[];
  personCount: number;
  guest: string;
  marketSegment: string;
  checkIn: number;
  checkOut: number;
  remark: string;
  outletType: string;
};

export type CreateReservationData = {
  occupancyDetails: {
    maxAdult: number;
  };
  status: ReservationStatus;
  guestId: string;
  tableIds: string[];
  from: number;
  to: number;
  source?: string;
  sourceName?: string;
  marketSegment: string;
  outletType?: string;
};

export type KotItemStatus = 'PREPARED' | 'PENDING';
