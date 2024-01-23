import { EntityState } from '@hospitality-bot/admin/shared';
import {
  OutletReservationListResponse,
  OutletReservationResponse,
} from '../types/outlet.response';
import {
  ReservationStatus,
  PaymentStatus,
  TableStatus,
} from '../types/reservation-table';

export class OutletReservationList {
  reservationData: OutletReservation[];
  entityStateCounts: EntityState<string>;
  entityTypeCounts: EntityState<string>;
  total: number;
  deserialize(input: OutletReservationListResponse) {
    this.reservationData = (input?.reservationData ?? []).map((item) =>
      new OutletReservation().deserialize(item)
    );
    this.entityStateCounts = input.entityStateCounts;
    this.entityTypeCounts = input.entityTypeCounts;
    this.total = input.total;
    return this;
  }
}

export class OutletReservation {
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
  guestName: string;
  adultCount: number;
  orderNumber: number;
  price: number;
  preparationTime: string;
  paymentStatus: PaymentStatus;
  reservationStatus: ReservationStatus;
  numberOfItems: number;
  orderMethod: string;
  tableStatus: TableStatus;

  deserialize(input: OutletReservationResponse) {
    this.invoiceId = input?.invoiceId;
    this.area = input?.area;
    this.bookingNumber = input?.bookingNumber;
    this.date = input?.date;
    this.time = input?.reservationTime;
    this.paymentMethod = input?.paymentMethod;
    this.groupId = input?.groupId;
    this.totalAmount = input?.totalAmount;
    this.totalDueAmount = input?.totalDueAmount;
    this.nextStates = input?.nextStates;
    this.guestName = input?.name;
    this.adultCount = input?.adultCount;
    this.orderNumber = input?.orderNumber;
    this.reservationStatus = input?.reservationStatus;
    this.price = input?.price;
    this.preparationTime = input?.preparationTime;
    this.tableNumber = input?.tableNumber;
    this.paymentStatus = input?.paymentStatus;
    this.numberOfItems = input?.numberOfItems;
    this.orderMethod = input?.orderMethod;
    this.tableStatus = input?.tableStatus;
    return this;
  }
}
