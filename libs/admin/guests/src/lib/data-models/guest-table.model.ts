import { get, set, trim } from 'lodash';
import * as moment from 'moment';
import {
  Booking,
  Room,
  GuestType,
  Payment,
  Status,
  Feedback,
  Package,
  CurrentJourney,
} from '../../../../dashboard/src/lib/data-models/reservation-table.model';

export interface Deserializable {
  deserialize(input: any, hotelNationality: string): this;
}

export class GuestTable implements Deserializable {
  total: number;
  entityTypeCounts: EntityTypeCounts;
  entityStateCounts: EntityStateCounts;
  records: Reservation[];

  deserialize(input: any) {
    Object.assign(this, set({}, 'total', get(input, ['total'])));
    this.entityTypeCounts = new EntityTypeCounts().deserialize(
      input.entityTypeCounts
    );
    this.entityStateCounts = new EntityStateCounts().deserialize(
      input.entityStateCounts
    );
    this.records = input.records.map((record) =>
      new Reservation().deserialize(record)
    );
    return this;
  }
}

export class EntityTypeCounts {
  ARRIVAL: number;
  OUTGUEST: number;
  INHOUSE: number;
  DEPARTURE: number;

  deserialize(data) {
    Object.assign(
      this,
      set({}, 'ARRIVAL', get(data, ['ARRIVAL'])),
      set({}, 'OUTGUEST', get(data, ['OUTGUEST'])),
      set({}, 'INHOUSE', get(data, ['INHOUSE'])),
      set({}, 'DEPARTURE', get(data, ['DEPARTURE']))
    );
    return this;
  }
}

export class EntityStateCounts {
  'High Potential': number;
  VIP: number;
  'High Risk': number;

  deserialize(data) {
    Object.assign(
      this,
      set({}, 'ARRIVAL', get(data, ['ARRIVAL'])),
      set({}, 'OUTGUEST', get(data, ['OUTGUEST'])),
      set({}, 'INHOUSE', get(data, ['INHOUSE'])),
      set({}, 'DEPARTURE', get(data, ['DEPARTURE']))
    );
    return this;
  }
}

export class Reservation implements Deserializable {
  rooms;
  guests;
  booking;
  payment;
  status;
  feedback;
  packages;
  currentJourney;
  guestAttributes;
  deserialize(input: any) {
    this.booking = new Booking().deserialize(input);
    this.rooms = new Room().deserialize(input.stayDetails);
    this.guests = new GuestType().deserialize(input.guestDetails);
    this.payment = new Payment().deserialize(input.paymentSummary);
    this.status = new Status().deserialize(input);
    this.feedback = new Feedback().deserialize(input.feedback);
    this.packages = new Package().deserialize(input.packages);
    this.currentJourney = new CurrentJourney().deserialize(input);
    this.guestAttributes = new GuestAttributes().deserialize(input.guestAttributes);
    return this;
  }
}

export class GuestAttributes {
  id: string;
  overAllNps: number;
  transactionUsage: string;
  totalSpend: number;
  churnProbalilty: number;

  deserialize(data) {
    Object.assign(
      this,
      set({}, 'id', get(data, ['id'])),
      set({}, 'overAllNps', get(data, ['overAllNps'])),
      set({}, 'transactionUsage', get(data, ['transactionUsage'])),
      set({}, 'totalSpend', get(data, ['totalSpend'])),
      set({}, 'churnProbalilty', get(data, ['churnProbalilty']))
    );
    return this;
  }
}

export class GuestReservation {
  presentBookings: Reservation[];
  upcomingBookings: Reservation[];
  pastBookings: Reservation[];

  deserialize(data) {
    this.presentBookings = [];
    this.upcomingBookings = [];
    this.pastBookings = [];
    data['present_booking_count'].forEach((item, i)=> {
      this.presentBookings[i] = new Reservation().deserialize(item);
    });
    data['upcoming_booking_count'].forEach((item, i)=> {
      this.upcomingBookings[i] = new Reservation().deserialize(item);
    });
    data['past_booking_count'].forEach((item, i)=> {
      this.pastBookings[i] = new Reservation().deserialize(item);
    });
    return this;
  }
}
