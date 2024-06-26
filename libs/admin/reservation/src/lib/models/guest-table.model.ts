import { DateService } from '@hospitality-bot/shared/utils';
import { get, set, trim } from 'lodash';
import {
  Booking,
  CurrentJourney,
  Feedback,
  Payment,
  Room,
  Status,
} from './reservation-table.model';

export interface IDeserializable {
  deserialize(input: any, hotelNationality: string): this;
}

export class GuestTable implements IDeserializable {
  total: number;
  entityTypeCounts: EntityTypeCounts;
  entityStateCounts: EntityStateCounts;
  records: Guest[];

  deserialize(input: any) {
    Object.assign(this, set({}, 'total', get(input, ['total'])));
    this.entityTypeCounts = new EntityTypeCounts().deserialize(
      input.entityTypeCounts
    );
    this.entityStateCounts = new EntityStateCounts().deserialize(
      input.entityStateCounts
    );
    this.records = input.records.map((record) =>
      new Guest().deserialize(record)
    );
    return this;
  }
}

export class EntityTypeCounts {
  ARRIVAL: number;
  OUTGUEST: number;
  INHOUSE: number;
  DEPARTURE: number;

  deserialize(data) {
    Object.assign(
      this,
      set({}, 'ARRIVAL', get(data, ['ARRIVAL'])),
      set({}, 'OUTGUEST', get(data, ['OUTGUEST'])),
      set({}, 'INHOUSE', get(data, ['INHOUSE'])),
      set({}, 'DEPARTURE', get(data, ['DEPARTURE']))
    );
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

  deserialize(input: any) {
    Object.assign(
      this,
      set({}, 'dateOfBirth', get(input, ['dateOfBirth'])),
      set({}, 'contactDetails', get(input, ['contactDetails'])),
      set({}, 'id', get(input, ['id'])),
      set({}, 'title', get(input, ['title'])),
      set({}, 'firstName', trim(get(input, ['firstName'], ''))),
      set({}, 'lastName', trim(get(input, ['lastName'], ''))),
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
    this.guestAttributes = new GuestAttributes().deserialize(input.attributes);
    if (input?.reservation) {
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
    if (!this.firstName && !this.lastName) return 'No Name';

    return `${this.salutation} ${this.firstName} ${this.lastName}`;
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
  overAllNps: number;
  transactionUsage: string;
  totalSpend: number;
  potential: string;
  churnProbalilty: number;
  churnPrediction: string;

  deserialize(data) {
    Object.assign(
      this,
      set({}, 'id', get(data, ['id'])),
      set({}, 'overAllNps', get(data, ['overAllNps'])),
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
  visitDetail: VisitDetail;
  deserialize(input: any) {
    this.rooms = new Room().deserialize(input.stayDetails);
    this.feedback = new Feedback().deserialize(input.feedback);
    this.booking = new Booking().deserialize(input);
    this.guestAttributes = new GuestAttributes().deserialize(
      input.guestAttributes
    );
    this.visitDetail = new VisitDetail().deserialize(input.visitDetails);
    return this;
  }
}

export class VisitDetail {
  comments: string;
  feedbackId: string;
  feedbackSubmissionTime: number;
  feedbackType: string;
  intentToRecommends: string;
  marketSegment: string;
  outletId: string;
  serviceType: string;
  statusMessage: Status;
  surveyType: string;

  deserialize(input) {
    Object.assign(
      this,
      set({}, 'comments', get(input, ['comments'])),
      set({}, 'feedbackId', get(input, ['feedbackId'])),
      set({}, 'feedbackSubmissionTime', get(input, ['feedbackSubmissionTime'])),
      set({}, 'feedbackType', get(input, ['feedbackType'])),
      set({}, 'intentToRecommends', get(input, ['intentToRecommends'])),
      set({}, 'marketSegment', get(input, ['marketSegment'])),
      set({}, 'outletId', get(input, ['outletId'])),
      set({}, 'serviceType', get(input, ['serviceType'])),
      set({}, 'surveyType', get(input, ['surveyType'])),
      set({}, 'statusMessage', get(input, ['statusMessage']))
    );
    return this;
  }

  getfeedbackSubmissionTime(timezone = '+05:30') {
    return DateService.getDateFromTimeStamp(
      this.feedbackSubmissionTime,
      'DD/M/YY',
      timezone
    );
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

export type MetaData = {
  label: string;
  value: string | Date | number;
};

type PostGuestDetails = {
  id: string;
  firstName: string;
  lastName: string;
  salutation: string;
  age?: string;
  contactDetails: {
    cc: string;
    emailId: string;
    contactNumber: string;
  };
};

export class UpdateGuestPayload {
  id: string;
  salutation: string;
  firstName: string;
  lastName: string;
  contactDetails: {
    cc: string;
    contactNumber: string;
    emailId: string;
  };
  age: number;
  companyId: string;
  gender: string;
  dateOfBirth: string;
  address: {};
  type: string;

  deserialize(data: GuestDetail) {
    this.id = data?.id;
    this.firstName = data?.firstName;
    this.lastName = data?.lastName;
    this.contactDetails = {
      cc: data?.countryCode,
      contactNumber: data?.phoneNumber,
      emailId: data?.email,
    };
    this.age = data?.age;
    this.salutation = data?.title;

    return this;
  }
}

export class GuestDetailsUpdateModel {
  primaryGuest: PostGuestDetails;

  sharerGuests: PostGuestDetails[];
  kids: PostGuestDetails[];

  deserialize(input: GuestSuModel[]): GuestPostData {
    this.sharerGuests = new Array<PostGuestDetails>();
    this.kids = new Array<PostGuestDetails>();

    input.forEach((guest) => {
      const guestDetails = this.modGuestDetails(guest);
      if (guest.isPrimary) {
        this.primaryGuest = guestDetails;
      }
      if (guest.role === 'sharer') {
        this.sharerGuests.push(guestDetails);
      }

      if (guest.role === 'kids') {
        this.kids.push(guestDetails);
      }

      if (!guest.isPrimary && !guest.role) {
        this.primaryGuest = guestDetails; //for Non-Resident Guest
      }
    });

    return {
      primaryGuest: this.primaryGuest ?? ({} as PostGuestDetails),
      sharerGuests: this.sharerGuests,
      kids: this.kids,
      accompanyGuests: [],
    };
  }

  modGuestDetails(value: GuestSuModel): PostGuestDetails {
    return {
      id: value.id,
      firstName: value.firstName,
      lastName: value.lastName,
      salutation: value.title,

      contactDetails: {
        cc: value.countryCode,
        contactNumber: value.phoneNumber,
        emailId: value.email,
      },

      ...(value.role === 'kids' ? { age: value.age } : {}),
    };
  }
}

export type GuestPostData = Omit<
  GuestDetailsUpdateModel,
  'deserialize' | 'modGuestDetails'
> & { accompanyGuests: [] };

export type GuestSuModel = {
  id: string;
  title: string;
  firstName: string;
  lastName: string;
  countryCode: string;
  phoneNumber: string;
  email: string;
  isPrimary: boolean;
  age: string;
  role: 'kids' | 'sharer' | '';
};

export type GuestDetail = {
  id: string;
  title: string;
  firstName: string;
  lastName: string;
  countryCode: string;
  phoneNumber: string;
  email: string;
  isPrimary: boolean;
  nationality: string;
  isInternational: boolean;
  selectedDocumentType: string;
  age: number;
  status: string;
  remarks: string | null;
  label: string;
  role: string;
  documents: Document[];
};
