import { get, set } from 'lodash';
import * as moment from 'moment';
export interface Deserializable {
  deserialize(input: any, hotelNationality: string): this;
}

export class ReservationTable implements Deserializable {
  records: Reservation[];
  deserialize(input: any) {
    this.records = input.records.map((record) =>
      new Reservation().deserialize(record)
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
  deserialize(input: any) {
    this.booking = new Booking().deserialize(input);
    this.rooms = new Room().deserialize(input.stayDetails);
    this.guests = new GuestType().deserialize(input.guestDetails);
    this.payment = new Payment().deserialize(input.paymentSummary);
    this.status = new Status().deserialize(input);
    this.feedback = new Feedback().deserialize(input.feedback);
    return this;
  }
}

export class Feedback implements Deserializable {
  rating;
  comments: string;
  deserialize(input: any) {
    Object.assign(
      this,
      set({}, 'rating', get(input, ['rating'])),
      set({}, 'comments', get(input, ['comments']))
    );
    return this;
  }
}

export class Status implements Deserializable {
  journeyStatus;
  stepsStatus;
  deserialize(input: any) {
    this.journeyStatus = new JourneyStatus().deserialize(input.journeysStatus);
    this.stepsStatus = new StepsStatus().deserialize(input.stepsStatus);
    return this;
  }
}

export class JourneyStatus implements Deserializable {
  preCheckin;
  checkin;
  checkout;
  deserialize(input) {
    Object.assign(
      this,
      set({}, 'preCheckin', get(input, ['PRECHECKIN'])),
      set({}, 'checkin', get(input, ['CHECKIN'])),
      set({}, 'checkout', get(input, ['CHECKOUT']))
    );
    return this;
  }
}

export class StepsStatus implements Deserializable {
  documents;
  payment;
  feedback;
  deserialize(input) {
    Object.assign(
      this,
      set({}, 'documents', get(input, ['DOCUMENTS'])),
      set({}, 'payment', get(input, ['PAYMENT'])),
      set({}, 'feedback', get(input, ['FEEDBACK']))
    );
    return this;
  }
}
export class Payment implements Deserializable {
  totalAmount;
  taxAmount;
  totalDiscount;
  subtotal;
  paidAmount;
  dueAmount;
  currency;
  deserialize(input) {
    Object.assign(
      this,
      set({}, 'totalAmount', get(input, ['totalAmount'])),
      set({}, 'taxAmount', get(input, ['taxAmount'])),
      set({}, 'totalDiscount', get(input, ['totalDiscount'])),
      set({}, 'subtotal', get(input, ['subtotal'])),
      set({}, 'paidAmount', get(input, ['paidAmount'])),
      set({}, 'dueAmount', get(input, ['dueAmount'])),
      set({}, 'currency', get(input, ['currency']))
    );
    return this;
  }
}

export class Booking implements Deserializable {
  bookingNumber;
  arrivalTimeStamp;
  departureTimeStamp;
  deserialize(input) {
    Object.assign(
      this,
      set({}, 'bookingNumber', get(input, ['number'])),
      set({}, 'arrivalTimeStamp', get(input, ['arrivalTime'])),
      set({}, 'departureTimeStamp', get(input, ['departureTime']))
    );
    return this;
  }

  getArrivalDate() {
    return moment(this.arrivalTimeStamp).format('DD/M/YY');
  }

  getDepartureDate() {
    return moment(this.departureTimeStamp).format('DD/M/YY');
  }

  getArrivalTime() {
    return moment(this.arrivalTimeStamp).format('H:mm');

    //return moment.utc(this.arrivalTimeStamp).format('H:mm');
  }

  getDepartureTime() {
    return moment(this.departureTimeStamp).format('H:mm');
  }

  getDaysAndNights() {
    const diffInDays = moment(this.departureTimeStamp).diff(
      moment(this.arrivalTimeStamp),
      'days'
    );
    return {
      days: diffInDays,
      nights: diffInDays,
    };
  }
}

export class GuestType implements Deserializable {
  primaryGuest;
  secondaryGuest = [];
  deserialize(input) {
    this.primaryGuest = new Guest().deserialize(input.primaryGuest);
    input.secondaryGuest.forEach((secondaryGuest) => {
      this.secondaryGuest.push(new Guest().deserialize(secondaryGuest));
    });
    return this;
  }

  getSecGuestDisplayConfig() {
    return {
      count: this.secondaryGuest.length,
      countString:
        this.secondaryGuest.length > 0
          ? `(+${this.secondaryGuest.length})`
          : null,
    };
  }
}

export class Guest implements Deserializable {
  id;
  nameTitle;
  firstName: string;
  lastName: string;
  contactDetails;
  documents = [];
  deserialize(input: any) {
    Object.assign(
      this,
      set({}, 'id', get(input, ['id'])),
      set({}, 'nameTitle', get(input, ['nameTitle'])),
      set({}, 'firstName', get(input, ['firstName'])),
      set({}, 'lastName', get(input, ['lastName']))
    );
    return this;
  }

  getFullName() {
    return `${this.firstName} ${this.lastName}`;
  }
}

export class Room implements Deserializable {
  roomNumber;
  type;
  unit;
  chargeCode;
  status;
  roomClass;
  deserialize(input: any) {
    Object.assign(
      this,
      set({}, 'roomNumber', get(input, ['roomNumber'])),
      set({}, 'type', get(input, ['roomType'])),
      set({}, 'unit', get(input, ['unit'])),
      set({}, 'chargeCode', get(input, ['chargeCode'])),
      set({}, 'status', get(input, ['status'])),
      set({}, 'roomClass', get(input, ['roomClass']))
    );
    return this;
  }
}
