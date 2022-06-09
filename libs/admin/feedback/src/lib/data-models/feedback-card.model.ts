import {
  Booking,
  Room,
} from 'libs/admin/dashboard/src/lib/data-models/reservation-table.model';
import { DateService } from 'libs/shared/utils/src/lib/date.service';
import { get, set, trim } from 'lodash';
import { feedback } from '../constants/feedback';
import { Feedback, StayFeedback } from './feedback-datatable.model';

export interface Deserializable {
  deserialize(input: any, hotelNationality: string): this;
}
export class FeedbackList {
  records: FeedbackRecord[];

  deserialize(input, outlets, feedbackType, colorMap) {
    this.records = new Array<FeedbackRecord>();
    input?.records?.forEach((record) =>
      this.records.push(
        new FeedbackRecord().deserialize(
          record,
          outlets,
          feedbackType,
          colorMap
        )
      )
    );

    return this;
  }
}

export class FeedbackRecord {
  created: number;
  departmentLabel: string;
  departmentName: string;
  feedback;
  feedbackId: string;
  id: string;
  jobDuration: number;
  remarks;
  sla: number;
  status: string;
  timeOut: false;
  updated: number;
  userId: string;
  userName: string;

  deserialize(input, outlets, feedbackType, colorMap) {
    Object.assign(
      this,
      set({}, 'departmentLabel', get(input, ['departmentLabel'])),
      set({}, 'departmentName', get(input, ['departmentName'])),
      set({}, 'created', get(input, ['created'])),
      set({}, 'feedbackId', get(input, ['feedbackId'])),
      set({}, 'id', get(input, ['id'])),
      set({}, 'jobDuration', get(input, ['jobDuration'])),
      set({}, 'remarks', get(input, ['remarks'])),
      set({}, 'sla', get(input, ['sla'])),
      set({}, 'status', get(input, ['status'])),
      set({}, 'timeOut', get(input, ['timeOut'])),
      set({}, 'updated', get(input, ['updated'])),
      set({}, 'userId', get(input, ['userId'])),
      set({}, 'userName', get(input, ['userName']))
    );
    this.feedback =
      feedbackType === feedback.types.transactional
        ? new Feedback().deserialize(input.feedback, outlets)
        : new StayFeedback().deserialize(input.feedback, outlets, colorMap);
    return this;
  }

  getTableOrRoomNo(feedbackType) {
    return feedbackType === feedback.types.stay
      ? `RNO: ${this.feedback.tableOrRoomNumber}`
      : `TNO: ${this.feedback.bookingDetails.tableOrRoomNumber}`;
  }

  getProfileNickName() {
    const nameList = [
      this.feedback.guest.firstName,
      this.feedback.guest.lastName,
    ];
    return nameList
      .map((i, index) => {
        if ([0, 1].includes(index)) return i.charAt(0);
        else return '';
      })
      .join('')
      .toUpperCase();
  }
}

export class GuestDetails {
  records: GuestDetail[];
  id: string;

  deserialize(input, colorMap) {
    this.records = new Array();
    input.forEach((item) => {
      this.records.push(new GuestDetail().deserialize(item, colorMap));
    });
    return this;
  }
}

export class GuestDetail {
  reservation: Reservation;
  type: string;
  subType: string;

  deserialize(input, colorMap) {
    if (input.guestReservation) {
      this.reservation = new Reservation().deserialize(
        input.guestReservation,
        input.subType,
        colorMap
      );
    }
    if (input.feedback)
      Object.assign(
        this,
        set({}, 'type', get(input, ['type'])),
        set({}, 'subType', get(input, ['subType']))
      );

    return this;
  }
}

export class Reservation {
  rooms: Room;
  feedback: Feedback;
  booking: Booking;
  type: string;
  deserialize(input: any, type: string, colorMap) {
    this.rooms = new Room().deserialize(input.stayDetails);
    this.booking = new Booking().deserialize(input);
    this.type = type;
    return this;
  }

  getTitle() {
    switch (this.type) {
      case 'UPCOMING':
        return 'Upcoming Booking';
      case 'PAST':
        return 'Past Booking';
      case 'PRESENT':
        return 'Current Booking';
    }
  }
}

export class Guest implements Deserializable {
  id;
  nameTitle;
  name: string;
  firstName: string;
  lastName: string;
  countryCode: string;
  phoneNumber: string;
  email: string;
  documents?: any[];
  nationality: string;
  nps: string;
  churn: string;
  numberOfBookings: number;
  deserialize(input: any) {
    Object.assign(
      this,

      set({}, 'id', get(input, ['id'])),
      set({}, 'nameTitle', get(input, ['nameTitle'], '')),
      set({}, 'name', get(input, ['name'])),
      set({}, 'firstName', trim(get(input, ['firstName'], 'No'))),
      set({}, 'lastName', trim(get(input, ['lastName'], 'Name'))),
      set(
        {},
        'countryCode',
        this.getNationality(get(input, ['contactDetails', 'cc']))
      ),
      set({}, 'phoneNumber', get(input, ['contactDetails', 'contactNumber'])),
      set({}, 'email', get(input, ['contactDetails', 'emailId'])),
      set({}, 'documents', get(input, ['documents'])),
      set({}, 'nationality', get(input, ['nationality'])),
      set({}, 'nps', get(input, ['attributes', 'overAllNps'])),
      set({}, 'churn', get(input, ['attributes', 'churnProbalilty'])),
      set(
        {},
        'numberOfBookings',
        get(input, ['attributes', 'numberOfBookings'])
      )
    );
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
  getProfileNickName() {
    const nameList = [this.firstName, this.lastName];
    return nameList
      .map((i, index) => {
        if ([0, 1].includes(index)) return i.charAt(0);
        else return '';
      })
      .join('')
      .toUpperCase();
  }
}

export class Requests implements Deserializable {
  records: Request[];
  deserialize(input) {
    this.records = new Array<Request>();
    input.forEach((item) => this.records.push(new Request().deserialize(item)));
    return this;
  }
}

export class Request implements Deserializable {
  action: string;
  itemCode: number;
  jobDuration: number;
  itemName: string;
  closedTime: number;
  requestTime: number;
  status: string;
  priority: string;
  id: number;
  deserialize(input: any) {
    Object.assign(
      this,
      set({}, 'action', get(input, ['action'])),
      set({}, 'itemCode', get(input, ['itemCode'])),
      set({}, 'jobDuration', get(input, ['jobDuration'])),
      set({}, 'itemName', get(input, ['itemName'])),
      set({}, 'closedTime', get(input, ['closedTime'])),
      set({}, 'requestTime', get(input, ['requestTime'])),
      set({}, 'status', get(input, ['status'])),
      set({}, 'priority', get(input, ['priority'])),
      set({}, 'id', get(input, ['id']))
    );

    return this;
  }

  getRequestDateTime(timezone = '+05:30') {
    return `${DateService.getDateFromTimeStamp(
      this.requestTime,
      'D-M-YYYY',
      timezone
    )} at ${DateService.getDateFromTimeStamp(
      this.requestTime,
      'h:mm a',
      timezone
    )}`;
  }

  getClosedTime(timezone = '+05:30') {
    if (this.closedTime)
      return `${DateService.getDateFromTimeStamp(
        this.closedTime,
        'D-M-YYYY',
        timezone
      )} at ${DateService.getDateFromTimeStamp(
        this.closedTime,
        'h:mm a',
        timezone
      )}`;
    else '------';
  }
}
