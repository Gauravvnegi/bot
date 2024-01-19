import { EntityState } from '@hospitality-bot/admin/shared';
import {
  ReservationStatus,
  OrderMethod,
  PaymentStatus,
  TableStatus,
} from './reservation-table';

export type OutletReservationListResponse = {
  reservationData: OutletReservationResponse[];
  entityStateCounts: EntityState<string>;
  entityTypeCounts: EntityState<string>;
  total: number;
};

export type OutletReservationResponse = {
  name: string;
  reservationTime: string;
  adultCount: number;
  orderNumber: number;
  price: number;
  preparationTime: string;
  paymentStatus: PaymentStatus;
  numberOfItems: number;
  orderMethod: OrderMethod;
  reservationStatus: ReservationStatus;
  invoiceId: string;
  tableNumber: string;
  area: string;
  bookingNumber: string;
  date: number;
  time: string;
  paymentMethod: string;
  groupId: string;
  totalAmount: number;
  totalDueAmount: number;
  nextStates: string[];
  tableStatus: TableStatus;
};
