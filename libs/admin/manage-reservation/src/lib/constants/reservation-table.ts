import { Cols, Status } from '@hospitality-bot/admin/shared';
import { Chip } from '@hospitality-bot/admin/shared';
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

export const cols: Cols[] = [
  {
    field: 'roomCount',
    header: 'Rooms/Type',
    isSort: true,
    sortType: 'number',
    dynamicWidth: true,
  },
  {
    field: 'confirmationNo',
    header: 'Confirmation No',
    isSort: true,
    sortType: 'number',
    dynamicWidth: true,
    isSearchDisabled: false,
  },
  {
    field: 'fullName',
    header: 'Guest',
    isSort: true,
    sortType: 'string',
    dynamicWidth: true,
    isSearchDisabled: false,
  },
  {
    field: 'from',
    header: 'Date',
    isSort: true,
    sortType: 'number',
    dynamicWidth: true,
    isSearchDisabled: false,
  },
  {
    field: 'amount',
    header: 'Amount Due/Total (INR)',
    isSort: false,
    sortType: 'string',
    dynamicWidth: true,
    isSearchDisabled: true,
  },
  {
    field: 'source',
    header: 'Source',
    isSort: true,
    sortType: 'string',
    dynamicWidth: true,
    isSearchDisabled: true,
  },
  {
    field: 'payment',
    header: 'Payment',
    isSort: false,
    sortType: 'string',
    dynamicWidth: true,
    isSearchDisabled: true,
  },
  {
    field: 'reservationType',
    header: 'Actions',
    isSort: true,
    sortType: 'string',
    dynamicWidth: true,
    isSearchDisabled: true,
  },
];

export const title = 'Booking';

/* Status of the reservation */
export enum ReservationStatusType {
  ALL = 'ALL',
  CONFIRMED = 'CONFIRMED',
  DRAFT = 'DRAFT',
  CANCELLED = 'CANCELED',
}

export const reservationStatus: Status[] = [
  {
    label: 'Draft',
    value: ReservationStatusType.DRAFT,
    type: 'warning',
    disabled: false,
  },
  {
    label: 'Cancel',
    value: ReservationStatusType.CANCELLED,
    type: 'failed',
    disabled: false,
  },
  {
    label: 'Confirm',
    value: ReservationStatusType.CONFIRMED,
    type: 'new',
    disabled: false,
  },
];

/* All Chips */
export const chips: Chip<
  | ReservationStatusType.ALL
  | ReservationStatusType.DRAFT
  | ReservationStatusType.CONFIRMED
  | ReservationStatusType.CANCELLED
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
    type: 'new',
  },
  {
    label: 'Cancelled ',
    value: ReservationStatusType.CANCELLED,
    total: 0,
    isSelected: false,
    type: 'failed',
  },
];
