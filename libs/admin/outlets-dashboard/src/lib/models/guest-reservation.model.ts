import {
  convertToNormalCase,
  formatEpochTime,
  getFullName,
} from 'libs/admin/shared/src/lib/utils/valueFormatter';
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
  deserialize(value: GuestReservationResponse) {
    this.id = value.id;
    this.tableNo = value?.tableNumberOrRoomNumber;
    this.orderNo = value?.order?.number;
    this.time = formatEpochTime(value?.from);
    this.timeLimit = undefined;
    this.people = value?.occupancyDetails?.maxAdult ?? 0;
    this.name = getFullName(value?.guest?.firstName, value?.guest?.lastName);
    this.type =
      value?.guest?.type === 'GUEST' ? 'Resident' : ('Non-Resident' as any);
    this.feedback = undefined;
    this.phone = value?.guest?.contactDetails?.contactNumber;
    this.isSeated = value?.currentJourney === 'SEATED';
    return this;
  }
}

export class GuestFormData {
  tables: string[];
  personCount: number;
  guest: string;
  marketSegment: string;
  checkIn: number;
  checkOut: number;
  slotHours: number;
  remark: string;

  deserialize(value: GuestReservationResponse) {
    this.tables = [value?.tableIdOrRoomId];
    this.personCount = value?.occupancyDetails?.maxAdult;
    this.guest = value?.guest?.id;
    this.marketSegment = value?.marketSegment;
    this.checkIn = value?.from;
    this.checkOut = value?.to;
    this.slotHours = Math.abs(value?.from - value?.to);
    this.remark = value?.remarks;
    return this;
  }
}
