import { Cols, FlagType, Option, Status } from '@hospitality-bot/admin/shared';
import { Chip } from '@hospitality-bot/admin/shared';
import { ReservationStatus } from '../types/reservation.type';
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

export enum EntityTabGroup {
  HOTEL = 'HOTEL',
  RESTAURANT_AND_BAR = 'RESTAURANT_AND_BAR',
  VENUE = 'VENUE',
  SPA = 'SPA',
}

/**
 * Reservation filter Status
 */
export const reservationStatus: ReservationStatus[] = [
  'DRAFT',
  'CONFIRMED',
  'CANCELLED',
];

export const reservationStatusDetails: Record<
  ReservationStatus,
  { label: string; type: FlagType }
> = {
  DRAFT: {
    label: 'DRAFT',
    type: 'active',
  },
  CONFIRMED: {
    label: 'Confirmed',
    type: 'completed',
  },
  CANCELLED: {
    label: 'Cancelled',
    type: 'failed',
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

// export const cols: Cols[] = [
//   {
//     field: 'roomNumber',
//     header: 'Room No / Type',
//     sortType: 'number',
//     searchField: ['roomNumber', 'roomType'],
//   },
//   {
//     field: 'confirmationNo',
//     header: 'Confirmation No',
//     sortType: 'number',
//   },
//   {
//     field: 'fullName',
//     header: 'Guest',
//     sortType: 'string',
//   },
//   {
//     field: 'from',
//     header: 'Arrival / Departure',
//     sortType: 'number',
//     isSearchDisabled: true,
//   },
//   {
//     field: 'totalDueAmount',
//     header: 'Amount Due / Total (INR)',
//     sortType: 'number',
//     isSearchDisabled: true,
//   },
//   {
//     field: 'sourceName',
//     header: 'Source Name / Type',
//     sortType: 'string',
//     searchField: ['sourceName', 'source'],
//   },
//   {
//     field: 'totalPaidAmount',
//     header: 'Payment',
//     sortType: 'number',
//     isSearchDisabled: true,
//   },
//   {
//     field: 'reservationType',
//     header: 'Actions',
//     sortType: 'string',
//     isSearchDisabled: true,
//   },
// ];

export const cols: Cols[] = [
  {
    field: 'invoiceId',
    header: 'Invoice Id',
    sortType: 'number',
    searchField: ['invoiceId'],
  },
  {
    field: 'outletName',
    header: 'Outlet Name / Type',
    sortType: 'string',
    searchField: ['outletName', 'outletType'],
  },
  {
    field: 'bookingNo',
    header: 'Booking No',
    sortType: 'string',
    searchField: ['bookingNo'],
  },
  {
    field: 'guest',
    header: 'Guest / Company',
    sortType: 'string',
    searchField: ['guest', 'company'],
  },

  {
    field: 'date',
    header: 'Date / Time',
    sortType: 'string',
    searchField: ['date', 'time'],
  },
  {
    field: 'totalDueAmount',
    header: 'Amount Due / Total (INR)',
    sortType: 'string',
    searchField: ['totalDueAmount', 'total'],
  },
  {
    field: 'payment',
    header: 'Payment',
    sortType: 'string',
    isSearchDisabled: true,
  },
  {
    field: 'source',
    header: 'Source',
    sortType: 'string',
    isSearchDisabled: true,
  },

  {
    field: 'reservationType',
    header: 'Actions',
    sortType: 'string',
    isSearchDisabled: true,
  },
];
export const title = 'Reservation';

/* Status of the reservation */
export enum ReservationStatusType {
  ALL = 'ALL',
  CONFIRMED = 'CONFIRMED',
  DRAFT = 'DRAFT',
  CANCELLED = 'CANCELED',
}

// export const reservationStatus: Status[] = [
//   {
//     label: 'Draft',
//     value: ReservationStatusType.DRAFT,
//     type: 'warning',
//     disabled: false,
//   },
//   {
//     label: 'Cancel',
//     value: ReservationStatusType.CANCELLED,
//     type: 'failed',
//     disabled: false,
//   },
//   {
//     label: 'Confirm',
//     value: ReservationStatusType.CONFIRMED,
//     type: 'active',
//     disabled: false,
//   },
// ];

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
    type: 'active',
  },
  {
    label: 'Cancelled ',
    value: ReservationStatusType.CANCELLED,
    total: 0,
    isSelected: false,
    type: 'failed',
  },
];
