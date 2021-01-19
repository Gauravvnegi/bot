import { get, set } from 'lodash';
import * as moment from 'moment';
import { Booking, CurrentJourney, Feedback, Payment, Room, Status } from '../../../../dashboard/src/lib/data-models/reservation-table.model';

export interface Deserializable {
  deserialize(input: any, hotelNationality: string): this;
}

export class GuestTable implements Deserializable {
  total: number;
  entityTypeCounts: EntityTypeCounts;
  entityStateCounts: EntityStateCounts;
  records: Guest[];

  deserialize(input: any) {
    Object.assign(this, set({}, 'total', get(input, ['total'])));
    this.entityTypeCounts = new EntityTypeCounts().deserialize(
      input.entityTypeCounts
    );
    this.entityStateCounts = new EntityStateCounts().deserialize(
      input.entityStateCounts
    );
    this.records = input.records.map((record) =>
      new Guest().deserialize(record)
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

export class Guest implements Deserializable {
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

  deserialize(input: any) {
    Object.assign(
      this,
      set({}, 'dateOfBirth', get(input, ['dateOfBirth'])),
      set({}, 'contactDetails', get(input, ['contactDetails'])),
      set({}, 'firstName', get(input, ['firstName'])),
      set({}, 'id', get(input, ['id'])),
      set({}, 'title', get(input, ['title'])),
      set({}, 'lastName', get(input, ['lastName'])),
      set({}, 'nameTitle', get(input, ['nameTitle'])),
      set({}, 'nationality', get(input, ['nationality'])),
      set({}, 'countryCode', get(input, ['contactDetails', 'cc'])),
      set({}, 'phoneNumber', get(input, ['contactDetails', 'contactNumber'])),
      set({}, 'email', get(input, ['contactDetails', 'emailId'])),
    );
    this.guestAttributes = new GuestAttributes().deserialize(
      input.attributes
    );
    if (input.reservation[0]) {
      const reservation = input.reservation[0];
      this.booking = new Booking().deserialize(reservation);
      this.feedback = new Feedback().deserialize(reservation.feedback);
      this.payment = new Payment().deserialize(reservation.paymentSummary);
      this.status = new Status().deserialize(reservation);
      this.currentJourney = new CurrentJourney().deserialize(input);
      this.rooms = new Room().deserialize(reservation.stayDetails);
      if (reservation.guestDetails.primaryGuest.id === input.id) {
        this.documents = reservation.guestDetails.primaryGuest.documents;
      } else {
        for (let i = 0; i<reservation.guestDetails.secondaryGuest.length; i++) {
          if (reservation.guestDetails.secondaryGuest[i].id === input.id) {
            this.documents = reservation.guestDetails.secondaryGuest[i].documents;
            break;
          }
        }
      }
    }
    return this;
  }

  getFullName() {
    return `${this.firstName} ${this.lastName}`;
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

export class Reservation implements Deserializable {
  rooms;
  feedback;
  booking;
  guestAttributes: GuestAttributes;
  deserialize(input: any) {
    this.rooms = new Room().deserialize(input.stayDetails);
    this.feedback = new Feedback().deserialize(input.feedback);
    this.booking = new Booking().deserialize(input);
    this.guestAttributes = new GuestAttributes().deserialize(input.guestAttributes);
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
