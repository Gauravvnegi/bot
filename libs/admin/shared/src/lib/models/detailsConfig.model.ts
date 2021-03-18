import { get, set } from 'lodash';
import { DateService } from '../../../../../shared/utils/src/lib/date.service';
import * as moment from 'moment';
import { GuestTypes, GuestRole } from '../constants/guest';

export interface Deserializable {
  deserialize(input: any, hotelNationality: string): this;
}

export class Details implements Deserializable {
  reservationDetails: ReservationDetailsConfig; // bookingDetails
  guestDetails: GuestDetailDS;
  stayDetails: StayDetailsConfig;
  amenitiesDetails: PackageDetailsConfig;
  paymentDetails: PaymentDetailsConfig;
  shareIconsDetails: ShareIconConfig;
  regCardDetails: RegCardConfig;
  healDeclarationDetails: HealthDeclarationConfig;
  currentJourneyDetails: CurrentJourneyDetails;
  stepStatusDetails: StepStatusDetails;
  roomsDetails;
  feedbackDetails;

  deserialize(input: any) {
    let hotelNationality = input.hotel.address.countryCode;

    // input.guestDetails.primaryGuest['isPrimary'] = true;
    // input.guestDetails.secondaryGuest.forEach((secondaryGuest) => {
    //   secondaryGuest['isPrimary'] = false;
    // });

    // let guestData = [
    //   input.guestDetails.primaryGuest,
    //   ...input.guestDetails.secondaryGuest,
    // ];

    // this.guestDetails = new Array<GuestDetailsConfig>();
    // guestData.forEach((guest) => {
    //   this.guestDetails.push(
    //     new GuestDetailsConfig().deserialize(guest, hotelNationality)
    //   );
    // });
    this.guestDetails = new GuestDetailDS().deserialize(
      input.guestDetails,
      hotelNationality
    );

    this.reservationDetails = new ReservationDetailsConfig().deserialize(input);
    this.stayDetails = new StayDetailsConfig().deserialize(input.stayDetails);
    this.regCardDetails = new RegCardConfig().deserialize(
      input.guestDetails.primaryGuest
    );
    this.currentJourneyDetails = new CurrentJourneyDetails().deserialize(input);
    this.amenitiesDetails = new PackageDetailsConfig().deserialize(
      input.packages
    );
    this.paymentDetails = new PaymentDetailsConfig().deserialize(
      input.paymentSummary
    );
    this.healDeclarationDetails = new HealthDeclarationConfig().deserialize(
      input.healthDeclaration
    );
    this.stepStatusDetails = new StepStatusDetails().deserialize(
      input.stepsStatus
    );

    this.roomsDetails = new RoomsDetails().deserialize(input);
    this.feedbackDetails = new FeedbackDetails().deserialize(input.feedback);

    return this;
  }
}

export class FeedbackDetails implements Deserializable {
  rating;
  comments: string;
  status: string;
  suggestions;
  deserialize(input: any) {
    Object.assign(
      this,
      set({}, 'rating', get(input, ['rating'])),
      set({}, 'comments', get(input, ['comments'])),
      set({}, 'status', get(input, ['statusMessage', 'status']))
    );
    this.suggestions =
      input.quickServices &&
      input.quickServices.map((service) => {
        return new FeedbackSuggestion().deserialize(service);
      });
    return this;
  }
}

export class FeedbackSuggestion implements Deserializable {
  id;
  label;
  url;
  deserialize(input) {
    this.id = input.serviceId;
    return this;
  }
}

export class RoomsDetails implements Deserializable {
  rooms;
  totalRooms;
  deserialize(input: any) {
    this.totalRooms = input.rooms.length;
    return this;
  }
}
export class StepStatusDetails implements Deserializable {
  documents;
  guestDetails;
  stayDetails;
  payment;
  healthDeclaration;
  feedback;
  deserialize(input: any) {
    Object.assign(
      this,
      set({}, 'documents', get(input, ['DOCUMENTS'])),
      set({}, 'feedback', get(input, ['FEEDBACK'])),
      set({}, 'healthDeclaration', get(input, ['HEALTHDECLARATION'])),
      set({}, 'payment', get(input, ['PAYMENT'])),
      set({}, 'stayDetails', get(input, ['STAYDETAILS'])),
      set({}, 'guestDetails', get(input, ['GUESTDETAILS']))
    );
    return this;
  }
}

export class CurrentJourneyDetails implements Deserializable {
  status;
  journey;
  deserialize(input: any) {
    Object.assign(
      this,
      set({}, 'status', get(input, ['currentJoureyStatus'])),
      set({}, 'journey', get(input, ['currentJourney']))
    );
    return this;
  }
}

export class GuestDetailDS implements Deserializable {
  guests: GuestDetailsConfig[];

  deserialize(input: any, hotelNationality: string) {
    this.guests = new Array<GuestDetailsConfig>();
    input.primaryGuest &&
      this.guests.push(
        new GuestDetailsConfig().deserialize(
          {
            ...input.primaryGuest,
            ...{
              isPrimary: true,
              label: 'Primary Guest',
              role: GuestRole.undefined,
            },
          },
          hotelNationality
        )
      );
    input.sharerGuests &&
      input.sharerGuests.forEach((guest) => {
        this.guests.push(
          new GuestDetailsConfig().deserialize(
            {
              ...guest,
              ...{
                isPrimary: false,
                label: 'Sharer',
                role: GuestRole.sharer,
              },
            },
            hotelNationality
          )
        );
      });
    input.accompanyGuests &&
      input.accompanyGuests.forEach((guest) => {
        this.guests.push(
          new GuestDetailsConfig().deserialize(
            {
              ...guest,
              ...{
                isPrimary: false,
                label: 'Accompanied / Kids',
                role: GuestRole.accompany,
              },
            },
            hotelNationality
          )
        );
      });
    input.kids &&
      input.kids.forEach((guest) => {
        this.guests.push(
          new GuestDetailsConfig().deserialize(
            {
              ...guest,
              ...{
                isPrimary: false,
                label: 'Accompanied/Kids',
                role: GuestRole.kids,
              },
            },
            hotelNationality
          )
        );
      });
    console.log(this);
    return this;
  }
}

export class GuestDetailsConfig implements Deserializable {
  id: string;
  code: number;
  title: string;
  firstName: string;
  lastName: string;
  fullName: string;
  nationality: string;
  isPrimary: boolean;
  isInternational: boolean;
  countryCode: string;
  phoneNumber: string;
  email: string;
  selectedDocumentType: string;
  status;
  remarks: string;
  documents: DocumentDetailsConfig;
  regcardUrl;
  regcardStatus;
  role: string;

  deserialize(input: any, hotelNationality) {
    const contactDetails = new ContactDetailsConfig().deserialize(
      input.contactDetails
    );
    let documents = new Array<DocumentDetailsConfig>();
    input.documents.forEach((document) => {
      documents.push(new DocumentDetailsConfig().deserialize(document));
    });
    Object.assign(
      this,
      set({}, 'id', get(input, ['id'])),
      set({}, 'code', get(input, ['code'])),
      set({}, 'title', get(input, ['nameTitle'])),
      set({}, 'firstName', get(input, ['firstName'])),
      set({}, 'lastName', get(input, ['lastName'])),
      set({}, 'countryCode', get(contactDetails, ['cc'])),
      set({}, 'phoneNumber', get(contactDetails, ['contactNumber'])),
      set({}, 'email', get(contactDetails, ['email'])),
      set({}, 'isPrimary', get(input, ['isPrimary'])),
      set({}, 'nationality', get(input, ['nationality']) || hotelNationality),
      set({}, 'status', get(input.statusMessage, ['status'])),
      set({}, 'remarks', get(input.statusMessage, ['remarks'])),
      set({}, 'role', get(input, ['role'])),
      set(
        {},
        'isInternational',
        get(input, ['nationality']) === hotelNationality ? false : true
      ),
      set(
        {},
        'selectedDocumentType',
        input.nationality === hotelNationality
          ? input.documents && input.documents[0]
            ? input.documents[0].documentType
            : null
          : null
      ),
      set({}, 'documents', documents),
      set(
        {},
        'regcardStatus',
        get(input, ['regcardUrl']) ? 'COMPLETED' : 'FAILED'
      ),
      set({}, 'regcardUrl', get(input, ['regcardUrl']))
    );
    return this;
  }

  getGuestFullNameWithTitle() {
    return `${this.title} ${this.firstName} ${this.lastName}`;
  }
}

export class ShareIconConfig implements Deserializable {
  applications: ShareIcon[];

  deserialize(input: any) {
    this.applications = new Array<ShareIcon>();
    this.applications = input.applications.map((data) => {
      return new ShareIcon().deserialize(data);
    });
    return this;
  }
}

export class ShareIcon implements Deserializable {
  value;
  label;
  iconUrl;
  deserialize(input: any) {
    Object.assign(
      this,
      set({}, 'value', get(input, ['value'])),
      set({}, 'label', get(input, ['label'])),
      set({}, 'iconUrl', get(input, ['iconUrl']))
    );
    return this;
  }
}

export class StayDetailsConfig implements Deserializable {
  code: string;
  arrivalDate: string;
  departureDate: string;
  roomType: string;
  kidsCount: number;
  adultsCount: number;
  roomNumber: string;
  expectedArrivalTime;
  special_comments: string;
  checkin_comments: string;
  arrivalTimeStamp;
  departureTimeStamp;

  deserialize(input: any) {
    Object.assign(
      this,
      set({}, 'code', get(input, ['code'])),
      set({}, 'arrivalTimeStamp', get(input, ['arrivalTime'])),
      set({}, 'departureTimeStamp', get(input, ['departureTime'])),
      set(
        {},
        'arrivalDate',
        DateService.convertTimestampToDate(
          get(input, ['arrivalTime']),
          'DD/MM/YYYY'
        )
      ),
      set(
        {},
        'departureDate',
        DateService.convertTimestampToDate(
          get(input, ['departureTime']),
          'DD/MM/YYYY'
        )
      ),
      set(
        {},
        'expectedArrivalTime',
        moment(get(input, ['expectedArrivalTime'])).format('HH:mm')
      ),
      set({}, 'roomType', get(input, ['roomType'])),
      set({}, 'kidsCount', get(input, ['kidsCount'])),
      set({}, 'adultsCount', get(input, ['adultsCount'])),
      set(
        {},
        'roomNumber',
        get(input, ['roomNumber']) == 0 ? '' : get(input, ['roomNumber'])
      ),
      set({}, 'special_comments', get(input, ['comments'])),
      set({}, 'checkin_comments', get(input, ['checkInComment']))
    );
    return this;
  }

  getDaysAndNights() {
    const diffInDays = moment(this.departureTimeStamp).diff(
      moment(this.arrivalTimeStamp),
      'days'
    );
    return {
      days: diffInDays + 1,
      nights: diffInDays,
    };
  }
}

export class DocumentDetailsConfig implements Deserializable {
  id: string;
  documentType: string;
  frontUrl: string;
  backUrl: string;

  deserialize(input: any) {
    Object.assign(
      this,
      set({}, 'id', get(input, ['id'])),
      set({}, 'documentType', get(input, ['documentType'])),
      set({}, 'frontUrl', get(input, ['frontUrl'])),
      set({}, 'backUrl', get(input, ['backUrl']))
    );
    return this;
  }
}

export class ContactDetailsConfig implements Deserializable {
  cc: string;
  contactNumber: string;
  email: string;

  deserialize(input: any) {
    Object.assign(
      this,
      set({}, 'cc', get(input, ['cc'])),
      set({}, 'contactNumber', get(input, ['contactNumber'])),
      set({}, 'email', get(input, ['emailId']))
    );
    return this;
  }
}

export class HealthDeclarationConfig implements Deserializable {
  status;
  remarks;
  url;
  deserialize(input: any) {
    Object.assign(
      this,
      set({}, 'status', get(input, ['statusMessage', 'status'])),
      set({}, 'remarks', get(input, ['statusMessage', 'remarks'])),
      set({}, 'url', get(input, ['url']))
    );
    return this;
  }
}

export class ReservationDetailsConfig implements Deserializable {
  bookingNumber: string;
  bookingId: string;
  hotelId: string;

  deserialize(input: any) {
    Object.assign(
      this,
      set({}, 'bookingNumber', get(input, ['number'])),
      set({}, 'bookingId', get(input, ['id'])),
      set({}, 'hotelId', get(input.hotel, ['id']))
    );
    return this;
  }
}

export class RegCardConfig implements Deserializable {
  status;
  url;
  deserialize(input: any) {
    Object.assign(
      this,
      set({}, 'status', get(input, ['regcardUrl']) ? 'COMPLETED' : 'PENDING'),
      set({}, 'url', get(input, ['regcardUrl']))
    );
    return this;
  }
}

export class PackageDetailsConfig implements Deserializable {
  complimentryPackages = new Array<Package>();
  paidPackages = new Array<Package>();

  deserialize(input: any) {
    input.complimentryPackages.forEach((packageObj) => {
      this.complimentryPackages.push(new Package().deserialize(packageObj));
    });

    input.paidPackages.forEach((packageObj) => {
      this.paidPackages.push(new Package().deserialize(packageObj));
    });
    return this;
  }
}

export class PaymentDetailsConfig implements Deserializable {
  currency;
  dueAmount;
  paidAmount;
  subtotal;
  taxAmount;
  totalAmount;
  totalDiscount;
  roomRates;
  depositRules;

  deserialize(input: any) {
    Object.assign(
      this,
      set({}, 'currency', get(input, ['currency'])),
      set({}, 'dueAmount', get(input, ['dueAmount'])),
      set({}, 'paidAmount', get(input, ['paidAmount'])),
      set({}, 'subtotal', get(input, ['subtotal'])),
      set({}, 'taxAmount', get(input, ['taxAmount'])),
      set({}, 'totalAmount', get(input, ['totalAmount'])),
      set({}, 'totalDiscount', get(input, ['totalDiscount']))
    );
    this.depositRules = new DepositRuleDetailsConfig().deserialize(
      input.depositRules
    );
    //to-do
    this.roomRates = new RoomRateConfig().deserialize(input.roomRates);
    return this;
  }
}

export class DepositRuleDetailsConfig implements Deserializable {
  payAtDesk;
  amount;
  depositNight;
  guaranteeType;
  amountType;

  deserialize(input: any) {
    Object.assign(
      this,
      set({}, 'payAtDesk', get(input, ['payAtDesk'])),
      set({}, 'amount', get(input, ['amount'])),
      set({}, 'depositNight', get(input, ['depositNight'])),
      set({}, 'guaranteeType', get(input, ['guaranteeType'])),
      set({}, 'amountType', get(input, ['type']))
    );

    // if amounttype is percentage then amount is amount percentage
    return this;
  }
}

export class RoomRateConfig implements Deserializable {
  amount;
  base;
  description;
  discount;
  totalAmount;
  unit;
  label;
  taxAndFees;
  deserialize(input: any) {
    Object.assign(
      this,
      set({}, 'amount', get(input, ['amount'])),
      set({}, 'base', get(input, ['base'])),
      set({}, 'description', get(input, ['description'])),
      set({}, 'discount', get(input, ['discount'])),
      set({}, 'totalAmount', get(input, ['totalAmount'])),
      set({}, 'label', get(input, ['label'])),
      set({}, 'taxAndFees', get(input, ['taxAndFees'])),
      set({}, 'unit', get(input, ['unit']))
    );
    return this;
  }
}

export class Package implements Deserializable {
  active: boolean;
  description: string;
  name: string;
  id: string;
  imgUrl: string;
  metaData: any;
  packageCode: string;
  quantity: number;
  rate: number;
  type: number;
  status;
  remarks;
  unit;
  currency;

  deserialize(input: any) {
    Object.assign(
      this,
      set({}, 'active', get(input, ['active'])),
      set({}, 'description', get(input, ['description'])),
      set({}, 'name', get(input, ['name'])),
      set({}, 'id', get(input, ['id'])),
      set({}, 'imgUrl', get(input, ['imageUrl'])),
      set({}, 'metaData', get(input, ['metaData'])),
      set({}, 'quantity', get(input, ['quantity'])),
      set({}, 'rate', get(input, ['rate'])),
      set({}, 'type', get(input, ['type'])),
      set({}, 'packageCode', get(input, ['packageCode'])),
      set({}, 'unit', get(input, ['unit'])),
      set({}, 'currency', get(input, ['currency'])),
      set({}, 'status', get(input, ['statusMessage', 'status'])),
      set({}, 'remarks', get(input, ['statusMessage', 'remarks']))
    );
    return this;
  }
}

export class AdminDetailStatus {
  isHealthDeclarationAccepted: boolean;
  isHealthDeclarationInitiatd: boolean;
  isDocumentsAccepted: boolean;
  isDocumentsInitiated: boolean;
}
