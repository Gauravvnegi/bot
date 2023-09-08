import { Cols, FlagType, Option } from '@hospitality-bot/admin/shared';
import { Chip } from '@hospitality-bot/admin/shared';
import {
  OutletReservationStatus,
  ReservationStatus,
} from '../types/reservation.type';
/**
 * Reservation item type value
 */

export enum ReservationItem {
  reservation = 'SERVICE',
  package = 'PACKAGE',
  offer = 'OFFER',
}

export enum ReservationSearchItem {
  PACKAGE_CATEGORY = 'PACKAGE_CATEGORY',
  SERVICE_CATEGORY = 'SERVICE_CATEGORY',
  ROOM_TYPE = 'ROOM_TYPE',
  SERVICE = 'SERVICE',
  PACKAGE = 'PACKAGE',
}

/**
 * Table filter values
 */
export enum ReservationTableValue {
  ALL = 'ALL',
  OTA = 'OTA',
  AGENT = 'AGENT',
  WALK_IN = 'WALK_IN',
  OFFLINE_SALES = 'OFFLINE_SALES',
  BOOKING_ENGINE = 'CREATE_WITH',
}

export enum OutletItems {
  MENU_ITEM = 'MENU_ITEM',
  FOOD_PACKAGE = 'FOOD_PACKAGE',
}

export enum EntityTabGroup {
  HOTEL = 'HOTEL',
  RESTAURANT_AND_BAR = 'RESTAURANT_AND_BAR',
  VENUE = 'VENUE',
  SPA = 'SPA',
}
export enum ReservationType {
  DRAFT = 'DRAFT',
  CONFIRMED = 'CONFIRMED',
  CANCELED = 'CANCELED',
}
/**
 * Reservation filter Status
 */
export const reservationStatus: ReservationStatus[] = [
  ReservationType.DRAFT,
  ReservationType.CONFIRMED,
  ReservationType.CANCELED,
];

export const reservationStatusDetails: Record<
  ReservationStatus,
  { label: string; type: FlagType }
> = {
  DRAFT: {
    label: 'Draft',
    type: 'active',
  },
  CONFIRMED: {
    label: 'Confirmed',
    type: 'completed',
  },
  CANCELED: {
    label: 'Canceled',
    type: 'failed',
  },
};

export const outletReservationStatusDetails: Record<
  OutletReservationStatus,
  { label: string; type: FlagType }
> = {
  ...reservationStatusDetails,
  COMPLETED: {
    label: 'Completed',
    type: 'completed',
  },
  NOSHOW: {
    label: 'No Show',
    type: 'failed',
  },
  IN: {
    label: 'In',
    type: 'active',
  },
  WAITLISTED: {
    label: 'Waitlisted',
    type: 'active',
  },
};

export const entityTabGroup: Record<EntityTabGroup, Option> = {
  HOTEL: { label: 'Hotel', value: 'HOTEL' },
  RESTAURANT_AND_BAR: { label: 'Res & Bar', value: 'RESTAURANT_AND_BAR' },
  VENUE: { label: 'Venue', value: 'VENUE' },
  SPA: { label: 'Spa', value: 'SPA' },
};

/* Reservation Filters */
export const filters = [
  {
    label: 'All',
    value: 'ALL',
    content: '',
    disabled: false,
    total: 0,
  },
];

export const hotelCols: Cols[] = [
  {
    field: 'invoiceId',
    header: 'Invoice Id',
    sortType: 'string',
  },
  {
    field: 'roomType',
    header: 'Room No / Type',
    sortType: 'number',
    searchField: ['roomNumber', 'roomType'],
    width: '13%',
  },
  {
    field: 'confirmationNumber',
    header: 'Booking Number',
    sortType: 'number',
    searchField: ['confirmationNumber'],
  },
  {
    field: 'guestName',
    header: 'Guest / Company',
    sortType: 'string',
    searchField: ['guestName', 'companyName'],
  },
  {
    field: 'from',
    header: 'Arrival / Departure',
    sortType: 'date',
    isSearchDisabled: true,
  },
  {
    field: 'totalDueAmount',
    header: 'Amount Due / Total (INR)',
    sortType: 'number',
    isSearchDisabled: true,
  },
  {
    field: 'sourceName',
    header: 'Source Name / Type',
    sortType: 'string',
    searchField: ['sourceName', 'source'],
  },
  {
    field: 'totalPaidAmount',
    header: 'Payment',
    sortType: 'number',
    searchField: ['totalPaidAmount'],
  },
  {
    field: 'reservationType',
    header: 'Actions',
    sortType: 'string',
    width: '14%',
    isSearchDisabled: true,
    isSortDisabled: true,
  },
];

export const outletCols: Cols[] = [
  {
    field: 'invoiceId',
    header: 'Invoice Id',
    sortType: 'number',
    searchField: ['invoiceId'],
  },
  {
    field: 'outletName',
    header: 'Outlet Name / Type',
    isSearchDisabled: true,
    isSortDisabled: true,
  },
  {
    field: 'confirmationNumber',
    header: 'Booking Number',
    sortType: 'number',
    searchField: ['confirmationNumber'],
  },
  {
    field: 'guestName',
    header: 'Guest / Company',
    sortType: 'string',
    searchField: ['guestName', 'companyName'],
  },
  {
    field: 'from',
    header: 'Date / Time',
    sortType: 'date',
    isSearchDisabled: true,
  },
  {
    field: 'totalDueAmount',
    header: 'Amount Due / Total (INR)',
    sortType: 'number',
    isSearchDisabled: true,
  },
  {
    field: 'sourceName',
    header: 'Source Name / Type',
    sortType: 'string',
    searchField: ['sourceName', 'source'],
  },
  {
    field: 'totalPaidAmount',
    header: 'Payment',
    sortType: 'string',
    searchField: ['totalPaidAmount'],
  },
  {
    field: 'reservationType',
    header: 'Actions',
    sortType: 'string',
    width: '13%',
    isSearchDisabled: true,
    isSortDisabled: true,
  },
];
export const title = 'Reservation';

export const reservationChips: Record<
  'DRAFT' | 'CANCELED' | 'CONFIRMED' | 'OTA',
  { label: string; type: FlagType }
> = {
  DRAFT: {
    label: 'Draft',
    type: 'warning',
  },
  CANCELED: {
    label: 'Cancel',
    type: 'failed',
  },
  CONFIRMED: {
    label: 'Confirm',
    type: 'active',
  },
  [ReservationTableValue.OTA]: {
    label: ReservationTableValue.OTA,
    type: 'active',
  },
};

/* Status of the reservation */
export enum ReservationStatusType {
  ALL = 'ALL',
  CONFIRMED = 'CONFIRMED',
  DRAFT = 'DRAFT',
  CANCELED = 'CANCELED',
}

/* All Chips */
export const chips: Chip<
  | ReservationStatusType.ALL
  | ReservationStatusType.DRAFT
  | ReservationStatusType.CONFIRMED
  | ReservationStatusType.CANCELED
>[] = [
  {
    label: 'All',
    value: ReservationStatusType.ALL,
    total: 0,
    isSelected: true,
    type: 'default',
  },
  {
    label: 'Draft',
    value: ReservationStatusType.DRAFT,
    total: 0,
    isSelected: false,
    type: 'warning',
  },
  {
    label: 'Confirmed ',
    value: ReservationStatusType.CONFIRMED,
    total: 0,
    isSelected: false,
    type: 'active',
  },
  {
    label: 'Canceled ',
    value: ReservationStatusType.CANCELED,
    total: 0,
    isSelected: false,
    type: 'failed',
  },
];

export const MenuOptions: Option[] = [
  { label: 'Manage Invoice', value: 'MANAGE_INVOICE' },
  { label: 'Edit Reservation', value: 'EDIT_RESERVATION' },
  { label: 'Print Invoice', value: 'PRINT_INVOICE' },
];

export const HotelMenuOptions: Option[] = [
  ...MenuOptions,
  { label: 'Assign Room', value: 'ASSIGN_ROOM' },
];

export const RestaurantMenuOptions: Option[] = [
  ...MenuOptions,
  { label: 'Assign Table', value: 'ASSIGN_TABLE' },
];
