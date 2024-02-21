import { TabsType } from '../types/guest.type';
import {
  GuestReservationListResponse,
  GuestReservationResponse,
} from '../types/outlet.response';

export class GuestReservationList {
  total: number;
  entityTypeCounts: Record<string, number>;
  entityStateCounts: Record<string, number>;
  records: GuestReservation[];

  deserialize(value: GuestReservationListResponse) {
    this.total = value.total;
    this.entityTypeCounts = value.entityTypeCounts;
    this.entityStateCounts = value.entityStateCounts;
    this.records = value.records.map((item) => {
      return new GuestReservation().deserialize(item);
    });
    return this;
  }
}

export class GuestReservation {
  tableNo: string;
  orderNo?: string;
  time: string;
  timeLimit?: string;
  people: number;
  name: string;
  type: TabsType;
  feedback?: string;
  phone: string;
  deserialize(value: GuestReservationResponse) {
    this.tableNo = value?.tableNumberOrRoomNumber;
    this.orderNo = value?.order?.number;
    this.time = undefined;
    this.timeLimit = undefined;
    this.people = value?.order?.reservation?.occupancyDetails?.maxAdult;
    this.name = undefined;
    this.type = value?.outletType as any;
    this.feedback = undefined;
    this.phone = undefined;
    return this;

    return this;
  }
}
