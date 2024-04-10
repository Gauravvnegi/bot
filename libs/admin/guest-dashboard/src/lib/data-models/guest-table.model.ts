import { get, set, trim } from 'lodash';
import {
  Booking,
  CurrentJourney,
  Feedback,
  Payment,
  Room,
  Status,
} from '../../../../reservation/src/lib/models/reservation-table.model';
import { EntityState } from '@hospitality-bot/admin/shared';

import {
  convertToNormalCase,
  getFullName,
} from 'libs/admin/shared/src/lib/utils/valueFormatter';
import { GuestListResponse, GuestReservationType } from '../types/guest.type';

export interface IDeserializable {
  deserialize(input: any, hotelNationality: string): this;
}

export class GuestTable implements IDeserializable {
  totalRecord: number;
  entityStateCounts: EntityState<string>;
  entityStateLabels: EntityState<string>;
  records: GuestData[];

  deserialize(input: GuestListResponse) {
    this.records =
      input.records?.map((item) => new GuestData().deserialize(item)) ?? [];
    this.entityStateCounts = input.entityStateCounts;
    this.entityStateLabels = input?.entityStateLabels;

    this.totalRecord = input.total;
    return this;
  }
}

export class GuestData {
  dateOfBirth: string;
  contactDetails;
  firstName: string;
  lastName: string;
  salutation: string;
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
  vip: boolean;
  fullName: string;
  reservationId: string;
  id: string;
  deserialize(input: GuestReservationType) {
    const guest = input.guestDetails.primaryGuest;
    this.firstName = guest?.firstName;
    this.lastName = guest?.lastName;
    this.id = guest?.id;
    // this.dateOfBirth= input?.guestDetails?.primaryGuest?.

    // this.salutation =guest?.
    this.nationality = guest?.nationality;
    this.countryCode = guest?.contactDetails?.cc;
    this.phoneNumber = guest?.contactDetails?.contactNumber;
    this.email = guest?.contactDetails?.emailId;
    this.documents = this.documents = guest.documents;
    this.booking = new Booking().deserialize(input);
    // this.feedback = new Feedback().deserialize(input.feedback);
    this.payment = new Payment().deserialize(input.paymentSummary);
    this.status = new Status().deserialize(input);
    this.currentJourney = new CurrentJourney().deserialize(input);
    this.rooms = new Room().deserialize(input.stayDetails);
    this.vip = input.vip;
    this.reservationId = input?.id;
    this.fullName = `${this.firstName ? this.firstName.trim() : ''}${
      this.firstName && this.lastName ? ' ' : ''
    }${this.lastName ? this.lastName.trim() : ''}`;

    return this;
  }
  getFullName() {
    return getFullName(this.firstName, this.lastName);
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
}

export class EntityTypeCounts {
  ALL: number;
  ARRIVAL: number;
  OUTGUEST: number;
  INHOUSE: number;
  DEPARTURE: number;

  deserialize(data, total) {
    Object.assign(
      this,
      set({}, 'ARRIVAL', get(data, ['ARRIVAL'])),
      set({}, 'OUTGUEST', get(data, ['OUTGUEST'])),
      set({}, 'INHOUSE', get(data, ['INHOUSE'])),
      set({}, 'DEPARTURE', get(data, ['DEPARTURE']))
    );
    this.ALL = total ?? 0;
    return this;
  }
}

export class EntityStateCounts {
  HIGHPOTENTIAL: number;
  VIP: number;
  HIGHRISK: number;

  deserialize(data) {
    Object.assign(
      this,
      set({}, 'HIGHPOTENTIAL', get(data, ['HIGHPOTENTIAL'])),
      set({}, 'VIP', get(data, ['VIP'])),
      set({}, 'HIGHRISK', get(data, ['HIGHRISK']))
    );
    return this;
  }
}

export class Guest implements IDeserializable {
  dateOfBirth: string;
  contactDetails;
  firstName: string;
  id: string;
  lastName: string;
  salutation: string;
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
  vip: boolean;
  fullName: string;
  deserialize(input: any) {
    Object.assign(
      this,
      set({}, 'dateOfBirth', get(input, ['dateOfBirth'])),
      set({}, 'contactDetails', get(input, ['contactDetails'])),
      set({}, 'id', get(input, ['id'])),
      set({}, 'title', get(input, ['title'])),
      set({}, 'firstName', trim(get(input, ['firstName'], 'No'))),
      set({}, 'lastName', trim(get(input, ['lastName'], 'Name'))),
      set(
        {},
        'fullName',
        `${trim(get(input, ['firstName'], 'No'))} ${trim(
          get(input, ['lastName'], 'Name')
        )}`
      ),
      set({}, 'salutation', get(input, ['salutation'], '')),
      set({}, 'nationality', get(input, ['nationality'])),
      set(
        {},
        'countryCode',
        this.getNationality(get(input, ['contactDetails', 'cc']))
      ),
      set({}, 'phoneNumber', get(input, ['contactDetails', 'contactNumber'])),
      set({}, 'email', get(input, ['contactDetails', 'emailId']))
    );
    if (input.reservation[0]) {
      const reservation = input.reservation[0];
      this.booking = new Booking().deserialize(reservation);
      this.feedback = new Feedback().deserialize(reservation.feedback);
      this.payment = new Payment().deserialize(reservation.paymentSummary);
      this.status = new Status().deserialize(reservation);
      this.currentJourney = new CurrentJourney().deserialize(input);
      this.rooms = new Room().deserialize(reservation.stayDetails);
      this.vip = reservation.vip;
      if (reservation.guestDetails.primaryGuest.id === input.id) {
        this.documents = reservation.guestDetails.primaryGuest.documents;
      } else {
        const keys = Object.keys(reservation.guestDetails.allGuest);
        keys.forEach((key) => {
          if (key === input.id) {
            this.documents = reservation.guestDetails.allGuest[key].documents;
          }
        });
      }
    }
    return this;
  }

  getFullName() {
    return getFullName(this.firstName, this.lastName);
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
}

export class GuestAttributes {
  id: string;
  // overAllNps: number;
  transactionUsage: string;
  totalSpend: number;
  potential: string;
  churnProbalilty: number;
  churnPrediction: string;

  deserialize(data) {
    Object.assign(
      this,
      set({}, 'id', get(data, ['id'])),
      // set({}, 'overAllNps', get(data, ['overAllNps'])),
      set({}, 'transactionUsage', get(data, ['transactionUsage'])),
      set({}, 'totalSpend', get(data, ['totalSpend'])),
      set({}, 'potential', get(data, ['potential'])),
      set({}, 'churnProbalilty', get(data, ['churnProbalilty'])),
      set({}, 'churnPrediction', get(data, ['churnPrediction']))
    );
    return this;
  }
}

export class Reservation implements IDeserializable {
  rooms: Room;
  feedback: Feedback;
  booking: Booking;
  guestAttributes: GuestAttributes;
  deserialize(input: any) {
    this.rooms = new Room().deserialize(input.stayDetails);
    this.feedback = new Feedback().deserialize(input.feedback);
    this.booking = new Booking().deserialize(input);
    this.guestAttributes = new GuestAttributes().deserialize(
      input.guestAttributes
    );
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

export class GuestDocumentList {
  totalRecord: number;
  entityTypeCounts: EntityState<string>;
  entityStateCounts: EntityState<string>;
  records: GuestDocumentDetails[];

  deserialize(
    input: GuestDocsOrPaymentListResponse<GuestDocumentDetailsResponse>
  ) {
    this.records = input.records.map((record) =>
      new GuestDocumentDetails().deserialize(record)
    );
    this.entityStateCounts = input?.entityStateCounts;
    this.totalRecord = input?.total;
    return this;
  }
}

export class GuestDocumentDetails {
  dateOfBirth: string;
  contactDetails;
  firstName: string;
  id: string;
  lastName: string;
  salutation: string;
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
  vip: boolean;
  fullName: string;
  reservationId: string;
  deserialize(input: GuestDocumentDetailsResponse) {
    this.dateOfBirth = input?.dateOfBirth;
    this.contactDetails = input?.contactDetails;
    this.firstName = input?.firstName;
    this.lastName = input?.lastName;
    this.id = input.id;
    this.countryCode = input?.contactDetails?.cc;
    this.phoneNumber = input?.contactDetails?.contactNumber;
    this.email = input?.contactDetails?.emailId;
    const reservationDetails = input?.reservation[0];

    reservationDetails.stepsStatus['DOCUMENTS'] =
      reservationDetails?.guestDetails?.allGuest[
        input?.id
      ]?.statusMessage?.status;

    this.booking = new Booking().deserialize(reservationDetails);
    // this.feedback = new Feedback().deserialize(input.feedback);
    this.payment = new Payment().deserialize(reservationDetails.paymentSummary);
    this.status = new Status().deserialize(reservationDetails);
    this.currentJourney = new CurrentJourney().deserialize(reservationDetails);
    this.rooms = new Room().deserialize(reservationDetails.stayDetails);
    this.vip = reservationDetails.vip;
    this.reservationId = reservationDetails?.id;

    set(
      {},
      'fullName',
      `${trim(get(input, ['firstName'], 'No'))} ${trim(
        get(input, ['lastName'], 'Name')
      )}`
    );

    return this;
  }
  getFullName() {
    return getFullName(this.firstName, this.lastName);
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
}

export class GuestPaymentList {
  totalRecord: number;
  entityTypeCounts: EntityState<string>;
  entityStateCounts: EntityState<string>;
  records: GuestPaymentDetails[];

  deserialize(
    input: GuestDocsOrPaymentListResponse<GuestPaymentDetailsResponse>
  ) {
    this.records = input.records.map((record) =>
      new GuestPaymentDetails().deserialize(record)
    );
    this.entityStateCounts = input?.entityStateCounts;
    this.totalRecord = input?.total;
    return this;
  }
}

export class GuestPaymentDetails {
  dateOfBirth: string;
  contactDetails;
  firstName: string;
  id: string;
  lastName: string;
  salutation: string;
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
  vip: boolean;
  fullName: string;
  reservationId: string;
  deserialize(input: GuestPaymentDetailsResponse) {
    const guest = input?.guestDetails?.primaryGuest;
    this.id = guest.id;
    this.firstName = guest?.firstName;
    this.lastName = guest?.lastName;
    // this.dateOfBirth= input?.guestDetails?.primaryGuest?.
    this.contactDetails = guest?.contactDetails;
    // this.salutation =guest?.
    this.nationality = guest?.nationality;
    this.countryCode = guest?.contactDetails?.cc;
    this.phoneNumber = guest?.contactDetails?.contactNumber;
    this.email = guest?.contactDetails?.emailId;
    this.documents = this.documents = guest.documents;
    this.booking = new Booking().deserialize(input);
    // this.feedback = new Feedback().deserialize(input.feedback);
    this.payment = new Payment().deserialize(input.paymentSummary);
    this.status = new Status().deserialize(input);
    this.currentJourney = new CurrentJourney().deserialize(input);
    this.rooms = new Room().deserialize(input.stayDetails);
    this.vip = input.vip;
    this.reservationId = input?.id;

    convertToNormalCase;
    set(
      {},
      'fullName',
      `${trim(get(guest, ['firstName'], 'No'))} ${trim(
        get(guest, ['lastName'], 'Name')
      )}`
    );

    return this;
  }
  getFullName() {
    return getFullName(this.firstName, this.lastName);
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
}

type GuestDocsOrPaymentListResponse<T> = {
  total: number;
  entityStateCounts: {
    INITIATED: number;
    ACCEPTED: number;
    REJECTED: number;
    PENDING: number;
  };
  entityStateLabels: {
    INITIATED: string;
    PENDING: string;
    ACCEPTED: string;
    REJECTED: string;
  };
  records: T[];
};

type GuestPaymentDetailsResponse = {
  id: string;
  updated: number;
  created: number;
  arrivalTime: number;
  departureTime: number;
  number: number;
  updateOn: number;
  pmsStatus: string;
  state: string;
  stateCompletedSteps: string;
  redirectionParameter: {
    journey: {
      token: null;
    };
  };
  stayDetails: {
    statusMessage: {
      code: string;
      status: string;
      state: string;
      remarks: string;
    };
    arrivalTime: number;
    departureTime: number;
    expectedArrivalTime: number;
    expectedDepartureTime: number;
    adultsCount: number;
    kidsCount: number;
    comments: string;
    totalRoomCount: number;
    room: {
      roomNumber: string;
      type: string;
      unit: number;
      status: string;
    };
    checkInComment: string;
    address: {};
  };
  guestDetails: GuestDetails;

  healthDeclaration: {};
  paymentSummary: PaymentSummary;
  packages: {};
  journeysStatus: {};
  stepsStatus: {};
  lastCompletedStep: string;
  currentJourney: string;
  currentJoureyStatus: string;
  currentJourneyState: string;
  source: string;
  entity: {};
  nextJourneys: {};
  totalDueAmount: 0.0;
  totalPaidAmount: 0.0;
  totalAmount: 0.0;
  nightCount: 0;
  vip: false;
  invoicePrepareRequest: false;
  pmsBooking: false;
};

type GuestDetails = {
  primaryGuest: {
    statusMessage: {
      code: number;
      status: string;
      state: string;
      remarks: null;
    };
    id: string;
    firstName: string;
    lastName: string;
    contactDetails: {
      cc: string;
      contactNumber: string;
      emailId: string;
    };
    nationality: string;
    documents: [];
    regcardUrl: string;
    age: 0;
    privacy: false;
    documentRequired: true;
  };
  accompanyGuests: [];
  sharerGuests: [];
  secondaryGuest: [];
  kids: [];
  allGuest: {
    [key: string]: {
      statusMessage: {
        code: number;
        status: string;
        state: string;
        remarks: null;
      };
      id: string;
      firstName: string; // Updated this line to allow any string value
      lastName: string; // Updated this line to allow any string value
      contactDetails: {
        cc: string; // Updated this line to allow any string value
        contactNumber: string; // Updated this line to allow any string value
        emailId: string; // Updated this line to allow any string value
      };
      nationality: string; // Updated this line to allow any string value
      documents: any[]; // Updated this line to allow any array value
      regcardUrl: string; // Updated this line to allow any string value
      age: number; // Updated this line to allow any number value
      privacy: boolean;
      documentRequired: boolean;
    };
  };
};

type PaymentSummary = {
  statusMessage: {
    code: number;
    status: string;
    state: string;
    remarks: null;
  };
  totalAmount: number;
  taxAmount: number;
  totalDiscount: number;
  paidAmount: number;
  dueAmount: number;
  payableAmount: number;
  currency: string;
  roomRates: [
    {
      base: number;
      totalAmount: number;
      amount: number;
      discount: number;
      description: string;
      label: string;
      unit: number;
      cgstAmount: number;
      sgstAmount: number;
    }
  ];
  inclusions: string;
  printRate: boolean;
  packages: any[]; // You can replace 'any' with the specific type if needed
  transactionsHistory: any[]; // You can replace 'any' with the specific type if needed
  depositRules: {
    id: string;
    amount: number;
    label: string;
    guaranteeType: string;
    type: string;
    depositNight: number;
    payAtDesk: boolean;
    dueDate: number;
  };
  paymentAmount: number;
  totalCgstTax: number;
  totalSgstTax: number;
  totalAddOnsAmount: number;
  totalRoomCharge: number;
  totalRoomDiscount: number;
  totalAddOnsTax: number;
  totalAddOnsDiscount: number;
};

type Address = {
  addressLine1: string;
  city: string;
  // Add other address properties as needed
};

type Attributes = {
  overAllNps: number;
  transactionUsage: string;
  totalSpend: number;
  churnProbalilty: number;
  numberOfBookings: number;
  // Add other attribute properties as needed
};

type ContactDetails = {
  cc: string;
  contactNumber: string;
  emailId: string;
  // Add other contact details properties as needed
};

type GuestDocumentDetailsResponse = {
  address: Address;
  age: number;
  attributes: Attributes;
  code: string;
  contactDetails: ContactDetails;
  created: number;
  dateOfBirth: string;
  firstName: string;
  gender: string;
  id: string;
  lastName: string;
  reservation: GuestPaymentDetailsResponse[];
  status: boolean;
  type: string;
  updated: number;
};
