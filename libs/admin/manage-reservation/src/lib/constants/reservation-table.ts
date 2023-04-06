import { Cols, Filter, Status } from '@hospitality-bot/admin/shared';
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
  // {
  //   label: 'OTA',
  //   value: ReservationTableValue.OTA,
  //   content: '',
  //   disabled: false,
  //   total: 0,
  // },
  // {
  //   label: 'Agent',
  //   value: ReservationTableValue.AGENT,
  //   content: '',
  //   disabled: false,
  //   total: 0,
  // },
  // {
  //   label: 'Walk-in',
  //   value: ReservationTableValue.WALK_IN,
  //   content: '',
  //   disabled: false,
  //   total: 0,
  // },
  // {
  //   label: 'Offline Sales',
  //   value: ReservationTableValue.OFFLINE_SALES,
  //   content: '',
  //   disabled: false,
  //   total: 0,
  // },
  // {
  //   label: 'Booking Engine',
  //   value: ReservationTableValue.BOOKING_ENGINE,
  //   content: '',
  //   disabled: false,
  //   total: 0,
  // },
];

export const cols: Cols[] = [
  {
    field: 'rooms',
    header: 'Rooms/Type',
    isSort: true,
    sortType: 'string',
    dynamicWidth: true,
  },
  {
    field: 'confirmation',
    header: 'Confirmation No',
    isSort: true,
    sortType: 'number',
    dynamicWidth: true,
    isSearchDisabled: false,
  },
  {
    field: 'guest',
    header: 'Guest',
    isSort: true,
    sortType: 'string',
    dynamicWidth: true,
    isSearchDisabled: false,
  },
  {
    field: 'date',
    header: 'Date',
    isSort: true,
    sortType: 'string',
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
    field: 'actions',
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
