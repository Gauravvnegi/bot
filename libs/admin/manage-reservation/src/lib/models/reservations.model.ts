import { RoomTypeResponse } from 'libs/admin/room/src/lib/types/service-response';
import {
  BookingItems,
  PaymentMethodConfig,
  ReservationListResponse,
  ReservationResponse,
  RoomReservationRes,
  SummaryResponse,
} from '../types/response.type';
import {
  EntityState,
  EntitySubType,
  FlagType,
  Option,
} from '@hospitality-bot/admin/shared';
import { SearchGuestResponse } from 'libs/admin/guests/src/lib/types/guest.type';
import { MenuItemsData, RoomTypes, SpaItems } from '../constants/form';
import { OutletFormData } from '../types/forms.types';
import {
  BookingItem,
  RoomReservationResponse,
  RoomSummaryResponse,
} from '../types/reservation-response.type';
import { RoomTypeForm } from 'libs/admin/room/src/lib/models/room.model';
/* Reservation */

export class RoomReservation {
  id: string;
  from: number;
  to: number;
  source: string;
  reservationType: string;
  sourceName: string;
  confirmationNumber: string;
  status: string;
  guestName: string;
  companyName: string;
  created: number;
  nextStates: string[];
  bookingItems: BookingItems[];
  totalAmount: number;
  totalDueAmount: number;
  totalPaidAmount: number;

  deserialize(input: RoomReservationRes) {
    this.id = input.id;
    this.from = input.from;
    this.to = input.to;
    this.source = input.source;
    this.reservationType = input.reservationType;
    this.confirmationNumber = input.reservationNumber;
    this.sourceName = input.sourceName;
    this.source = input.source;
    this.status = input.status;
    this.guestName = input.guest.firstName
      ? input.guest?.firstName + ' ' + (input.guest?.lastName ?? '')
      : '';
    this.companyName = input.guest?.company?.firstName ?? '';
    this.created = input.created;
    this.nextStates = input.nextStates;
    this.bookingItems = input.bookingItems;
    this.totalAmount = input.pricingDetails.totalAmount;
    this.totalPaidAmount = input.pricingDetails.totalPaidAmount;
    this.totalDueAmount = input.pricingDetails.totalDueAmount;
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
  reservationData: RoomReservation[];
  total: number;
  entityStateCounts: EntityState<string>;
  entityTypeCounts: EntityState<string>;
  deserialize(input: ReservationListResponse) {
    this.reservationData =
      input.records?.map((item) => new RoomReservation().deserialize(item)) ??
      [];
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
  records: RoomTypeForm[];
  deserialize(input) {
    this.records =
      input?.roomTypes.map((item) => new RoomTypeForm().deserialize(item)) ??
      [];
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
  paymentMethod: PaymentInfo;
  offerId: string;
  roomInformation: RoomTypes[];
  deserialize(input: RoomReservationResponse) {
    this.reservationInformation = new BookingInfo().deserialize(input);
    this.guestInformation = new GuestInfo().deserialize(input);
    this.paymentMethod = new PaymentInfo().deserialize(input);
    this.offerId = input?.id;
    if (input.bookingItems)
      this.roomInformation = input?.bookingItems.map((item: BookingItem) => ({
        adultCount: item.adultCount,
        childCount: item.childCount,
        roomTypeId: item.roomTypeId,
        ratePlanId: item.ratePlanId,
        roomNumbers: item.tableNumberOrRoomNumber,
        roomCount: item.roomCount,
      }));
    return this;
  }
}

export class OutletForm {
  reservationInformation: BookingInfo;
  guestInformation: GuestInfo;
  paymentMethod: PaymentInfo;
  offerId: string;
  orderInformation?: OrderInfo;
  bookingInformation?: BookingInformation;
  eventInformation?: EventInformation;

  deserialize(input: OutletFormData) {
    this.reservationInformation = new BookingInfo().deserialize(input);
    this.guestInformation = new GuestInfo().deserialize(input);
    this.paymentMethod = new PaymentInfo().deserialize(input);
    this.offerId = input?.offerId;
    switch (input.outletType) {
      case EntitySubType.RESTAURANT:
        this.orderInformation = new OrderInfo().deserialize(input);
        break;
      case EntitySubType.VENUE:
        this.eventInformation = new EventInformation().deserialize(input);
        break;
      case EntitySubType.SPA:
        this.bookingInformation = new BookingInformation().deserialize(input);
        break;
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
      amount: item?.amount ?? 0,
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
      amount: item?.amount ?? 0,
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
      amount: item?.amount ?? 0,
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
    this.status = input?.reservationType ?? '';
    this.dateAndTime = input?.from;
    return this;
  }
}

export class GuestInfo {
  id: string;
  deserialize(input) {
    this.id = input.guest?.id;
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

export class RoomSummaryData {
  from: number;
  to: number;
  roomCount: number;
  adultCount: number;
  childCount: number;
  location: string;
  totalAmount: number;
  bookingItems: BookingItem[];
  desrialize(input: RoomSummaryResponse) {
    this.from = input.from;
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
