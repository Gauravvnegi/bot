import { get, set } from 'lodash';
import * as moment from 'moment';

export class FeedbackTable {
  total: number;
  entityTypeCounts;
  entityStateCounts: EntityStateCounts;
  records: Feedback[];

  deserialize(input, outlets) {
    Object.assign(this, set({}, 'total', get(input, ['total'])));
    this.entityStateCounts = new EntityStateCounts().deserialize(
      input.entityStateCounts
    );
    this.records = input.records.map((record) =>
      new Feedback().deserialize(record, outlets)
    );
    return this;
  }
}

export class Feedback {
  bookingDetails: string;
  comments: string;
  created: number;
  feedback: string;
  guest: Guest;
  hotelId: string;
  id: string;
  outlet: string;
  ratings: number;
  read: boolean;
  serviceType: string;
  services: string;
  session: string;
  tableNo: string;
  updated: number;
  notes: Notes;

  deserialize(input, outlets) {
    Object.assign(
      this,
      set({}, 'bookingDetails', JSON.parse(get(input, ['bookingDetails']))),
      set({}, 'comments', get(input, ['comments'])),
      set({}, 'created', get(input, ['created'])),
      set({}, 'feedback', JSON.parse(get(input, ['feedback']))),
      set({}, 'hotelId', get(input, ['hotelId'])),
      set({}, 'id', get(input, ['id'])),
      set({}, 'ratings', get(input, ['ratings'])),
      set({}, 'read', get(input, ['read'])),
      set({}, 'serviceType', get(input, ['serviceType'])),
      set({}, 'services', JSON.parse(get(input, ['services']))),
      set({}, 'session', get(input, ['session'])),
      set({}, 'tableNo', get(input, ['tableNo'])),
      set({}, 'updated', get(input, ['updated']))
    );
    this.outlet = outlets.filter(
      (outlet) => outlet.id === input.outletId
    )[0].name;
    this.notes = new Notes().deserialize(input.notes);
    this.guest = new Guest().deserialize(input.guestId);
    return this;
  }

  getServiceTypeAndTime() {
    return `${this.bookingDetails['serviceType']}: ${this.bookingDetails['session']}`;
  }
}

export class Guest {
  anniversaryDate: string;
  countryCode: string;
  created: number;
  dateOfBirth: string;
  emailId: string;
  firstName: string;
  id: string;
  lastName: string;
  nameTitle: string;
  phoneNumber: string;
  place: string;
  spouseBirthDate: string;
  updated: number;

  deserialize(input) {
    Object.assign(
      this,
      set({}, 'anniversaryDate', get(input, ['anniversaryDate'])),
      set({}, 'countryCode', get(input, ['countryCode'])),
      set({}, 'created', get(input, ['created'])),
      set({}, 'dateOfBirth', get(input, ['dateOfBirth'])),
      set({}, 'emailId', get(input, ['emailId'])),
      set({}, 'firstName', get(input, ['firstName'])),
      set({}, 'id', get(input, ['id'])),
      set({}, 'lastName', get(input, ['lastName'])),
      set({}, 'nameTitle', get(input, ['nameTitle'])),
      set({}, 'phoneNumber', get(input, ['phoneNumber'])),
      set({}, 'place', get(input, ['place'])),
      set({}, 'spouseBirthDate', get(input, ['spouseBirthDate'])),
      set({}, 'updated', get(input, ['updated']))
    );
    return this;
  }

  getFullName() {
    return `${this.nameTitle ? this.nameTitle + ' ' : ''}${this.firstName} ${
      this.lastName
    }`;
  }

  getPhoneNumber() {
    return `${this.countryCode ? this.countryCode + ' ' : ''}${
      this.phoneNumber
    }`;
  }

  getCreatedDate(timezone = '+05:30') {
    return moment(this.created).utcOffset(timezone).format('DD/MM/YYYY');
  }
}

export class Notes {
  adminName: string;
  created: number;
  id: string;
  remarks: string;
  updated: number;

  deserialize(input) {
    Object.assign(
      this,
      set({}, 'adminName', get(input, ['adminName'])),
      set({}, 'created', get(input, ['created'])),
      set({}, 'id', get(input, ['id'])),
      set({}, 'remarks', get(input, ['remarks'])),
      set({}, 'updated', get(input, ['updated']))
    );
    return this;
  }

  getUpdatedDate(timezone) {
    return moment(this.updated).utcOffset(timezone).format('DD/MM/YYYY');
  }

  getUpdatedTime(timezone) {
    return moment(this.updated).utcOffset(timezone).format('hh:mm A');
  }
}

export class EntityStateCounts {
  ACTIONED: number;
  HIGHPOTENTIAL: number;
  HIGHRISK: number;
  READ: number;
  UNREAD: number;

  deserialize(input) {
    Object.assign(
      this,
      set({}, 'ACTIONED', get(input, ['ACTIONED'])),
      set({}, 'HIGHPOTENTIAL', get(input, ['HIGHPOTENTIAL'])),
      set({}, 'HIGHRISK', get(input, ['HIGHRISK'])),
      set({}, 'READ', get(input, ['READ'])),
      set({}, 'UNREAD', get(input, ['UNREAD']))
    );
    return this;
  }
}
