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
    this.rooms = new Room().deserialize(input.stayDetails);
    this.booking = new Booking().deserialize(input);
    this.guests = new GuestType().deserialize(input.guestDetails);

    return this;
  }

  getRequestDate(timezone = '+05:30') {
    return moment(this.requestTimeStamp).utcOffset(timezone).format('DD/M/YY');
  }

  getRequestTime(timezone = '+05:30') {
    return moment(this.requestTimeStamp).utcOffset(timezone).format('HH:mm');
  }

  getElapsedTime(timezone = '+05:30') {
    const diffInMins = moment()
      .utcOffset(timezone)
      .diff(moment(this.requestTimeStamp).utcOffset(timezone), 'minutes');
    if (diffInMins > 24 * 60 * 30 * 12) {
      return `${moment()
        .utcOffset(timezone)
        .diff(
          moment(this.requestTimeStamp).utcOffset(timezone),
          'years'
        )} year`;
    } else if (diffInMins > 24 * 60 * 30) {
      return `${moment()
        .utcOffset(timezone)
        .diff(
          moment(this.requestTimeStamp).utcOffset(timezone),
          'months'
        )} month`;
    } else if (diffInMins > 24 * 60) {
      return `${moment()
        .utcOffset(timezone)
        .diff(moment(this.requestTimeStamp).utcOffset(timezone), 'days')} day`;
    } else if (diffInMins > 60) {
      return `${moment()
        .utcOffset(timezone)
        .diff(
          moment(this.requestTimeStamp).utcOffset(timezone),
          'hours'
        )} hour`;
    } else if (diffInMins > 0) {
      return `${moment()
        .utcOffset(timezone)
        .diff(
          moment(this.requestTimeStamp).utcOffset(timezone),
          'minutes'
        )} min`;
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
    input.accompanyGuests.forEach((guest) => {
      this.secondaryGuest.push(new Guest().deserialize(guest));
    });
    input.sharerGuests.forEach((guest) => {
      this.secondaryGuest.push(new Guest().deserialize(guest));
    });
    input.kids.forEach((guest) => {
      this.secondaryGuest.push(new Guest().deserialize(guest));
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
      set({}, 'nameTitle', get(input, ['nameTitle'], '')),
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
