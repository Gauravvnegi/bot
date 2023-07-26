import { RoomTypeResponse } from 'libs/admin/room/src/lib/types/service-response';
import {
  PaymentMethodConfig,
  ReservationListResponse,
  ReservationResponse,
  SummaryResponse,
} from '../types/response.type';
import { EntityState, FlagType, Option } from '@hospitality-bot/admin/shared';
import { SearchGuestResponse } from 'libs/admin/guests/src/lib/types/guest.type';
import { MenuItemsData, RoomTypes, SpaItems } from '../constants/form';
import { OutletFormData } from '../types/forms.types';
/* Reservation */
export class Reservation {
  id: string;
  entityId: string;
  invoiceId: string;
  rooms: number;
  roomType: string;
  confirmationNo: string;
  guestName: string;
  guestCompany: string;
  outletName: string;
  outletType: string;
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
  nextStates: string[];
  sourceName: string;

  deserialize(input: ReservationResponse) {
    this.id = input.id;
    this.entityId = input.entityId;
    this.invoiceId = input?.invoiceId ?? '';
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
    this.outletName = input?.outletName ?? '';
    this.outletType = input?.outletType ?? '';
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
    this.nextStates = [...input.nextStates, input.reservationType];
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

export class Outlets {}

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
  ratePlan: RatePlanData[];
  roomNumber: string[];
  roomCount: number;
  occupancy: number;
  maxChildren: number;
  maxAdult: number;

  deserialize(input: RoomTypeResponse) {
    this.id = input.id ?? '';
    this.name = input.name ?? '';
    this.maxChildren = input.maxChildren ?? 0;
    // this.roomNumber = input.roomNumber ?? [];
    // this.ratePlan = input?.ratePlans.map((item) => ({
    //   value: item.ratePlanTypeId,
    //   price: item.basePrice,
    //   discountedPrice: item.bestAvailablePrice,
    // }));
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

export type RatePlanData = {
  label?: string;
  value: string;
  price: number;
  discountedPrice: number;
};

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
  orderInforamtion: OrderInfo;
  deserialize(input): this {
    this.reservationInformation = new BookingInfo().deserialize(input);
    this.guestInformation = new GuestInfo().deserialize(input);
    this.address = new AddressInfo().deserialize(input.address);
    this.paymentMethod = new PaymentInfo().deserialize(input);
    this.offerId = input?.offerId;
    this.roomInformation = new RoomTypeInfo().deserialize(input);
    return this;
  }
}

export class OutletForm {
  reservationInformation: BookingInfo;
  guestInformation: GuestInfo;
  address: AddressInfo;
  paymentMethod: PaymentInfo;
  offerId: string;
  orderInforamtion?: OrderInfo;
  bookingInformation?: BookingInformation;
  eventInformation?: EventInformation;

  deserialize(input: OutletFormData) {
    this.reservationInformation = new BookingInfo().deserialize(input);
    this.guestInformation = new GuestInfo().deserialize(input);
    this.address = new AddressInfo().deserialize(input.address);
    this.paymentMethod = new PaymentInfo().deserialize(input);
    this.offerId = input?.offerId;

    switch (input.outletType) {
      case 'RESTUARANT':
        this.orderInforamtion = new OrderInfo().deserialize(input);
      case 'VENUE':
        this.eventInformation = new EventInformation().deserialize(input);
      case 'SPA':
        this.bookingInformation = new BookingInformation().deserialize(input);
    }
    return this;
  }
}

export class OrderInfo {
  numberOfAdults?: number;
  kotInstructions?: string;
  menuItems: MenuItemsData[];
  tableNumber: string;

  deserialize(input) {
    this.numberOfAdults = input?.numberOfAdults ?? 1;
    this.kotInstructions = input?.kotInstructions ?? '';
    this.menuItems = input.items.map((item) => ({
      menuItems: item?.itemId,
      quantity: item?.quantity ?? 1,
      price: item?.amount ?? 0,
    }));
    this.tableNumber = input?.tableNumber ?? '';
    return this;
  }
}

export class EventInformation {
  numberOfAdults: number;
  foodPackage: string;
  foodPackageCount: number;
  venueInfo: MenuItemsData[];

  deserialize(input) {
    this.numberOfAdults = input?.numberOfAdults ?? 1;
    this.foodPackage = input?.foodPackage;
    this.foodPackageCount = input?.foodPackageCount ?? 1;
    this.venueInfo = input.items.map((item) => ({
      description: item?.itemId,
      quantity: item?.quantity ?? 1,
      price: item?.amount ?? 0,
    }));
    return this;
  }
}

export class BookingInformation {
  numberOfAdults?: number;
  spaItems: SpaItems[];

  deserialize(input) {
    this.numberOfAdults = input?.numberOfAdults ?? 1;
    this.spaItems = input.items.map((item) => ({
      serviceName: item?.itemId,
      quantity: item?.quantity ?? 1,
      price: item?.amount ?? 0,
    }));
    return this;
  }
}

export class BookingInfo {
  from?: number;
  to?: number;
  dateAndTime?: number;
  reservationType?: string;
  source: string;
  status?: string;
  sourceName: string;
  marketSegment: string;

  deserialize(input): this {
    this.from = input?.from;
    this.to = input?.to;
    this.reservationType = input?.reservationType;
    this.source = input?.source;
    this.sourceName = input?.sourceName;
    this.marketSegment = input?.marketSegment;
    this.status = input?.status ?? '';
    this.dateAndTime = input?.from;
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
  // roomTypes: RoomTypes[];
  adultCount: number;
  childCount: number;
  roomCount: number;
  roomType: number;
  roomTypeId: string;
  deserialize(input): this {
    this.adultCount = input?.adultCount;
    this.childCount = input?.childCount;
    this.roomCount = input?.roomCount;
    this.roomType = input?.roomType;
    this.roomTypeId = input?.roomTypeId;
    // this.roomTypes.map((item)=>({
    //   roomTypeId: item?.roomTypeId,
    //   ratePlanId: item?.ratePlanId,
    //   roomCount: item?.roomCount,
    //   roomNumber: item?.roomNumber,
    //   adultCount: item?.adultCount,
    //   childCount: input?.childCount,
    // }))
    return this;
  }
}

export class PaymentMethodList {
  records: PaymentMethod[];
  deserialize(input): this {
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
  name: string;
  from: number;
  to: number;
  roomCount: number;
  adultCount: number;
  childCount: number;
  location: string;
  originalPrice: number;
  basePrice: number;
  offerAmount: number;
  taxAndFees: number;
  totalAmount: number;
  taxes: string[];
  // id: string;
  // roomTypeName: string;
  // roomNumbers: Option[];

  deserialize(input: SummaryResponse): this {
    // this.id = input?.id;
    // this.roomTypeName = input?.roomTypeName;
    // this.roomNumbers = input?.roomNumbers;
    this.from = input.from;
    this.to = input.to;
    this.name = input?.name;
    this.location = input?.location;
    this.offerAmount = input?.offerAmount;
    this.originalPrice = input?.originalPrice;
    this.basePrice = input?.basePrice;
    this.taxAndFees = input?.taxAndFees;
    this.totalAmount = input?.totalAmount;
    this.adultCount = input?.adultCount;
    this.childCount = input?.childCount;
    this.roomCount = input?.roomCount;
    this.taxes = input?.taxes;
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
