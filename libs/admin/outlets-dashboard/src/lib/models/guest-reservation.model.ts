import { getFullName } from 'libs/admin/shared/src/lib/utils/valueFormatter';
import { TabsType } from '../types/guest.type';
import {
  GuestReservationListResponse,
  GuestReservationResponse,
} from '../types/outlet.response';
import { PosOrderResponse } from '../types/reservation-table';
import { getFormattedDateWithTime } from '@hospitality-bot/admin/shared';

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
  id: string;
  tableNo: string;
  orderNo?: string;
  time: string;
  timeLimit?: string;
  people: number;
  name: string;
  type: TabsType;
  feedback?: string;
  phone: string;
  isSeated: boolean;
  paymentMethod: string;
  paymentStatus: string;
  totalAmount: number;
  totalDueAmount: number;
  nextStates: string[];
  orderMethod: string;
  numberOfItems: string;
  preparationTime: string;
  reservationStatus: string;
  currentJourney: string;
  order?: Omit<PosOrderResponse, 'reservation'>;
  from: number;
  to: string;

  deserialize(value: GuestReservationResponse) {
    this.id = value.id;
    this.tableNo = value?.tableNumberOrRoomNumber;
    this.orderNo = value?.order?.number;
    this.time = getFormattedDateWithTime(value?.from);
    this.timeLimit = undefined;
    this.people = value?.occupancyDetails?.maxAdult ?? 0;
    this.name = getFullName(value?.guest?.firstName, value?.guest?.lastName);
    this.type =
      value?.guest?.type === 'GUEST' ? 'Resident' : ('Non-Resident' as any);
    this.feedback = undefined;
    this.phone = value?.guest?.contactDetails?.contactNumber;
    this.isSeated = value?.currentJourney === 'SEATED';
    this.reservationStatus = value?.status;
    this.currentJourney = value?.currentJourney;
    this.order = value.order;
    this.from = value.from;
    return this;
  }
}

export class GuestFormData {
  tables: string; //@multipleTableBooking: need to change for multiple tables bookings : string[]
  personCount: number;
  guest: string;
  marketSegment: string;
  checkIn: number;
  checkOut: number;
  slotHours: number;
  remark: string;
  sourceName: string;
  source: string;
  reservationType: string;
  currentJourney: string;
  areaId: string;
  guestName: string;

  deserialize(value: GuestReservationResponse) {
    this.tables = value?.tableIdOrRoomId; //@multipleTableBooking: need to change for multiple tables bookings: [...]
    this.personCount = value?.occupancyDetails?.maxAdult;
    this.guest = value?.guest?.id;
    this.marketSegment = value?.marketSegment;
    this.checkIn = value?.from;
    this.checkOut = value?.to;
    this.slotHours = Math.abs(value?.from - value?.to);
    this.remark = value?.specialRequest;
    this.sourceName = value?.sourceName;
    this.source = value?.source;
    this.reservationType = value?.status;
    this.currentJourney = value?.currentJourney;
    this.areaId = value?.areaId;
    this.guestName = getFullName(
      value?.guest?.firstName,
      value?.guest?.lastName
    );
    return this;
  }
}
