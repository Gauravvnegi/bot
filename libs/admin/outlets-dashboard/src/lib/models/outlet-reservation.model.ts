import { EntityState } from '@hospitality-bot/admin/shared';
import {
  GuestReservationListResponse,
  OutletReservationListResponse,
  OutletReservationResponse,
  TableListResponse,
  TableResponse,
} from '../types/outlet.response';
import {
  ReservationStatus,
  PaymentStatus,
  TableStatus,
  ReservationTableListResponse,
  ReservationTableResponse,
} from '../types/reservation-table';
import { TableValue } from 'libs/table-management/src/lib/constants/table-datable';
import { GuestReservation } from './guest-reservation.model';

// export class OutletReservationList {
//   reservationData: OutletReservation[];
//   entityStateCounts: EntityState<string>;
//   entityTypeCounts: EntityState<string>;
//   total: number;
//   deserialize(input: OutletReservationListResponse) {
//     this.reservationData = (input?.reservationData ?? []).map((item) =>
//       new OutletReservation().deserialize(item)
//     );
//     this.entityStateCounts = input.entityStateCounts;
//     this.entityTypeCounts = input.entityTypeCounts;
//     this.total = input.total;
//     return this;
//   }
// }

// export class OutletReservation {
//   invoiceId: string;
//   tableNumber: string;
//   area: string;
//   bookingNumber: string;
//   date: number;
//   time: string;
//   paymentMethod: string;
//   groupId: string;
//   totalAmount: number;
//   totalDueAmount: number;
//   nextStates: string[];
//   guestName: string;
//   adultCount: number;
//   orderNumber: number;
//   price: number;
//   preparationTime: string;
//   paymentStatus: PaymentStatus;
//   reservationStatus: ReservationStatus;
//   numberOfItems: number;
//   orderMethod: string;
//   tableStatus: TableStatus;

//   deserialize(input: OutletReservationResponse) {
//     this.invoiceId = input?.invoiceId;
//     this.area = input?.area;
//     this.bookingNumber = input?.bookingNumber;
//     this.date = input?.date;
//     this.time = input?.reservationTime;
//     this.paymentMethod = input?.paymentMethod;
//     this.groupId = input?.groupId;
//     this.totalAmount = input?.totalAmount;
//     this.totalDueAmount = input?.totalDueAmount;
//     this.nextStates = input?.nextStates;
//     this.guestName = input?.name;
//     this.adultCount = input?.adultCount;
//     this.orderNumber = input?.orderNumber;
//     this.reservationStatus = input?.reservationStatus;
//     this.price = input?.price;
//     this.preparationTime = input?.preparationTime;
//     this.tableNumber = input?.tableNumber;
//     this.paymentStatus = input?.paymentStatus;
//     this.numberOfItems = input?.numberOfItems;
//     this.orderMethod = input?.orderMethod
//       .toLowerCase()
//       .split('_')
//       .map((word) => word?.charAt(0)?.toUpperCase() + word?.slice(1))
//       .join('-');
//     this.tableStatus = input?.tableStatus;
//     return this;
//   }
// }

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

  deserialize(
    table: TableResponse,
    reservation: Record<string, GuestReservation>
  ) {
    const reservationData = reservation[table.id];

    this.tableNumber = `${table?.number} - ${table?.area?.name ?? ''}`;
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
    this.tableStatus = 'RUNNING_TABLE' as TableStatus;
    this.id = reservationData?.id;

    return this;
  }
}
