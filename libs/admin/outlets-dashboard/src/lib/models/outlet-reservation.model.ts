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
import {
  formatEpochTime,
  getFullName,
} from 'libs/admin/shared/src/lib/utils/valueFormatter';
import {
  TableReservationListResponse,
  TableReservationResponse,
} from '../types/table-booking.response';
import { DateService } from '@hospitality-bot/shared/utils';

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
    this.area = 'A1';
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

  deserialize(input: TableReservationListResponse) {
    this.entityTypeCounts = input.entityTypeCounts;
    this.entityStateCounts = input.entityStateCounts;

    this.reservationData = input.tables.map((table) =>
      new OutletReservation().deserialize(table)
    );

    return this;
  }
}

export class OutletReservation {
  tableValue;
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

  deserialize(table: TableReservationResponse) {
    const reservationData = table.booking;

    this.tableNumber = `${table?.number} - ${table?.area?.name ?? ''}`;
    this.tableData = {
      label: table?.number,
      value: table?.id,
      areaId: table?.area?.id,
    };
    this.area = table?.area?.name;
    this.bookingNumber = table?.number;
    this.date = table?.created;
    this.time = reservationData?.from;
    this.paymentMethod = 'CASH';
    this.groupId = table?.entityId;
    this.adultCount = table?.pax;
    this.guestName = getFullName(
      reservationData?.guest?.firstName,
      reservationData?.guest?.lastName
    );
    // this.preparationTime = reservationData?.order?.p;
    // this.paymentMethod = reservationData?.order?.pricingDetails?.ca;
    this.totalAmount = reservationData?.order?.pricingDetails?.totalAmount;
    this.totalDueAmount = reservationData?.order?.pricingDetails?.dueAmount;
    this.nextStates = ['DRAFT'];
    this.orderNumber = reservationData?.order?.number;
    this.price = undefined;
    this.reservationStatus = reservationData?.status as ReservationStatus;
    this.numberOfItems = undefined;
    this.orderMethod = undefined;
    this.tableStatus = reservationData?.id
      ? reservationData.order?.number
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
