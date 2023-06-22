import { RoomTypeResponse } from 'libs/admin/room/src/lib/types/service-response';
import {
  PaymentMethodConfig,
  ReservationListResponse,
  ReservationResponse,
} from '../types/response.type';
import { EntityState, FlagType, Option } from '@hospitality-bot/admin/shared';
import { SearchGuestResponse } from 'libs/admin/guests/src/lib/types/guest.type';
/* Reservation */
export class Reservation {
  id: string;
  hotelId: string;
  rooms: number;
  roomType: string;
  confirmationNo: string;
  guestName: string;
  guestCompany: string;
  date: string;
  amount: number;
  source: string;
  payment: string;
  status: string;
  type: string; // OTA,AGENT, WALK-In, Offline Sales, Booking Engine
  reservationNumber: string;
  totalDueAmount: number;
  firstName: string;
  lastName: string;
  paymentMethod: string;
  totalPaidAmount: number;
  roomCount: number;
  reservationType: string;
  from: number;
  to: number;
  totalAmount: number;
  fullName: string;
  roomNumber: number;
  statusValues: Status[];
  sourceName: string;

  deserialize(input: ReservationResponse) {
    this.id = input.id;
    this.hotelId = input.hotelId;
    this.rooms = input.rooms;
    this.roomType = input.roomType;
    this.confirmationNo = input.reservationNumber;
    this.guestName = input.name;
    this.guestCompany = input.company;
    this.date = input.date;
    this.amount = input.amount;
    this.source = input.source;
    this.payment = input.payment;
    this.status = input.status;
    this.type = input.reservationTypes;
    this.reservationNumber = input?.reservationNumber;
    this.totalDueAmount = input?.totalDueAmount;
    this.firstName = input?.firstName;
    this.lastName = input?.lastName;
    this.paymentMethod = input?.paymentMethod;
    this.totalPaidAmount = input?.totalPaidAmount;
    this.roomCount = input?.roomCount;
    this.reservationType = input?.reservationType;
    this.from = input?.from;
    this.to = input?.to;
    this.totalAmount = input?.totalAmount;
    this.fullName = this.firstName + ' ' + this.lastName;
    this.roomNumber = input?.roomNumber;
    this.sourceName = input?.sourceName;
    return this;
  }
}

export type Status = {
  label: string;
  value: string | boolean;
  type: FlagType;
  disabled?: boolean;
};

/* Lists of all type Reservations*/
export class ReservationList {
  reservationData: Reservation[];
  total: number;
  entityStateCounts: EntityState<string>;
  entityTypeCounts: EntityState<string>;
  deserialize(input: ReservationListResponse) {
    this.reservationData =
      input.records?.map((item) => new Reservation().deserialize(item)) ?? [];
    this.total = input.total;
    this.entityStateCounts = input.entityStateCounts;
    this.entityTypeCounts = input.entityTypeCounts;
    return this;
  }
}

export class EntityTypeCounts {
  ALL: number;
  AGENT: number;
  CREATE_WITH: number;
  OFFLINE_SALES: number;
  OTA: number;
  OTHERS: number;
  WALK_IN: number;
  deserialize(input: EntityTypeCountsResponse, total) {
    this.ALL = total ?? 0;
    this.AGENT = input?.AGENT;
    this.CREATE_WITH = input?.CREATE_WITH;
    this.OFFLINE_SALES = input?.OFFLINE_SALES;
    this.OTA = input?.OTA;
    this.OTHERS = input?.OTHERS;
    this.WALK_IN = input?.WALK_IN;
    return this;
  }
}

export type EntityTypeCountsResponse = {
  ALL: number;
  AGENT: number;
  CREATE_WITH: number;
  OFFLINE_SALES: number;
  OTA: number;
  OTHERS: number;
  WALK_IN: number;
};

export type EntityStateCountsResponse = {
  ALL: number;
  DRAFT: number;
  CONFIRMED: number;
  CANCELED: number;
};

export class EntityStateCounts {
  ALL: number;
  DRAFT: number;
  CONFIRMED: number;
  CANCELED: number;
  deserialize(input: EntityStateCountsResponse) {
    this.ALL = Number(Object.values(input).reduce((a, b) => a + b, 0));
    this.DRAFT = input?.DRAFT;
    this.CONFIRMED = input?.CONFIRMED;
    this.CANCELED = input?.CANCELED;
    return this;
  }
}

export class RoomTypeOptionList {
  records: RoomTypeOption[];
  deserialize(input) {
    this.records =
      input?.roomTypes.map((item) => new RoomTypeOption().deserialize(item)) ??
      [];
    return this;
  }
}

export class RoomTypeOption {
  id: string;
  name: string;
  roomCount: number;
  occupancy: number;
  maxChildren: number;
  maxAdult: number;

  deserialize(input: RoomTypeResponse) {
    this.id = input.id ?? '';
    this.name = input.name ?? '';
    this.maxChildren = input.maxChildren ?? 0;
    this.maxAdult = input.maxAdult ?? 0;
    this.roomCount = input.roomCount ?? 0;
    this.occupancy = input.maxOccupancy ?? null;
    return this;
  }
}

export class OfferList {
  records: OfferData[];
  deserialize(input) {
    this.records =
      input?.offers.map((item) => new OfferData().deserialize(item)) ?? [];
    return this;
  }
}

export class OfferData {
  id: string;
  description: string;

  deserialize(input) {
    this.id = input.id ?? '';
    this.description = input.description ?? '';
    return this;
  }
}

export class ReservationFormData {
  reservationInformation: BookingInfo;
  guestInformation: GuestInfo;
  address: AddressInfo;
  paymentMethod: PaymentInfo;
  offerId: string;
  roomInformation: RoomTypeInfo;

  deserialize(input): this {
    this.reservationInformation = new BookingInfo().deserialize(input);
    this.guestInformation = new GuestInfo().deserialize(input);
    this.address = new AddressInfo().deserialize(input.address);
    this.paymentMethod = new PaymentInfo().deserialize(input);
    this.roomInformation = new RoomTypeInfo().deserialize(input);
    this.offerId = input?.offerId;
    return this;
  }
}

export class BookingInfo {
  from: number;
  to: number;
  reservationType: string;
  source: string;
  sourceName: string;
  marketSegment: string;

  deserialize(input): this {
    this.from = input?.from;
    this.to = input?.to;
    this.reservationType = input?.reservationType;
    this.source = input?.source;
    this.sourceName = input?.sourceName;
    this.marketSegment = input?.marketSegment;
    return this;
  }
}

export class GuestInfo {
  firstName: string;
  lastName: string;
  email: string;
  countryCode: number;
  phoneNumber: number;
  deserialize(input): this {
    this.firstName = input?.firstName;
    this.lastName = input?.lastName;
    this.email = input?.email;
    this.countryCode = input?.contact?.countryCode;
    this.phoneNumber = input?.contact?.phoneNumber;
    return this;
  }
}

export class AddressInfo {
  addressLine1: string;
  city: string;
  countryCode: string;
  state: string;
  postalCode: string;
  deserialize(input): this {
    this.addressLine1 = input?.addressLine1;
    this.city = input?.city;
    this.countryCode = input?.countryCode;
    this.postalCode = input?.postalCode;
    this.state = input?.state;
    return this;
  }
}

export class PaymentInfo {
  totalPaidAmount: string;
  paymentMethod: string;
  paymentRemark: string;
  deserialize(input): this {
    this.totalPaidAmount = input?.totalPaidAmount;
    this.paymentMethod = input?.paymentMethod;
    this.paymentRemark = input?.paymentRemark;
    return this;
  }
}

export class RoomTypeInfo {
  adultCount: number;
  childCount: number;
  roomCount: number;
  roomType: string;
  roomTypeId: string;
  deserialize(input): this {
    this.adultCount = input?.adultCount;
    this.childCount = input?.childCount;
    this.roomCount = input?.roomCount;
    this.roomType = input?.roomType;
    this.roomTypeId = input?.roomTypeId;
    return this;
  }
}

export class PaymentMethodList {
  records: PaymentMethod[];
  deserialize(input) {
    this.records = Object.keys(input).map((key) => {
      return new PaymentMethod().deserialize(input[key]);
    });
    return this;
  }
}

export class PaymentMethod {
  description: string;
  iconUrl: string;
  label: string;
  type: PaymentMethodConfig[];
  deserialize(input): this {
    this.description = input?.description;
    this.iconUrl = input?.iconUrl;
    this.label = input?.label;
    this.type = input?.type ?? [];
    return this;
  }
}

export class SummaryData {
  originalPrice: number;
  basePrice: number;
  id: string;
  location: string;
  offerAmount: number;
  roomTypeName: string;
  taxAndFees: number;
  totalAmount: number;
  adultCount: number;
  childCount: number;
  roomCount: number;

  deserialize(input): this {
    this.id = input?.id;
    this.location = input?.location;
    this.offerAmount = input?.offerAmount;
    this.roomTypeName = input?.roomTypeName;
    this.originalPrice = input?.originalPrice || input?.roomOriginalPrice;
    this.basePrice = input?.basePrice || input?.roomBasePrice;
    this.taxAndFees = input?.taxAndFees;
    this.totalAmount = input?.totalAmount;
    this.adultCount = input?.adultCount;
    this.childCount = input?.childCount;
    this.roomCount = input?.roomCount;
    return this;
  }
}

export class BookingConfig {
  marketSegment: Option[] = [];
  source: Option[] = [];
  type: Option[] = [];
  deserialize(input): this {
    this.marketSegment = input?.marketSegment.map((item) => ({
      label: item,
      value: item,
    }));
    this.type = input?.type.map((item) => ({
      label: this.toCamelCase(item),
      value: item,
    }));
    this.source = input?.source.map((item) => ({
      label: this.toCamelCase(item),
      value: item,
    }));
    return this;
  }

  toCamelCase(txt) {
    switch (txt) {
      case 'CREATE_WITH':
        return 'Booking Engine';
      case 'OTA':
        return 'OTA';
      case 'WALK_IN':
        return 'Walk In';
      case 'OFFLINE_SALES':
        return 'Offline Sales';
      default:
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    }
  }
}

export class Guest {
  label: string;
  value: string;
  phoneNumber: string;
  cc: string;
  email: string;
  
  deserialize(input: SearchGuestResponse) {
    this.label = `${input.firstName} ${input.lastName}`;
    this.value = input.id;
    this.phoneNumber = input.contactDetails?.contactNumber;
    this.cc = input.contactDetails?.cc;
    this.email = input.contactDetails?.emailId;
    return this;
  }
}
