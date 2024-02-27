import { EntitySubType, Option } from '@hospitality-bot/admin/shared';
import { MealPreferences, OrderTypes } from './menu-order';
import { KotMenuItem, ReservationStatus } from './reservation-table';
import { AddressFieldType } from 'libs/admin/guests/src/lib/types/guest.type';

export class MenuForm {
  orderInformation: OrderInformation;
  paymentInformation: PaymentInformation;
  kotInformation: KotInformation;
}

export type OrderInformation = {
  search: string;
  tableNumber?: string;
  staff?: string;
  guest: string;
  numberOfPersons?: number;
  menu: string[];
  orderType: OrderTypes;
  address?: AddressFieldType;
  id?: string;
  areaId?: string;
};

export type PaymentInformation = {
  paymentMethod: string;
  paymentRecieved: number;
  transactionId: string;
};

export type KotInformation = {
  kotItems: KotForm[];
};

export type KotForm = {
  items: KotItemsForm[];
  kotInstruction: string;
  kotOffer: string;
  viewKotOffer?: boolean;
  viewKotInstruction?: boolean;
  id?: string;
  selectedOffer?: Option;
  itemOffers?: Option[];
};

export type KotItemsForm = {
  id?: string;
  itemName: string;
  unit: number;
  mealPreference: MealPreferences;
  price: number;
  itemInstruction: string;
  image: string;
  viewItemInstruction: boolean;
  itemId?: string;
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
  items: KotMenuItem[];
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
  offer?: {
    id?: string;
  };
  outletType: EntitySubType;
  guestId: string;
  deliveryAddress?: string;
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
    areaId?: string;
  };
  paymentDetails?: {
    paymentMethod: string;
    amount: number;
    transactionId: string;
  };
};

export type AddGuestForm = {
  tables: string; //@multipleTableBooking: need to change string[] for multiple table booking
  personCount: number;
  guest: string;
  marketSegment: string;
  checkIn: number;
  checkOut: number;
  remark: string;
  outletType: string;
  areaId: string;
  seated: boolean;
  sourceName: string;
  source: string;
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
  areaId: string;
  currentJourney: string;
  specialRequest: string;
};

export type KotItemStatus = 'PREPARED' | 'PENDING';
