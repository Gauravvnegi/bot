import { get, set, trim } from 'lodash';
import {
  Booking,
  CurrentJourney,
  Feedback,
  Payment,
  Room,
  Status,
} from '../../../../reservation/src/lib/models/reservation-table.model';
import { EntityState } from '@hospitality-bot/admin/shared';

export interface IDeserializable {
  deserialize(input: any, hotelNationality: string): this;
}

export class GuestTable implements IDeserializable {
  totalRecord: number;
  entityTypeCounts: EntityState<string>;
  entityStateCounts: EntityState<string>;
  records: Guest[];

  deserialize(input: any) {
    this.records = input.records.map((record) =>
      new Guest().deserialize(record)
    );
    // TODO: it will be replace(input.entityTypeCounts/input.entityStateCounts) after getting guest table api
    this.entityTypeCounts = null;
    this.entityStateCounts = null;

    this.totalRecord = input?.total;
    return this;
  }
}

export class EntityTypeCounts {
  ALL: number;
  ARRIVAL: number;
  OUTGUEST: number;
  INHOUSE: number;
  DEPARTURE: number;

  deserialize(data, total) {
    Object.assign(
      this,
      set({}, 'ARRIVAL', get(data, ['ARRIVAL'])),
      set({}, 'OUTGUEST', get(data, ['OUTGUEST'])),
      set({}, 'INHOUSE', get(data, ['INHOUSE'])),
      set({}, 'DEPARTURE', get(data, ['DEPARTURE']))
    );
    this.ALL = total ?? 0;
    return this;
  }
}

export class EntityStateCounts {
  HIGHPOTENTIAL: number;
  VIP: number;
  HIGHRISK: number;

  deserialize(data) {
    Object.assign(
      this,
      set({}, 'HIGHPOTENTIAL', get(data, ['HIGHPOTENTIAL'])),
      set({}, 'VIP', get(data, ['VIP'])),
      set({}, 'HIGHRISK', get(data, ['HIGHRISK']))
    );
    return this;
  }
}

export class GuestData {
  age: number;
  mobileNumber: string;
  email: string;
  name: string;
  id: string;
  isVerified: boolean;
  status: boolean;
  type: string;

  deserialize(input) {
    const contact = input['contactDetails'];
    Object.assign(this, {
      age: input['age'],
      mobileNumber:
        contact['cc'] && contact['contactNumber']
          ? contact['cc'] + '-' + contact['contactNumber']
          : '',
      email: contact['emailId'],
      name: input['firstName'] + ' ' + (input['lastName'] ?? ''),
      id: input['id'],
      isVerified: input['isVerified'],
      status: input['status'],
      type: input['type'],
    });

    return this;
  }
}

export class Guest implements IDeserializable {
  dateOfBirth: string;
  contactDetails;
  firstName: string;
  id: string;
  lastName: string;
  nameTitle: string;
  nationality: string;
  countryCode: string;
  phoneNumber: string;
  email: string;
  guestAttributes: GuestAttributes;
  booking: Booking;
  feedback: Feedback;
  payment: Payment;
  status: Status;
  currentJourney: CurrentJourney;
  rooms: Room;
  documents: any[];
  vip: boolean;
  fullName: string;
  companyName: string;
  deserialize(input: any) {
    Object.assign(
      this,
      set({}, 'dateOfBirth', get(input, ['dateOfBirth'])),
      set({}, 'contactDetails', get(input, ['contactDetails'])),
      set({}, 'id', get(input, ['id'])),
      set({}, 'title', get(input, ['title'])),
      set({}, 'firstName', trim(get(input, ['firstName'], 'No'))),
      set({}, 'lastName', trim(get(input, ['lastName'], 'Name'))),
      set(
        {},
        'fullName',
        `${trim(get(input, ['firstName'], 'No'))} ${trim(
          get(input, ['lastName'], 'Name')
        )}`
      ),
      set({}, 'nameTitle', get(input, ['nameTitle'], '')),
      set({}, 'nationality', get(input, ['nationality'])),
      set(
        {},
        'countryCode',
        this.getNationality(get(input, ['contactDetails', 'cc']))
      ),
      set({}, 'phoneNumber', get(input, ['contactDetails', 'contactNumber'])),
      set({}, 'email', get(input, ['contactDetails', 'emailId']))
    );

    this.companyName = 'Company Name';

    this.guestAttributes = new GuestAttributes().deserialize(input.attributes);
    if (input.reservation[0]) {
      const reservation = input.reservation[0];
      this.booking = new Booking().deserialize(reservation);
      this.feedback = new Feedback().deserialize(reservation.feedback);
      this.payment = new Payment().deserialize(reservation.paymentSummary);
      this.status = new Status().deserialize(reservation);
      this.currentJourney = new CurrentJourney().deserialize(input);
      this.rooms = new Room().deserialize(reservation.stayDetails);
      this.vip = reservation.vip;
      if (reservation.guestDetails.primaryGuest.id === input.id) {
        this.documents = reservation.guestDetails.primaryGuest.documents;
      } else {
        const keys = Object.keys(reservation.guestDetails.allGuest);
        keys.forEach((key) => {
          if (key === input.id) {
            this.documents = reservation.guestDetails.allGuest[key].documents;
          }
        });
      }
    }
    return this;
  }

  getFullName() {
    return `${this.firstName} ${this.lastName}`;
  }

  getPhoneNumber() {
    return `${this.countryCode ? this.countryCode : ''} ${
      this.phoneNumber ? this.phoneNumber : ''
    }`;
  }

  getNationality(cc) {
    if (cc && cc.length) {
      return cc.includes('+') ? cc : `+${cc}`;
    }
    return cc;
  }
}

export class GuestAttributes {
  id: string;
  overAllNps: number;
  transactionUsage: string;
  totalSpend: number;
  potential: string;
  churnProbalilty: number;
  churnPrediction: string;

  deserialize(data) {
    Object.assign(
      this,
      set({}, 'id', get(data, ['id'])),
      set({}, 'overAllNps', get(data, ['overAllNps'])),
      set({}, 'transactionUsage', get(data, ['transactionUsage'])),
      set({}, 'totalSpend', get(data, ['totalSpend'])),
      set({}, 'potential', get(data, ['potential'])),
      set({}, 'churnProbalilty', get(data, ['churnProbalilty'])),
      set({}, 'churnPrediction', get(data, ['churnPrediction']))
    );
    return this;
  }
}

export class Reservation implements IDeserializable {
  rooms: Room;
  feedback: Feedback;
  booking: Booking;
  guestAttributes: GuestAttributes;
  deserialize(input: any) {
    this.rooms = new Room().deserialize(input.stayDetails);
    this.feedback = new Feedback().deserialize(input.feedback);
    this.booking = new Booking().deserialize(input);
    this.guestAttributes = new GuestAttributes().deserialize(
      input.guestAttributes
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
    data['present_booking_count'].forEach((item, i) => {
      this.presentBookings[i] = new Reservation().deserialize(item);
    });
    data['upcoming_booking_count'].forEach((item, i) => {
      this.upcomingBookings[i] = new Reservation().deserialize(item);
    });
    data['past_booking_count'].forEach((item, i) => {
      this.pastBookings[i] = new Reservation().deserialize(item);
    });
    return this;
  }
}
