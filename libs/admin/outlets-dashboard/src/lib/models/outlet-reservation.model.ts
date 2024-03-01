import { EntityState, Option } from '@hospitality-bot/admin/shared';
import {
  GuestReservationListResponse,
  TableListResponse,
  TableResponse,
} from '../types/outlet.response';
import {
  ReservationStatus,
  PaymentStatus,
  TableStatus,
  ReservationTableListResponse,
  PosOrderResponse,
  OrderReservationStatus,
} from '../types/reservation-table';
import { GuestReservation } from './guest-reservation.model';
import { formatEpochTime } from 'libs/admin/shared/src/lib/utils/valueFormatter';

export class OutletReservationTableList {
  reservationData: OutletReservationTable[];
  entityTypeCounts: EntityState<string>;
  entityStateCounts: EntityState<string>;
  total: number;
  deserialize(input: ReservationTableListResponse) {
    this.reservationData =
      input.records.map((item) =>
        new OutletReservationTable().deserialize(item)
      ) ?? [];
    this.entityTypeCounts = input?.entityTypeCounts;
    this.entityStateCounts = input?.entityStateCounts ?? {};
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
  paymentMethod: string;
  totalAmount: number;
  totalDueAmount: number;
  nextStates: string[];
  guestName: string;
  reservationStatus: OrderReservationStatus;
  orderId: string;
  toTime: string;
  fromTime: string;

  deserialize(input: PosOrderResponse) {
    this.orderId = input?.id;
    this.area = input.reservation?.areaName;
    this.bookingNumber = input?.reservation?.reservationNumber ?? input?.number;
    this.date = input?.reservation?.from;
    this.totalAmount = input?.pricingDetails?.totalAmount;
    this.totalDueAmount = input.pricingDetails?.dueAmount;
    const { firstName, lastName } = input?.guest || {};
    this.guestName = firstName
      ? lastName
        ? `${firstName} ${lastName}`
        : firstName
      : lastName || '';
    this.tableNumber = input?.reservation?.tableNumberOrRoomNumber;
    this.paymentMethod = 'CASH';
    this.reservationStatus = input?.status;
    this.nextStates = [...input.nextStates, input?.status];
    this.toTime = formatEpochTime(input?.reservation?.to);
    this.fromTime = formatEpochTime(input?.reservation?.from);
    return this;
  }
}

export class OutletReservationList {
  reservationData: OutletReservation[];
  entityStateCounts: EntityState<string>;
  entityTypeCounts: EntityState<string>;
  total: number;

  deserialize(
    tableValue: TableListResponse,
    reservationData: GuestReservationListResponse
  ) {
    this.entityStateCounts = tableValue.entityTypeCounts;
    this.entityStateCounts = reservationData.entityStateCounts;

    const modifiedReservationData: Record<
      string,
      GuestReservation
    > = reservationData.records.reduce((acc, reservation) => {
      acc[reservation.tableIdOrRoomId] = new GuestReservation().deserialize(
        reservation
      );
      return acc;
    }, {} as Record<string, GuestReservation>);

    this.reservationData = tableValue.tables.map((table) =>
      new OutletReservation().deserialize(table, modifiedReservationData)
    );

    return this;
  }
}

export class OutletReservation {
  id: string;
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
  orderNumber: string;
  price: number;
  preparationTime: string;
  paymentStatus: PaymentStatus;
  reservationStatus: ReservationStatus;
  numberOfItems: number;
  orderMethod: string;
  tableStatus: TableStatus;
  orderId?: string;
  tableData: Option;
  currentJourney: string;

  deserialize(
    table: TableResponse,
    reservation: Record<string, GuestReservation>
  ) {
    const reservationData = reservation[table.id];

    this.tableNumber = `${table?.number} - ${table?.area?.name ?? ''}`;
    this.tableData = {
      label: table?.number,
      value: table?.id,
      areaId: table?.area?.id,
    };
    this.area = table?.area?.name;
    this.bookingNumber = table?.number;
    this.date = table?.created;
    this.time = reservationData?.time;
    this.paymentMethod = 'CASH';
    this.groupId = table?.entityId;
    this.adultCount = table?.pax;
    this.guestName = reservationData?.name;
    this.preparationTime = reservationData?.preparationTime;
    this.paymentMethod = reservationData?.paymentMethod;
    this.totalAmount = reservationData?.totalAmount;
    this.totalDueAmount = reservationData?.totalDueAmount;
    this.nextStates = ['DRAFT'];
    this.orderNumber = reservationData?.orderNo;
    this.price = undefined;
    this.reservationStatus = reservationData?.reservationStatus as ReservationStatus;
    this.numberOfItems = undefined;
    this.orderMethod = undefined;
    this.tableStatus = reservationData?.id
      ? reservationData.orderNo
        ? 'RUNNING_TABLE'
        : 'RUNNING_KOT_TABLE'
      : 'BLANK_TABLE';
    this.id = reservationData?.id;
    this.numberOfItems = reservationData?.order?.kots.reduce((total, kot) => {
      const itemsWithMenuItem = kot.items.filter((item) => item.menuItem);
      return total + itemsWithMenuItem.length;
    }, 0);
    this.orderId = reservationData?.order?.id;
    this.currentJourney = reservationData?.currentJourney;

    return this;
  }
}
