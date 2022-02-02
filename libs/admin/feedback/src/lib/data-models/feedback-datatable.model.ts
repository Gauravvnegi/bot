import { DateService } from '@hospitality-bot/shared/utils';
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
      set(
        {},
        'feedback',
        input.feedback ? JSON.parse(get(input, ['feedback'])) : {}
      ),
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
      (outlet) => outlet.id === input.entityId
    )[0]?.name;
    if (input.notes) this.notes = new Notes().deserialize(input.notes);
    this.guest = new Guest().deserialize(input.guestId);
    return this;
  }

  getServiceTypeAndTime() {
    return `${this.bookingDetails['serviceType']}: ${this.bookingDetails['session']}`;
  }

  getCreatedDate(timezone = '+05:30') {
    return moment(this.created).utcOffset(timezone).format('DD/MM/YYYY');
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

export class StayFeedbackTable {
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
      new StayFeedback().deserialize(record, outlets)
    );
    return this;
  }
}

export class StayFeedback {
  bookingDetails: any;
  comments: string;
  entityId: string;
  feedbackType: string;
  feedbackUrl: string;
  guestData: StayGuestData;
  guest: Guest;
  id: string;
  notes: Notes;
  ratings: number;
  read: boolean;
  serviceType: string;
  services;
  session: string;
  size: number;
  tableOrRoomNumber: string;
  transactionalService: string;
  outlet: string;

  deserialize(input, outlets) {
    Object.assign(
      this,
      set({}, 'bookingDetails', JSON.parse(get(input, ['bookingDetails']))),
      set({}, 'comments', get(input, ['comments'])),
      set({}, 'feedbackType', get(input, ['feedbackType'])),
      set({}, 'feedbackUrl', get(input, ['feedbackUrl'])),
      set({}, 'id', get(input, ['id'])),
      set({}, 'ratings', get(input, ['ratings'])),
      set({}, 'read', get(input, ['read'])),
      set({}, 'serviceType', get(input, ['serviceType'])),
      set({}, 'services', JSON.parse(get(input, ['services']))),
      set({}, 'session', get(input, ['session'])),
      set({}, 'size', get(input, ['size'])),
      set({}, 'tableOrRoomNumber', get(input, ['tableOrRoomNumber'])),
      set({}, 'transactionalService', get(input, ['transactionalService']))
    );
    this.outlet = outlets.filter(
      (outlet) => outlet.id === input.entityId
    )[0]?.name;
    if (input.notes) this.notes = new Notes().deserialize(input.notes);
    this.guestData = new StayGuestData().deserialize(input.guestData);
    this.guest = new Guest().deserialize(input.guestId);
    return this;
  }
}

export class StayGuestData {
  arrivalTime: number;
  bookingNo: string;
  churnPrediction: string;
  churnProbalilty: number;
  departureTime: number;
  dueSpend: number;
  guestCount: number;
  overAllNps: number;
  totalSpend: number;
  transactionUsage: string;

  deserialize(input) {
    Object.assign(
      this,
      set({}, 'arrivalTime', get(input, ['arrivalTime'])),
      set({}, 'bookingNo', get(input, ['bookingNo'])),
      set({}, 'churnPrediction', get(input, ['churnPrediction'])),
      set({}, 'churnProbalilty', get(input, ['churnProbalilty'])),
      set({}, 'departureTime', get(input, ['departureTime'])),
      set({}, 'dueSpend', JSON.parse(get(input, ['dueSpend']))),
      set({}, 'guestCount', get(input, ['guestCount'])),
      set({}, 'overAllNps', get(input, ['overAllNps'])),
      set({}, 'totalSpend', get(input, ['totalSpend'])),
      set({}, 'transactionUsage', get(input, ['transactionUsage']))
    );
    console.log(this);
    return this;
  }

  getArrivalDate(timezone = '+05:30') {
    return DateService.getDateFromTimeStamp(
      this.arrivalTime,
      'DD/M/YY',
      timezone
    );
  }

  getDepartureDate(timezone = '+05:30') {
    return DateService.getDateFromTimeStamp(
      this.departureTime,
      'DD/M/YY',
      timezone
    );
  }

  getArrivalTime(timezone = '+05:30') {
    return DateService.getDateFromTimeStamp(
      this.arrivalTime,
      'HH:mm',
      timezone
    );
  }

  getDepartureTime(timezone = '+05:30') {
    return DateService.getDateFromTimeStamp(
      this.departureTime,
      'HH:mm',
      timezone
    );
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
