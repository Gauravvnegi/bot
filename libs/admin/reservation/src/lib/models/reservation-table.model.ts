import { EntityState } from '@hospitality-bot/admin/shared';
import { DateService } from '@hospitality-bot/shared/utils';
import { ReservationTab } from 'libs/admin/dashboard/src/lib/types/response.type';
import { TableValue } from 'libs/admin/dashboard/src/lib/constants/tabFilterItem';
import { get, set, trim } from 'lodash';
import * as moment from 'moment';
export interface IDeserializable {
  deserialize(input: any, hotelNationality: string): this;
}

export class ReservationTable implements IDeserializable {
  records: Reservation[];
  entityStateCounts: EntityState<string>;
  entityTypeCounts: EntityState<ReservationTab>;
  totalRecord: number;

  deserialize(input: any, timezone) {
    this.records = input.records.map((record) =>
      new Reservation().deserialize(record, timezone)
    );
    this.entityStateCounts = input?.entityStateCounts;
    this.entityTypeCounts = input?.entityTypeCounts;
    this.totalRecord = input?.total;
    return this;
  }
}

export class Reservation implements IDeserializable {
  rooms;
  guests;
  booking;
  payment;
  status;
  feedback;
  packages;
  currentJourney;
  deserialize(input: any, timezone) {
    this.booking = new Booking().deserialize(input);
    this.rooms = new Room().deserialize(input.stayDetails);
    this.guests = new GuestType().deserialize(input.guestDetails);
    this.payment = new Payment().deserialize(input.paymentSummary);
    this.status = new Status().deserialize(input);
    // this.feedback = new Feedback().deserialize(input.feedback);
    // this.packages = new Package().deserialize(input.packages);
    this.currentJourney = new CurrentJourney().deserialize(input);
    return this;
  }
}

export class Package implements IDeserializable {
  paidPackages;
  deserialize(input: any) {
    this.paidPackages = input.paidPackages.map((packageDetail) => {
      return new PackageDetail().deserialize(packageDetail);
    });
    return this;
  }

  // getPaidPackagesLabels() {
  //   // return this.paidPackages.map((paidPackage) => paidPackage.label).join(', ');
  //   return this.paidPackages.length
  //     ? `${this.paidPackages[0].label}${
  //         this.paidPackages.length > 1
  //           ? ` (+${this.paidPackages.length - 1})`
  //           : ''
  //       }`
  //     : '';
  // }
}

export class PackageDetail implements IDeserializable {
  id;
  label;
  deserialize(input: any) {
    Object.assign(
      this,
      set({}, 'id', get(input, ['id'])),
      set({}, 'label', get(input, ['name']))
    );
    return this;
  }
}

export class Feedback implements IDeserializable {
  rating;
  comments: string;
  status: string;
  suggestions;
  deserialize(input: any) {
    Object.assign(
      this,
      set({}, 'rating', trim(get(input, ['rating']))),
      set({}, 'comments', trim(get(input, ['comments']))),
      set({}, 'status', get(input, ['statusMessage', 'status']))
    );

    if (input?.quickServices) {
      this.suggestions =
        input.quickServices &&
        input.quickServices.map((service) => {
          return new FeedbackSuggestion().deserialize(service);
        });
    }
    return this;
  }
}

export class FeedbackSuggestion implements IDeserializable {
  id;
  label;
  url;
  deserialize(input) {
    this.id = input.serviceId;
    return this;
  }
}

export class Status implements IDeserializable {
  journeyStatus;
  stepsStatus;
  deserialize(input: any) {
    this.journeyStatus = new JourneyStatus().deserialize(input.journeysStatus);
    this.stepsStatus = new StepsStatus().deserialize(input.stepsStatus);

    return this;
  }
}

export class CurrentJourney implements IDeserializable {
  currentJourneyName;
  currentJourneyStatus;
  deserialize(input) {
    Object.assign(
      this,
      set({}, 'currentJourneyName', get(input, ['currentJourney'])),
      set({}, 'currentJourneyStatus', get(input, ['currentJourneyState']))
    );
    return this;
  }
}

export class JourneyStatus implements IDeserializable {
  new;
  preCheckin;
  checkin;
  checkout;
  deserialize(input) {
    Object.assign(
      this,
      set({}, 'new', get(input, ['NEW'])),
      set({}, 'preCheckin', get(input, ['PRECHECKIN'])),
      set({}, 'checkin', get(input, ['CHECKIN'])),
      set({}, 'checkout', get(input, ['CHECKOUT']))
    );
    return this;
  }
}

export class StepsStatus implements IDeserializable {
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
export class Payment implements IDeserializable {
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
      set(
        {},
        'totalAmount',
        parseFloat(get(input, ['totalAmount'])).toFixed(2)
      ),
      set({}, 'taxAmount', get(input, ['taxAmount'])),
      set({}, 'totalDiscount', get(input, ['totalDiscount'])),
      set({}, 'subtotal', get(input, ['subtotal'])),
      set({}, 'paidAmount', get(input, ['paidAmount'])),
      set({}, 'dueAmount', parseFloat(get(input, ['dueAmount'])).toFixed(2)),
      set({}, 'currency', get(input, ['currency']))
    );
    return this;
  }
}

export class Booking implements IDeserializable {
  bookingId;
  bookingNumber;
  arrivalTimeStamp;
  departureTimeStamp;
  expectedArrivalTimeStamp;
  expectedDepartureTimeStamp;

  deserialize(input) {
    Object.assign(
      this,
      set({}, 'bookingNumber', get(input, ['number'])),
      set({}, 'bookingId', get(input, ['id'])),
      set({}, 'arrivalTimeStamp', get(input, ['arrivalTime'])),
      set({}, 'departureTimeStamp', get(input, ['departureTime'])),
      set(
        {},
        'expectedArrivalTimeStamp',
        get(input, ['stayDetails', 'arrivalTime'])
      ),
      set(
        {},
        'expectedDepartureTimeStamp',
        get(input, ['stayDetails', 'departureTime'])
      )
    );
    return this;
  }

  getArrivalDate(timezone = '+05:30') {
    if (this.expectedArrivalTimeStamp === 0) {
      return DateService.getDateFromTimeStamp(
        this.arrivalTimeStamp,
        'DD/M/YY',
        timezone
      );
    } else {
      return DateService.getDateFromTimeStamp(
        this.expectedArrivalTimeStamp,
        'DD/M/YY',
        timezone
      );
    }
  }

  getDepartureDate(timezone = '+05:30') {
    if (this.expectedArrivalTimeStamp === 0) {
      return DateService.getDateFromTimeStamp(
        this.departureTimeStamp,
        'DD/M/YY',
        timezone
      );
    } else {
      return DateService.getDateFromTimeStamp(
        this.expectedDepartureTimeStamp,
        'DD/M/YY',
        timezone
      );
    }
  }

  getArrivalTime(timezone = '+05:30') {
    if (this.expectedArrivalTimeStamp === 0) {
      return DateService.getDateFromTimeStamp(
        this.arrivalTimeStamp,
        'HH:mm',
        timezone
      );
    } else {
      return DateService.getDateFromTimeStamp(
        this.expectedArrivalTimeStamp,
        'HH:mm',
        timezone
      );
    }
  }

  getArrivalTimeStamp() {
    if (this.expectedArrivalTimeStamp === 0) {
      return this.arrivalTimeStamp;
    } else {
      return this.expectedArrivalTimeStamp;
    }
  }

  getDepartureTime(timezone = '+05:30') {
    if (this.expectedDepartureTimeStamp === 0) {
      return DateService.getDateFromTimeStamp(
        this.departureTimeStamp,
        'HH:mm',
        timezone
      );
    } else {
      return DateService.getDateFromTimeStamp(
        this.expectedDepartureTimeStamp,
        'HH:mm',
        timezone
      );
    }
  }

  getDaysAndNights(timezone = '+05:30') {
    const diffInDays = moment(this.departureTimeStamp)
      .utcOffset(timezone)
      .diff(moment(this.arrivalTimeStamp).utcOffset(timezone), 'days');
    return {
      days: diffInDays + 1,
      nights: diffInDays,
    };
  }
}

export class GuestType implements IDeserializable {
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

export class Guest implements IDeserializable {
  id;
  salutation;
  firstName: string;
  lastName: string;
  countryCode: string;
  phoneNumber: string;
  email: string;
  documents?: any[];
  nationality: string;
  fullName: string;
  deserialize(input: any) {
    Object.assign(
      this,
      set({}, 'id', get(input, ['id'])),
      set({}, 'salutation', get(input, ['salutation'], '')),
      set({}, 'firstName', trim(get(input, ['firstName'], 'No'))),
      set({}, 'lastName', trim(get(input, ['lastName'], 'Name'))),
      set(
        {},
        'fullName',
        `${trim(get(input, ['firstName'], 'No'))} ${trim(
          get(input, ['lastName'], 'Name')
        )}`
      ),
      set(
        {},
        'countryCode',
        this.getNationality(get(input, ['contactDetails', 'cc']))
      ),
      set({}, 'phoneNumber', get(input, ['contactDetails', 'contactNumber'])),
      set({}, 'email', get(input, ['contactDetails', 'emailId'])),
      set({}, 'documents', get(input, ['documents'])),
      set({}, 'nationality', get(input, ['nationality']))
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
    const nameList = [this.firstName, this.lastName || ''];
    return nameList
      .map((i, index) => {
        if ([0, 1].includes(index)) return i.charAt(0);
        else return '';
      })
      .join('')
      .toUpperCase();
  }
}

export class Room implements IDeserializable {
  roomNumber;
  type;
  unit;
  chargeCode;
  status;
  roomClass;
  adultCount?: number;
  kidsCount?: number;
  deserialize(input: any) {
    this.roomNumber = input?.room?.roomNumber;
    this.type = input.room?.type;
    this.unit = input.room?.unit;
    this.chargeCode = input?.room?.chargeCode;
    this.status = input.room?.status;
    this.roomClass = input.room?.roomClass;
    this.adultCount = input?.adultsCount;
    this.kidsCount = input?.kidsCount;

    return this;
  }
}

export class FileData {
  size: number;
  file_name: string;
  file_download_url: string;
  file_type: string;
}

export class CalendarOccupancy {
  dataMap = new Map<
    number,
    Map<string, { available: number; occupancy: number }>
  >();

  deserialize(input: CalendarOccupancyResponse) {
    Object.entries(input).forEach(([dateEpoch, roomData]) => {
      const parsedDateEpoch = parseInt(dateEpoch, 10);
      const roomMap = new Map<
        string,
        { available: number; occupancy: number }
      >();

      Object.entries(roomData).forEach(([roomId, values]) => {
        roomMap.set(roomId, values);
      });

      this.dataMap.set(parsedDateEpoch, roomMap);
    });

    return this.dataMap;
  }
}

export type CalendarOccupancyResponse = {
  date: {
    roomTypeId: {
      available: number;
      occupancy: number;
    };
  };
};
