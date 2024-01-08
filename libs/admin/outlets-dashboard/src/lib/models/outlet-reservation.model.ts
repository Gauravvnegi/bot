import { EntityState } from '@hospitality-bot/admin/shared';
import {
  OutletReservationListResponse,
  OutletReservationResponse,
} from '../types/outlet.response';

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
  name: string;
  reservationTime: string;
  adultCount: number;
  orderNumber: number;
  status: string;
  price: number;
  preparationTime: string;
  tableNumber: string;

  deserialize(input: OutletReservationResponse) {
    this.name = input?.name;
    this.reservationTime = input?.reservationTime;
    this.adultCount = input?.adultCount;
    this.orderNumber = input?.orderNumber;
    this.status = input?.status;
    this.price = input?.price;
    this.preparationTime = input?.preparationTime;
    this.tableNumber = input?.tableNumber;
    return this;
  }
}
