import { EntitySubType } from '@hospitality-bot/admin/shared';
import { MealPreferences, OrderTypes } from './menu-order';
import { KotMenuItem, OrderReservationStatus } from './reservation-table';
import { ReservationType } from '../components/add-guest-list/add-guest-list.component';

export class MenuForm {
  reservationInformation: ReservationInformation;
  paymentInformation: PaymentInformation;
  kotInformation: KotInformation;
  paymentSummary: OrderPaymentSummary;
  offer: string;
}

export type ReservationInformation = {
  search: string;
  tableNumber?: string;
  staff?: string;
  guest: string;
  numberOfPersons?: number;
  menu?: string[];
  orderType: OrderTypes;
  address?: string;
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
  viewKotInstruction?: boolean;
  id?: string;
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
  status: ReservationType;
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

export type OrderPaymentSummary = {
  totalCharge: number;
  totalContainerCharge: number;
  totalDiscount: number;
  totalPayable: number;
  totalPaidAmount: number;
  remainingBalance: number;
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
  dueAmount: number;
  taxAndFees: number;
  payableAmount: number;
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
  status: OrderReservationStatus;
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
    currentJourney?: string;
  };
  paymentDetails?: {
    paymentMethod: string;
    amount: number;
    transactionId: string;
  };
  containerCharge?: number;
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
  reservationType: string;
};

export type CreateReservationData = {
  occupancyDetails: {
    maxAdult: number;
  };
  status: ReservationType;
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
