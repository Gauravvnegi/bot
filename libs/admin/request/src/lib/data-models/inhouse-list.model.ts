import { DateService } from '@hospitality-bot/shared/utils';
import { get, set, trim } from 'lodash';
import { JobRequestResponse } from '../types/response.types';

export class InhouseTable {
  entityStateCounts: any;
  entityStateLabels: any;
  entityTypeCounts: any;
  entityTypeLabels: any;
  records: InhouseData[];
  total: number;

  deserialize(input) {
    this.records = new Array<InhouseData>();
    Object.assign(
      this,
      set({}, 'entityStateCounts', get(input, ['entityStateCounts'])),
      set({}, 'entityStateLabels', get(input, ['entityStateLabels'])),
      set({}, 'entityTypeCounts', get(input, ['entityTypeCounts'])),
      set({}, 'entityTypeLabels', get(input, ['entityTypeLabels'])),
      set({}, 'total', get(input, ['total']))
    );

    input?.records?.forEach((record) =>
      this.records.push(new InhouseData().deserialize(record))
    );

    return this;
  }
}

export class InhouseData {
  action: string;
  closedTime: number;
  confirmationNumber: string;
  elapsedTime: number;
  guestDetails: GuestType;
  entityId: string;
  id: string;
  itemCode: string;
  itemName: string;
  itemId: string;
  jobDuration: number;
  sla: number;
  jobID: string;
  jobNo: string;
  journey: string;
  priority: string;
  quantity: number;
  remarks: string;
  requestTime: number;
  reservationId: string;
  rooms: Room[];
  state: string;
  status: string;
  stayDetails: StayDetails;
  timeLeft: number;
  source: string;
  assigneeId: string;
  assigneeName: string;
  isFocused: boolean;
  assignedToDefaultItemUser: boolean;

  deserialize(input: JobRequestResponse) {
    this.rooms = new Array<Room>();
    this.guestDetails = new GuestType().deserialize(input?.guestDetails);

    this.stayDetails = new StayDetails().deserialize(input?.stayDetails);
    input?.rooms?.forEach((room) =>
      this.rooms.push(new Room().desrialize(room))
    );
    Object.assign(
      this,
      set({}, 'action', get(input, ['action'])),
      set({}, 'closedTime', get(input, ['closedTime'])),
      set({}, 'confirmationNumber', get(input, ['confirmationNumber'])),
      set({}, 'elapsedTime', get(input, ['elapsedTime'])),
      set({}, 'sla', get(input, ['sla'])),
      set({}, 'entityId', get(input, ['entityId'])),
      set({}, 'id', get(input, ['id'])),
      set({}, 'itemCode', get(input, ['itemCode'])),
      set({}, 'itemName', get(input, ['itemName'])),
      set({}, 'jobDuration', get(input, ['jobDuration'])),
      set({}, 'jobID', get(input, ['jobID'])),
      set({}, 'jobNo', get(input, ['jobNo'])),
      set({}, 'journey', get(input, ['journey'])),
      set({}, 'priority', get(input, ['priority'])),
      set({}, 'quantity', get(input, ['quantity'])),
      set({}, 'remarks', get(input, ['remarks'])),
      set({}, 'requestTime', get(input, ['requestTime'])),
      set({}, 'reservationId', get(input, ['reservationId'])),
      set({}, 'state', get(input, ['state'])),
      set({}, 'status', get(input, ['status']))
    );
    this.assigneeName = input?.assigneeName;
    this.timeLeft = input.timeLeft * 1000;
    this.source = input.source;
    this.itemId = input.itemId;
    this.assigneeId = input?.assigneeId;
    this.isFocused = input?.focused;
    this.assignedToDefaultItemUser = input?.assignedToDefaultItemUser;

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

  getSLA() {
    // if (this.elapsedTime)
    //   return `${Math.round(
    //     ((this.elapsedTime % 86400000) % 3600000) / 60000
    //   )}m`;
    if (this.sla) {
      return `${this.sla}m`;
    } else '------';
  }

  getSLAvalue() {
    if (this.elapsedTime)
      return Math.round(((this.elapsedTime % 86400000) % 3600000) / 60000);
    else 0;
  }

  getAction() {
    switch (this.action) {
      case 'Pending':
        return 'To-Do';
      default:
        return this.action;
    }
  }
}

export class Room {
  chargeCode: string;
  roomClass: string;
  roomNumber: number;
  status: string;
  type: string;
  unit: number;

  desrialize(input) {
    Object.assign(
      this,
      set({}, 'chargeCode', get(input, ['chargeCode'])),
      set({}, 'roomClass', get(input, ['roomClass'])),
      set({}, 'roomNumber', get(input, ['roomNumber'])),
      set({}, 'status', get(input, ['status'])),
      set({}, 'type', get(input, ['type'])),
      set({}, 'unit', get(input, ['unit']))
    );

    return this;
  }

  getRoomNumberAndType() {
    return this.roomNumber + (this.type ? ' - ' + this.type : '');
  }
}

export class GuestType {
  primaryGuest;
  secondaryGuest = [];
  deserialize(input) {
    this.primaryGuest = new Guest().deserialize(input?.primaryGuest);
    input?.accompanyGuests?.forEach((guest) => {
      this.secondaryGuest.push(new Guest().deserialize(guest));
    });
    input?.sharerGuests?.forEach((guest) => {
      this.secondaryGuest.push(new Guest().deserialize(guest));
    });
    input?.kids?.forEach((guest) => {
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

  getPhoneNumbers() {
    let phoneNumbers = this.primaryGuest.getPhoneNumber();
    this.secondaryGuest.forEach((guest) => {
      if (guest.getPhoneNumber() && guest.getPhoneNumber() !== ' ') {
        phoneNumbers += `,\n${guest.getPhoneNumber()}`;
      }
    });

    return phoneNumbers;
  }
}

export class Guest {
  age: number;
  documentRequired: boolean;
  regcardUrl: string;
  id;
  salutation;
  firstName: string;
  lastName: string;
  countryCode: string;
  phoneNumber: string;
  email: string;
  documents?: any[];
  nationality: string;
  deserialize(input: any) {
    Object.assign(
      this,
      set({}, 'id', get(input, ['id'])),
      set({}, 'salutation', get(input, ['salutation'], '')),
      set({}, 'firstName', trim(get(input, ['firstName']))),
      set({}, 'lastName', trim(get(input, ['lastName']))),
      set(
        {},
        'countryCode',
        this.getNationality(get(input, ['contactDetails', 'cc']))
      ),
      set({}, 'phoneNumber', get(input, ['contactDetails', 'contactNumber'])),
      set({}, 'email', get(input, ['contactDetails', 'emailId'])),
      set({}, 'documents', get(input, ['documents'])),
      set({}, 'nationality', get(input, ['nationality'])),
      set({}, 'age', get(input, ['age'])),
      set({}, 'documentRequired', get(input, ['documentRequired'])),
      set({}, 'regcardUrl', get(input, ['regcardUrl']))
    );
    return this;
  }

  getFullName() {
    return `${this.firstName} ${this.lastName}`;
  }

  getPhoneNumber() {
    return this.phoneNumber
      ? `${this.countryCode ? this.countryCode : ''} ${this.phoneNumber}`
      : '';
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

export class StayDetails {
  adultsCount: number;
  arrivalTime: number;
  checkInComment: string;
  comments: string;
  departureTime: number;
  expectedArrivalTime: number;
  expectedDepartureTime: number;
  kidsCount: number;
  roomNumber: number;
  roomType: string;
  status: string;
  statusMessage: Status;

  deserialize(input) {
    Object.assign(
      this,
      set({}, 'adultsCount', get(input, ['adultsCount'])),
      set({}, 'arrivalTime', get(input, ['arrivalTime'])),
      set({}, 'checkInComment', get(input, ['checkInComment'])),
      set({}, 'comments', get(input, ['comments'])),
      set({}, 'departureTime', get(input, ['departureTime'])),
      set({}, 'expectedArrivalTime', get(input, ['expectedArrivalTime'])),
      set({}, 'expectedDepartureTime', get(input, ['expectedDepartureTime'])),
      set({}, 'kidsCount', get(input, ['kidsCount'])),
      set({}, 'roomNumber', get(input, ['roomNumber'])),
      set({}, 'roomType', get(input, ['roomType'])),
      set({}, 'status', get(input, ['status']))
    );

    this.statusMessage = new Status().deserialize(input?.statusMessage);

    return this;
  }
}

export class Status {
  code: number;
  remarks: string;
  state: string;
  status: string;

  deserialize(input) {
    Object.assign(
      this,
      set({}, 'code', get(input, ['code'])),
      set({}, 'remarks', get(input, ['remarks'])),
      set({}, 'state', get(input, ['state'])),
      set({}, 'status', get(input, ['status']))
    );

    return this;
  }
}
