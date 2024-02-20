import { EntityState } from '@hospitality-bot/admin/shared';
import {
  OutletReservationListResponse,
  OutletReservationResponse,
} from '../types/outlet.response';
import {
  ReservationStatus,
  PaymentStatus,
  TableStatus,
  ReservationTableListResponse,
  ReservationTableResponse,
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
    this.orderMethod = input?.orderMethod
      .toLowerCase()
      .split('_')
      .map((word) => word?.charAt(0)?.toUpperCase() + word?.slice(1))
      .join('-');
    this.tableStatus = input?.tableStatus;
    return this;
  }
}

export class OutletReservationTableList {
  reservationData: OutletReservationTable[];
  entityTypeCounts: EntityState<string>;
  total: number;
  deserialize(input: ReservationTableListResponse) {
    this.reservationData =
      input.records.map((item) =>
        new OutletReservationTable().deserialize(item)
      ) ?? [];
    this.entityTypeCounts = input.entityTypeCounts;
    this.total = input.total;
    return this;
  }
}

export class OutletReservationTable {
  invoiceId: string;
  tableNumber: string;
  area: string;
  bookingNumber: string;
  date: number;
  time: string;
  paymentMethod: string;
  totalAmount: number;
  totalDueAmount: number;
  nextStates: string[];
  guestName: string;
  reservationStatus: ReservationStatus;
  orderId: string;

  deserialize(input: ReservationTableResponse) {
    this.orderId = input?.id;
    this.area = 'A1';
    this.bookingNumber = input?.reservation?.reservationNumber ?? input?.number;
    this.date = input?.reservation?.from;
    // this.time = input?.reservation.;
    // this.paymentMethod = ;
    this.totalAmount = input?.pricingDetails?.totalAmount;
    this.totalDueAmount = input.pricingDetails?.totalDueAmount;
    this.nextStates = ['DRAFT'];
    const { firstName, lastName } = input?.guest || {};
    this.guestName = firstName
      ? lastName
        ? `${firstName} ${lastName}`
        : firstName
      : lastName || '';
    this.reservationStatus = input?.reservation?.status;
    this.tableNumber = input?.reservation?.tableNumberOrRoomNumber;
    this.paymentMethod = 'CASH';
    return this;
  }
}
