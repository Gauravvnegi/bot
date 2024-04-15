import {
  BookingItems,
  BookingItemsSummary,
  PaymentMethodConfig,
  PaymentRuleResponse,
  ReservationListResponse,
  RoomReservationResponse,
  SourceResponse,
  SummaryResponse,
} from '../types/response.type';
import {
  EntityState,
  EntitySubType,
  FlagType,
  Option,
} from '@hospitality-bot/admin/shared';
import {
  GuestType,
  SearchGuestResponse,
} from 'libs/admin/guests/src/lib/types/guest.type';
import {
  MenuItemsData,
  PaymentRuleForm,
  RoomTypes,
  SessionType,
  SpaItems,
} from '../constants/form';
import { ItemsData, OutletFormData } from '../types/forms.types';
import { RoomTypeForm } from 'libs/admin/room/src/lib/models/room.model';
import { JourneyState, JourneyType } from '../constants/reservation';
import {
  OfferListResponse,
  OfferResponse,
} from 'libs/admin/offers/src/lib/types/response';
import { AgentTableResponse } from 'libs/admin/agent/src/lib/types/response';
import { CompanyResponseType } from 'libs/admin/company/src/lib/types/response';
/* Reservation */

export class RoomReservation {
  id: string;
  from: number;
  to: number;
  source: string;
  reservationType: string;
  sourceName: string;
  confirmationNumber: string;
  status: ReservationCurrentStatus;
  guestName: string;
  companyName: string;
  created: number;
  nextStates: string[];
  bookingItems?: BookingItems[];
  roomTypes?: string[];
  totalAmount: number;
  totalDueAmount: number;
  totalPaidAmount: number;
  guestId: string;
  roomNumber?: string;
  roomType?: string;
  journeysStatus: Record<JourneyType, JourneyState>;
  invoiceId: string;
  agentName?: string;
  groupCode?: string;
  sessionType?: string;

  deserialize(input: RoomReservationResponse) {
    this.id = input.id;
    this.from = input.from;
    this.to = input.to;
    this.source = input.source;
    this.reservationType = input.reservationType;
    this.confirmationNumber = input.reservationNumber;
    this.sourceName = input.sourceName;
    this.source = input.source;
    this.status = ReservationCurrentStatus[input.status];
    const { firstName, lastName } = input?.guest || {};
    this.guestName = firstName
      ? lastName
        ? `${firstName} ${lastName}`
        : firstName
      : lastName || '';
    this.guestId = input.guest?.id;
    this.companyName = input.guest?.company?.firstName ?? '';
    this.created = input.created;
    this.nextStates = [input.reservationType, ...input.nextStates];
    this.totalAmount = input.pricingDetails.totalAmount;
    this.totalPaidAmount = input.pricingDetails.totalPaidAmount;
    this.totalDueAmount = input.pricingDetails.totalDueAmount;
    this.groupCode = input?.groupCode;
    this.sessionType = input?.sessionType;
    // if (input?.bookingItems) {
    //   this.bookingItems = input?.bookingItems;
    //   this.roomTypes =
    //     input?.bookingItems.map((item) => item?.roomDetails?.roomTypeLabel) ??
    //     [];
    // }
    // (this.roomNumber =
    //   (input.bookingItems && input.bookingItems[0]?.roomDetails?.roomNumber) ??
    //   ''),
    //   (this.roomType =
    //     (input.bookingItems &&
    //       input.bookingItems[0]?.roomDetails?.roomTypeLabel) ??
    //     '');

    if (input.bookingItems && input.bookingItems.length) {
      this.bookingItems = input.bookingItems;
      const firstBookingItem = input.bookingItems[0];
      this.roomNumber = firstBookingItem.roomDetails?.roomNumber ?? '';
      this.roomType = firstBookingItem.roomDetails?.roomTypeLabel ?? '';
      this.roomTypes =
        input.bookingItems
          .map((item) => item.roomDetails?.roomTypeLabel)
          .filter(Boolean) ?? [];
    } else {
      this.bookingItems = [];
      this.roomNumber = '';
      this.roomType = '';
      this.roomTypes = [];
    }
    this.journeysStatus = input.journeysStatus;
    this.invoiceId = input?.invoiceId ?? '';
    this.agentName = input?.agent
      ? `${input?.agent?.firstName} ${input?.agent?.lastName}`
      : '';
    this.companyName = input?.company?.firstName ?? '';
    return this;
  }

  getRoomTypeDisplay() {
    return {
      count: this.roomTypes.length,
      countString:
        this.roomTypes.length > 1 ? `(+${this.roomTypes.length - 1})` : null,
    };
  }
}

export type Status = {
  label: string;
  value: string | boolean;
  type: FlagType;
  disabled?: boolean;
};

export enum ReservationCurrentStatus {
  NEW = 'NEW',
  RESERVED = 'RESERVED',
  INHOUSE = 'INHOUSE',
  DUEIN = 'DUEIN',
  DUEOUT = 'DUEOUT',
  CHECKEDOUT = 'CHECKEDOUT',
}

/* Lists of all type Reservations*/
export class ReservationList {
  reservationData: RoomReservation[];
  total: number;
  entityStateCounts: EntityState<string>;
  entityTypeCounts: EntityState<string>;
  deserialize(input: ReservationListResponse, sessionType?: SessionType) {
    this.reservationData =
      input.records?.map((item) => {
        if (sessionType?.length) {
          return (
            item?.sessionType === sessionType &&
            new RoomReservation().deserialize(item)
          );
        } else {
          return new RoomReservation().deserialize(item);
        }
      }) ?? [];
    this.total = input.total;
    this.entityStateCounts = {
      CONFIRMED: input.entityStateCounts.CONFIRMED,
      CANCELED: input.entityStateCounts.CANCELED,
      DRAFT: input.entityStateCounts.DRAFT,
      NOSHOW: input.entityStateCounts.NOSHOW,
    };
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
  NOSHOW: number;
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
  deserialize(input: OfferListResponse) {
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
  name: string;
  description: string;
  validDate: number;
  discountType: string;
  discountValue: number;

  deserialize(input: OfferResponse) {
    this.id = input.id ?? '';
    this.name = input.name ?? '';
    this.description = input.description ?? '';
    this.validDate = input?.endDate ?? 0;
    this.discountType = input?.discountType ?? null;
    this.discountValue = input?.discountValue ?? 0;
    return this;
  }
}

export class ReservationFormData {
  reservationInformation: BookingInfo;
  guestInformation: GuestInfo;
  offerId: string;
  roomInformation: RoomTypes[];
  instructions: Instructions;
  nextStates: string[];
  totalPaidAmount: number;
  totalDueAmount: number;
  totalAmount: number;
  printRate: boolean;
  journeyState: JourneyState;
  currentState: ReservationCurrentStatus;
  paymentRule: PaymentRuleForm;
  agent: AgentTableResponse;
  company: CompanyResponseType;

  deserialize(input: RoomReservationResponse) {
    this.reservationInformation = new BookingInfo().deserialize(input);
    this.guestInformation = new GuestInfo().deserialize(input.guest);
    this.offerId = input.offer ? input.offer?.id : null;
    this.nextStates = [input.reservationType, ...input.nextStates];
    this.instructions = new Instructions().deserialize(input);
    this.paymentRule = new PaymentRule().deserialize(
      input?.paymentRule,
      input.pricingDetails.totalAmount
    );
    this.roomInformation = input?.bookingItems.map((item: BookingItems) => ({
      adultCount: item.occupancyDetails.maxAdult,
      childCount: item.occupancyDetails.maxChildren,
      roomTypeId: item.roomDetails.roomTypeId,
      ratePlanId: item.roomDetails.ratePlan.id,
      roomCount: item.roomDetails.roomCount,
      roomTypeLabel: item.roomDetails.roomTypeLabel,
      ratePlans: {
        value: item.roomDetails.ratePlan.id,
        label: item.roomDetails.ratePlan.label,
        isBase: item.roomDetails.ratePlan.isBase,
        sellingPrice: item?.roomDetails.ratePlan.sellingPrice,
      },
      id: item?.id,
      roomNumbers: item?.roomDetails.roomNumber
        ? [item?.roomDetails.roomNumber]
        : [],
      roomNumber: item?.roomDetails.roomNumber ?? '',
    }));
    this.totalPaidAmount = input.pricingDetails?.totalPaidAmount ?? 0;
    this.totalDueAmount = input.pricingDetails?.totalDueAmount ?? 0;
    this.totalAmount = input.pricingDetails.totalAmount ?? 0;
    this.journeyState = input.journeysStatus.CHECKIN;
    this.currentState = input.status;
    this.printRate = input?.printRate;
    this.company = input?.company ?? null;
    this.agent = input?.agent ?? null;
    return this;
  }
}

export class OutletForm {
  reservationInformation: BookingInfo;
  guestInformation: GuestInfo;
  offerId: string;
  instructions: Instructions;
  orderInformation?: OrderInfo;
  bookingInformation?: BookingInformation;
  eventInformation?: EventInformation;
  nextStates: string[];

  deserialize(input: OutletFormData) {
    this.reservationInformation = new BookingInfo().deserialize(input);
    this.guestInformation = new GuestInfo().deserialize(input.guest);
    this.offerId = input?.offerId;
    this.instructions = new Instructions().deserialize(input);
    this.nextStates = [input.reservationType, ...input.nextStates];
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
    this.numberOfAdults = input?.occupancyDetails.maxAdult ?? 1;
    this.kotInstructions = input?.specialRequest ?? '';
    this.menuItems = input.items.map((item) => ({
      menuItems: item?.itemId,
      unit: item?.unit ?? 1,
      amount: item?.amount ?? 0,
    }));
    this.tableNumber = input?.tableNumber ?? '';
    return this;
  }
}

export class Instructions {
  specialInstructions: string;

  deserialize(input) {
    this.specialInstructions = input.specialRequest;
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
      unit: item?.unit ?? 1,
      amount: item?.amount ?? 0,
    }));
    return this;
  }
}

export class BookingInformation {
  numberOfAdults?: number;
  spaItems: SpaItems[];

  deserialize(input) {
    this.numberOfAdults = input?.occupancyDetails.maxAdult ?? 1;
    this.spaItems = input.items.map((item) => ({
      serviceName: item?.itemId,
      unit: item?.unit ?? 1,
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
  sessionType: string;
  slotId: string;

  deserialize(input): this {
    this.from = input?.from;
    this.to = input?.to;
    this.reservationType = input?.reservationType;
    this.source = input?.source;
    this.sourceName = input?.sourceName;
    this.marketSegment = input?.marketSegment;
    this.status = input?.reservationType ?? '';
    this.dateAndTime = input?.from;
    this.sessionType = input?.sessionType;
    this.slotId = input?.slotId;
    return this;
  }
}

export class PaymentRule {
  amountToPay: number;
  deductedAmount: number;
  makePaymentBefore: number;
  inclusionsAndTerms: string;
  type?: string;

  deserialize(paymentRule: PaymentRuleResponse, totalAmount: number): this {
    this.amountToPay = paymentRule?.amount ?? 0;
    this.deductedAmount = totalAmount - paymentRule?.amount;
    this.makePaymentBefore = paymentRule?.dueDate ?? 0;
    this.inclusionsAndTerms = paymentRule?.remarks ?? '';
    this.type = paymentRule?.type ?? 'FLAT';
    return this;
  }
}

export class GuestInfo {
  id: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  cc?: string;
  email?: string;

  deserialize(input: GuestType): this {
    this.id = input?.id;
    this.firstName = input?.firstName;
    this.lastName = input?.lastName;
    this.phoneNumber = input?.contactDetails?.contactNumber;
    this.cc = input?.contactDetails?.cc;
    this.email = input?.contactDetails?.emailId;
    return this;
  }
}

// export class PaymentInfo {
//   totalPaidAmount: string;
//   paymentMethod: string;
//   paymentRemark: string;
//   deserialize(input): this {
//     this.totalPaidAmount = input?.totalPaidAmount;
//     this.paymentMethod = input?.paymentMethod;
//     this.paymentRemark = input?.paymentRemark;
//     return this;
//   }
// }

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
  from: number;
  to: number;
  bookingItems?: BookingItemsSummary[];
  items?: ItemsData[];
  max?: number;
  adultCount?: number;
  min?: number;
  base?: number;
  paxChild?: number;
  paxAdult?: number;
  totalAmount?: number;
  totalPaidAmount: number;
  totalDueAmount: number;
  discountedAmount: number;
  allowance?: number;
  taxAndFees: number;
  basePrice: number;
  offerAmount: number;
  refund: number;
  miscellaneousCharges: number;
  roomCharges?: number;
  location: string;

  deserialize(input?: SummaryResponse) {
    this.from = input?.from ?? 0;
    this.to = input?.to ?? 0;
    this.bookingItems =
      input?.bookingItems?.map((item) => ({
        ...item?.roomDetails,
        ...item?.occupancyDetails,
        ...item?.pricingDetails,
        id: item?.id,
        offerId: item?.offer?.id ?? null,
      })) ?? [];
    this.items =
      input?.items?.map((item) => ({
        itemId: item?.itemId,
        unit: item?.unit,
        amount: item?.amount,
      })) ?? [];
    this.adultCount = input?.occupancyDetails?.maxAdult ?? 1;
    this.location = input?.location ?? '';
    this.offerAmount = input?.offer?.discountedPrice ?? 0;
    this.totalAmount = input?.pricingDetails.totalAmount ?? 0;
    this.taxAndFees = input?.pricingDetails?.taxAndFees ?? 0;
    this.base = input?.pricingDetails?.base ?? 0;
    this.basePrice = input?.pricingDetails?.basePrice ?? 0;
    this.totalPaidAmount = input?.pricingDetails?.totalPaidAmount ?? 0;
    this.totalDueAmount = input?.pricingDetails?.totalDueAmount ?? 0;
    this.discountedAmount = input?.pricingDetails?.discountedAmount ?? 0;
    this.allowance = input?.pricingDetails?.allowance ?? 0;
    this.min = input?.pricingDetails?.min ?? 0;
    this.max = input?.pricingDetails?.max ?? 0;
    this.paxChild = input?.pricingDetails?.paxChild ?? 0;
    this.paxAdult = input?.pricingDetails?.paxAdult ?? 0;
    this.refund = input?.pricingDetails?.refund ?? 0;
    this.miscellaneousCharges =
      input?.pricingDetails?.miscellaneousCharges ?? 0;
    this.roomCharges = input?.pricingDetails?.roomCharges ?? 0;
    return this;
  }
}

export class BookingConfig {
  marketSegment: Option[] = [];
  source: { label: string; value: string; type?: Option[] }[] = [];
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
    this.source = input?.source.map((item: SourceResponse) => ({
      label: this.toCamelCase(item.name),
      value: item.name,
      type: item.type
        ? item.type.map((type) => ({
            label: type.label,
            value: type.code,
          }))
        : [],
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

export class GuestList {
  records: Guest[];
  deserialize(input: SearchGuestResponse[]) {
    this.records = input.map((item) => new Guest().deserialize(item));
    return this;
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
