import { get, set } from 'lodash';
import * as moment from 'moment';
import { DateService } from '@hospitality-bot/shared/utils';
import { GuestRole } from '../constants/guest';
import { TransactionHistoryResponse } from '../types/response';

export interface IDeserializable {
  deserialize(input: any, hotelNationality: string): this;
}

export class Details implements IDeserializable {
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
  roomsDetails: RoomsDetails;
  feedbackDetails: FeedbackDetails;
  invoicePrepareRequest: boolean;
  pmsBooking: boolean;

  deserialize(input: any, timezone) {
    const hotelNationality = input.hotel.address.countryCode;
    this.invoicePrepareRequest = input.invoicePrepareRequest || false;
    this.pmsBooking = input.pmsBooking || false;
    this.guestDetails = new GuestDetailDS().deserialize(
      input.guestDetails,
      hotelNationality
    );

    this.reservationDetails = new ReservationDetailsConfig().deserialize(input);
    this.stayDetails = new StayDetailsConfig().deserialize(
      input.stayDetails,
      timezone
    );
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

export class FeedbackDetails implements IDeserializable {
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
      input?.quickServices &&
      input.quickServices?.map((service) => {
        return new FeedbackSuggestion().deserialize(service);
      });
    return this;
  }
}

export class FeedbackSuggestion implements IDeserializable {
  id: string;
  label: string;
  url: string;
  deserialize(input) {
    this.id = input.serviceId;
    return this;
  }
}

export class RoomsDetails implements IDeserializable {
  rooms;
  totalRooms: number;
  deserialize(input: any) {
    this.totalRooms = input.rooms ? input.rooms.length : 0;
    return this;
  }
}
export class StepStatusDetails implements IDeserializable {
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

export class CurrentJourneyDetails implements IDeserializable {
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

export class GuestDetailDS implements IDeserializable {
  guests: GuestDetailsConfig[];

  deserialize(input: any, hotelNationality: string) {
    this.guests = new Array<GuestDetailsConfig>();
    const keys = Object.keys(input);

    keys?.forEach((key) => {
      if (!['allGuest', 'secondaryGuest', 'pmsSharerGuest'].includes(key)) {
        if (key === 'primaryGuest') {
          this.guests.push(
            new GuestDetailsConfig().deserialize(
              {
                ...input[key],
                ...{
                  isPrimary: true,
                  label: 'Primary Guest',
                  role: GuestRole.undefined,
                },
              },
              hotelNationality
            )
          );
        } else {
          const role =
            key === 'sharerGuests'
              ? GuestRole.sharer
              : key === 'accompanyGuests'
              ? GuestRole.accompany
              : GuestRole.kids;
          const label = key === 'sharerGuests' ? 'Sharer' : 'Accomanied / Kids';
          input[key] &&
            input[key]?.forEach((guest) => {
              this.guests.push(
                new GuestDetailsConfig().deserialize(
                  {
                    ...guest,
                    ...{
                      isPrimary: false,
                      label,
                      role: role,
                    },
                  },
                  hotelNationality
                )
              );
            });
        }
      }
    });
    return this;
  }
}

export class GuestDetailsConfig implements IDeserializable {
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
  status: string;
  remarks: string;
  documents: DocumentDetailsConfig;
  regcardUrl: string;
  regcardStatus: string;
  role: string;
  label: string;
  age: number;

  deserialize(input: any, hotelNationality) {
    const contactDetails = new ContactDetailsConfig().deserialize(
      input.contactDetails
    );
    const documents = new Array<DocumentDetailsConfig>();
    input.documents?.forEach((document) => {
      documents.push(new DocumentDetailsConfig().deserialize(document));
    });
    Object.assign(
      this,
      set({}, 'id', get(input, ['id'])),
      set({}, 'code', get(input, ['code'])),
      set({}, 'title', get(input, ['nameTitle'], '')),
      set({}, 'firstName', get(input, ['firstName'])),
      set({}, 'lastName', get(input, ['lastName'])),
      set({}, 'countryCode', this.getNationality(get(contactDetails, ['cc']))),
      set({}, 'phoneNumber', get(contactDetails, ['contactNumber'])),
      set({}, 'email', get(contactDetails, ['email'])),
      set({}, 'isPrimary', get(input, ['isPrimary'])),
      set({}, 'nationality', get(input, ['nationality']) || hotelNationality),
      set({}, 'status', get(input.statusMessage, ['status'])),
      set({}, 'remarks', get(input.statusMessage, ['remarks'])),
      set({}, 'role', get(input, ['role'])),
      set({}, 'label', get(input, ['label'])),
      set({}, 'age', get(input, ['age'])),
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

  getNationality(cc) {
    if (cc && cc.length) {
      return cc.includes('+') ? cc : `+${cc}`;
    }
    return cc;
  }
}

export class ShareIconConfig implements IDeserializable {
  applications: ShareIcon[];

  deserialize(input: any) {
    this.applications = new Array<ShareIcon>();
    this.applications = input?.map((data) => {
      return new ShareIcon().deserialize(data);
    });
    return this;
  }
}

export class ShareIcon implements IDeserializable {
  value: string;
  label: string;
  iconUrl: string;
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

export class StayDetailsConfig implements IDeserializable {
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
  arrivalTimeStamp: number;
  departureTimeStamp: number;

  deserialize(input: any, timezone) {
    Object.assign(
      this,
      set({}, 'code', get(input, ['code'])),
      set({}, 'arrivalTimeStamp', get(input, ['arrivalTime'])),
      set({}, 'departureTimeStamp', get(input, ['departureTime'])),
      set(
        {},
        'arrivalDate',
        DateService.getDateFromTimeStamp(
          get(input, ['arrivalTime']),
          'DD/MM/YYYY',
          timezone
        )
      ),
      set(
        {},
        'departureDate',
        DateService.getDateFromTimeStamp(
          get(input, ['departureTime']),
          'DD/MM/YYYY',
          timezone
        )
      ),
      set(
        {},
        'expectedArrivalTime',
        DateService.getDateFromTimeStamp(
          get(input, ['arrivalTime']),
          'HH:mm',
          timezone
        )
      ),
      set({}, 'roomType', get(input, ['roomType'])),
      set({}, 'kidsCount', get(input, ['kidsCount'])),
      set({}, 'adultsCount', get(input, ['adultsCount'])),
      set(
        {},
        'roomNumber',
        get(input, ['roomNumber']) === 0 ? '' : get(input, ['roomNumber'])
      ),
      set({}, 'special_comments', get(input, ['comments'])),
      set({}, 'checkin_comments', get(input, ['checkInComment']))
    );
    return this;
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

export class DocumentDetailsConfig implements IDeserializable {
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

export class ContactDetailsConfig implements IDeserializable {
  cc: string;
  contactNumber: string;
  email: string;

  deserialize(input: any) {
    Object.assign(
      this,
      set({}, 'cc', this.getNationality(get(input, ['cc']))),
      set({}, 'contactNumber', get(input, ['contactNumber'])),
      set({}, 'email', get(input, ['emailId']))
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

export class HealthDeclarationConfig implements IDeserializable {
  status: string;
  remarks: string;
  temperatureDetails: string;
  url: string;
  deserialize(input: any) {
    Object.assign(
      this,
      set({}, 'status', get(input, ['statusMessage', 'status'])),
      set({}, 'remarks', get(input, ['statusMessage', 'remarks'])),
      set({}, 'url', get(input, ['url'])),
      set({}, 'temperature', get(input, ['temperatureDetails']))
    );
    return this;
  }
}

export class ReservationDetailsConfig implements IDeserializable {
  bookingNumber: string;
  bookingId: string;
  entityId: string;

  deserialize(input: any) {
    Object.assign(
      this,
      set({}, 'bookingNumber', get(input, ['number'])),
      set({}, 'bookingId', get(input, ['id'])),
      set({}, 'entityId', get(input.hotel, ['id']))
    );
    return this;
  }
}

export class RegCardConfig implements IDeserializable {
  status: string;
  url: string;
  deserialize(input: any) {
    Object.assign(
      this,
      set({}, 'status', get(input, ['regcardUrl']) ? 'COMPLETED' : 'PENDING'),
      set({}, 'url', get(input, ['regcardUrl']))
    );
    return this;
  }
}

export class PackageDetailsConfig implements IDeserializable {
  complimentaryPackages = new Array<Package>();
  paidPackages = new Array<Package>();

  deserialize(input: any) {
    input.complimentaryPackages.forEach((packageObj) => {
      this.complimentaryPackages.push(new Package().deserialize(packageObj));
    });

    input.paidPackages?.forEach((packageObj) => {
      this.paidPackages.push(new Package().deserialize(packageObj));
    });
    return this;
  }
}

export class PaymentDetailsConfig implements IDeserializable {
  currency: string;
  dueAmount: number;
  paidAmount: number;
  subtotal: number;
  taxAmount: string;
  totalAmount: number;
  totalDiscount: number;
  roomRates: RoomRateConfig;
  packages: IPackage[];
  depositRules: DepositRuleDetailsConfig;
  transactionHistory: TransactionHistory[];
  printRate: boolean;

  deserialize(input: any) {
    Object.assign(
      this,
      set({}, 'currency', get(input, ['currency'])),
      set({}, 'dueAmount', get(input, ['dueAmount'])),
      set({}, 'paidAmount', get(input, ['paidAmount'])),
      set({}, 'subtotal', get(input, ['subtotal'])),
      set({}, 'taxAmount', get(input, ['taxAmount'])),
      set({}, 'totalAmount', get(input, ['totalAmount'])),
      set({}, 'totalDiscount', get(input, ['totalDiscount'])),
      set({}, 'packages', get(input, ['packages']))
    );
    this.depositRules = new DepositRuleDetailsConfig().deserialize(
      input.depositRules
    );
    //to-do
    this.roomRates = new RoomRateConfig().deserialize(input.roomRates);
    if (Array.isArray(input.transactionsHistory)) {
      this.transactionHistory = input.transactionsHistory.map(
        (item: TransactionHistoryResponse) =>
          new TransactionHistory().deserialize(item)
      );
    } else {
      this.transactionHistory = [];
    }
    return this;
  }
}

export class TransactionHistory {
  amount: number;
  bankReferenceNumber: string | null;
  created: number;
  currency: string;
  failureMessage: string | null;
  gateway: string | null;
  id: string;
  journey: number;
  orderId: string | null;
  payOnDesk: boolean;
  paymentMode: string;
  preAuth: boolean;
  preAuthType: string | null;
  remarks: string;
  reservationId: string;
  signatureUrl: string | null;
  status: string;
  transactionId: string | null;
  updated: number;

  deserialize(input: TransactionHistoryResponse) {
    this.amount = input.amount;
    this.bankReferenceNumber = input.bankReferenceNumber;
    this.created = input.created;
    this.currency = input.currency;
    this.failureMessage = input.failureMessage;
    this.gateway = input.gateway;
    this.id = input.id;
    this.journey = input.journey;
    this.orderId = input.orderId;
    this.payOnDesk = input.payOnDesk;
    this.paymentMode = input.paymentMode;
    this.preAuth = input.preAuth;
    this.preAuthType = input.preAuthType;
    this.remarks = input.remarks;
    this.reservationId = input.reservationId;
    this.signatureUrl = input.signatureUrl;
    this.status = input.status;
    this.transactionId = input.transactionId;
    this.updated = input.updated;

    return this;
  }
}

export class DepositRuleDetailsConfig implements IDeserializable {
  payAtDesk: boolean;
  amount: number;
  depositNight: number;
  guaranteeType: string;
  amountType: string;

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

export class RoomRateConfig implements IDeserializable {
  amount: number;
  base: number;
  description: string;
  discount: number;
  totalAmount: number;
  unit: number;
  label: string;
  cgstAmount: number;
  sgstAmount: number;
  deserialize(input: any) {
    Object.assign(
      this,
      set({}, 'amount', get(input, ['amount'])),
      set({}, 'base', get(input, ['base'])),
      set({}, 'description', get(input, ['description'])),
      set({}, 'discount', get(input, ['discount'])),
      set({}, 'totalAmount', get(input, ['totalAmount'])),
      set({}, 'label', get(input, ['label'])),
      set({}, 'cgstAmount', get(input, ['cgstAmount'])),
      set({}, 'sgstAmount', get(input, ['sgstAmount'])),
      set({}, 'unit', get(input, ['unit']))
    );
    return this;
  }
}

export class Package implements IDeserializable {
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
  status: string;
  remarks: string;
  unit: number;
  currency: number;

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

export interface IPackage {
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
export interface ITaxAndFees {
  amount: number;
  type: string;
  value: string;
}

export class AdminDetailStatus {
  isHealthDeclarationAccepted: boolean;
  isHealthDeclarationInitiatd: boolean;
  isDocumentsAccepted: boolean;
  isDocumentsInitiated: boolean;
}
