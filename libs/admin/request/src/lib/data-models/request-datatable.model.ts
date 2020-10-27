import { get, set } from 'lodash';
import * as moment from 'moment';
export interface Deserializable {
  deserialize(input: any, hotelNationality: string): this;
}

export class RequestTable implements Deserializable {
  records: Request[];
  deserialize(input: any) {
    this.records = input.records.map((record) =>
      new Request().deserialize(record)
    );

    return this;
  }
}

export class Request implements Deserializable {
  requestTimeStamp;
  remarks;
  journey;
  status;
  rooms;
  booking;
  guests;
  deserialize(input) {
    Object.assign(
      this,
      set({}, 'requestTimeStamp', get(input, ['requestTime'])),
      set({}, 'remarks', get(input, ['remarks'])),
      set({}, 'status', get(input, ['status'])),
      set({}, 'journey', get(input, ['journey']))
    );
    //  this.rooms = new Room().deserialize(input.rooms);
    this.booking = new Booking().deserialize(input);
    this.guests = new GuestType().deserialize(input.guestDetails);

    return this;
  }

  getRequestDate() {
    return moment(this.requestTimeStamp).format('DD/M/YY');
  }

  getRequestTime() {
    return moment(this.requestTimeStamp).format('HH:mm');
  }

  getElapsedTime() {
    const diffInMins = moment().diff(moment(this.requestTimeStamp), 'minutes');
    if (diffInMins > 24 * 60 * 30 * 12) {
      return `${moment().diff(moment(this.requestTimeStamp), 'years')} year`;
    } else if (diffInMins > 24 * 60 * 30) {
      return `${moment().diff(moment(this.requestTimeStamp), 'months')} month`;
    } else if (diffInMins > 24 * 60) {
      return `${moment().diff(moment(this.requestTimeStamp), 'days')} day`;
    } else if (diffInMins > 60) {
      return `${moment().diff(moment(this.requestTimeStamp), 'hours')} hour`;
    } else if (diffInMins > 0) {
      return `${moment().diff(moment(this.requestTimeStamp), 'minutes')} min`;
    } else {
      return;
    }
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

export class Booking implements Deserializable {
  bookingId;
  bookingNumber;

  deserialize(input) {
    Object.assign(
      this,
      set({}, 'bookingNumber', get(input, ['confirmationNumber'])),
      set({}, 'bookingId', get(input, ['reservationId']))
    );
    return this;
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
