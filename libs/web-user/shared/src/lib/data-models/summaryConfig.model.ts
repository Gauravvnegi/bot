import { DateService } from '@hospitality-bot/shared/utils';
import { get, set } from 'lodash';
import { GuestTypes, GuestRole } from '../constants/guest';

export interface Deserializable {
  deserialize(input: any, timezone): this;
}

export class SummaryDetails implements Deserializable {
  id: string;
  arrivalTime: number;
  departureTime: number;
  stateCompletedSteps: number;
  stayDetails: StayDetails;
  guestDetails: GuestDetails;
  paymentSummary: PaymentSummary;
  healthDeclaration: Health;
  termsStatus: boolean;

  deserialize(summary, timezone) {
    Object.assign(
      this,
      set({}, 'id', get(summary, ['id'])),
      set({}, 'arrivalTime', get(summary, ['arrivalTime'])),
      set({}, 'departureTime', get(summary, ['departureTime'])),
      set({}, 'stateCompletedSteps', get(summary, ['stateCompletedSteps'])),
      set({}, 'termsStatus', get(summary, ['termsStatus'], false))
    );
    this.guestDetails = new GuestDetails().deserialize(summary.guestDetails);
    this.healthDeclaration = new Health().deserialize(
      summary.healthDeclaration
    );
    this.stayDetails = new StayDetails().deserialize(
      summary.stayDetails,
      timezone
    );
    this.paymentSummary = new PaymentSummary().deserialize(
      summary.paymentSummary
    );
    return this;
  }
}

export class Health {
  statusMessage: Status;
  url: string;

  deserialize(summary) {
    Object.assign(
      this,
      set({}, 'statusMessage', get(summary, ['statusMessage'])),
      set({}, 'url', get(summary, ['url']))
    );
    return this;
  }
}

export class StayDetails {
  statusMessage: Status;
  arrivalTime: number;
  departureTime: number;
  roomType: string;
  adultsCount: number;
  kidsCount: number;
  comments: string;
  expectedArrivalTime: number;
  expectedDepartureTime: number;
  roomNumber: number;

  deserialize(summary, timezone) {
    Object.assign(
      this,
      set({}, 'statusMessage', get(summary, ['statusMessage'])),
      set({}, 'arrivalTime', get(summary, ['arrivalTime'])),
      set({}, 'departureTime', get(summary, ['departureTime'])),
      set({}, 'roomType', get(summary, ['roomType'])),
      set({}, 'adultsCount', get(summary, ['adultsCount'])),
      set({}, 'kidsCount', get(summary, ['kidsCount'])),
      set({}, 'comments', get(summary, ['comments'])),
      set({}, 'expectedArrivalTime', get(summary, ['expectedArrivalTime'])),
      set({}, 'expectedDepartureTime', get(summary, ['expectedDepartureTime'])),
      set({}, 'roomNumber', get(summary, ['roomNumber']))
    );
    return this;
  }

  getArrivalTime(timezone = '+05:30') {
    return DateService.getDateFromTimeStamp(
      +this.arrivalTime,
      'DD - MM - YYYY',
      timezone
    );
  }

  getDepartureTime(timezone = '+05:30') {
    return DateService.getDateFromTimeStamp(
      +this.departureTime,
      'DD - MM - YYYY',
      timezone
    );
  }
}

export class Guest {
  id: string;
  nameTitle: string;
  firstName: string;
  lastName: string;
  contactDetails: ContactDetails;
  nationality: object;
  document: DocumentDetails[];
  healthDeclarationFormId: object;
  pmsGuestId: object;
  regcardUrl: string;
  signatureUrl: string;
  statusMessage: Status;
  type: string;
  label: string;
  role: string;
  privacy: boolean;

  deserialize(summary) {
    Object.assign(
      this,
      set({}, 'id', get(summary, ['id'])),
      set({}, 'nameTitle', get(summary, ['nameTitle'])),
      set({}, 'firstName', get(summary, ['firstName'])),
      set({}, 'lastName', get(summary, ['lastName'])),
      set({}, 'statusMessage', get(summary, ['statusMessage'])),
      set({}, 'regcardUrl', get(summary, ['regcardUrl'])),
      set({}, 'type', get(summary, ['type'])),
      set({}, 'label', get(summary, ['label'])),
      set({}, 'role', get(summary, ['role'])),
      set({}, 'signatureUrl', get(summary, ['signatureUrl'])),
      set({}, 'privacy', get(summary, ['privacy']))
    );
    this.contactDetails = new ContactDetails().deserialize(
      summary.contactDetails
    );
    return this;
  }
}

export class PaymentSummary {
  statusMessage: Status;
  totalAmount: number;
  taxAmount: number;
  totalDiscount: number;
  subtotal: number;
  paidAmount: number;
  dueAmount: number;
  payableAmount: number;

  deserialize(summary) {
    Object.assign(
      this,
      set({}, 'statusMessage', get(summary, ['statusMessage'])),
      set({}, 'totalAmount', get(summary, ['totalAmount'])),
      set({}, 'taxAmount', get(summary, ['taxAmount'])),
      set({}, 'totalDiscount', get(summary, ['totalDiscount'])),
      set({}, 'subtotal', get(summary, ['subtotal'])),
      set({}, 'paidAmount', get(summary, ['paidAmount'])),
      set({}, 'dueAmount', get(summary, ['dueAmount'])),
      set({}, 'payableAmount', get(summary, ['payableAmount']))
    );
    return this;
  }
}

export class GuestDetails {
  primaryGuest: Guest;
  guests: Guest[];

  deserialize(input: any) {
    this.guests = new Array<Guest>();
    input.primaryGuest &&
      this.guests.push(
        new Guest().deserialize({
          ...input.primaryGuest,
          ...{
            type: GuestTypes.primary,
            label: 'Primary Guest',
            role: GuestRole.undefined,
          },
        })
      );
    input.sharerGuests &&
      input.sharerGuests.forEach((guest) => {
        this.guests.push(
          new Guest().deserialize({
            ...guest,
            ...{
              type: GuestTypes.secondary,
              label: 'Sharer',
              role: GuestRole.sharer,
            },
          })
        );
      });
    input.accompanyGuests &&
      input.accompanyGuests.forEach((guest) => {
        this.guests.push(
          new Guest().deserialize({
            ...guest,
            ...{
              type: GuestTypes.secondary,
              label: 'Accompanied / Kids',
              role: GuestRole.accompany,
            },
          })
        );
      });
    input.kids &&
      input.kids.forEach((guest) => {
        this.guests.push(
          new Guest().deserialize({
            ...guest,
            ...{
              type: GuestTypes.secondary,
              label: 'Accompanied / Kids',
              role: GuestRole.kids,
            },
          })
        );
      });
    return this;
  }
}

export class ContactDetails {
  cc: string;
  mobileNumber: string;
  emailId: string;

  deserialize(summary) {
    Object.assign(
      this,
      set({}, 'cc', this.getNationality(get(summary, ['cc']))),
      set({}, 'mobileNumber', get(summary, ['contactNumber'])),
      set({}, 'emailId', get(summary, ['emailId']))
    );
    return this;
  }

  getNationality(cc) {
    if (cc && cc.length) {
      return cc.includes('+') ? cc : `+${cc}`;
    }
    return cc;
  }
}

export class DocumentDetails {
  id: string;
  documentType: string;
  frontUrl: string;
  backUrl: string;
}

export class Status {
  code: number;
  status: string;
  state: string;
  remarks: string;
}
