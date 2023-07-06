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
    field: 'roomNumber',
    header: 'Room No / Type',
    sortType: 'number',
    searchField: ['roomNumber', 'roomType'],
  },
  {
    field: 'confirmationNo',
    header: 'Confirmation No',
    sortType: 'number',
  },
  {
    field: 'fullName',
    header: 'Guest',
    sortType: 'string',
  },
  {
    field: 'from',
    header: 'Arrival / Departure',
    sortType: 'number',
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
    isSearchDisabled: true,
  },
  {
    field: 'reservationType',
    header: 'Actions',
    sortType: 'string',
    width: '13%',
    isSearchDisabled: true,
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
    width: '13%',
    isSearchDisabled: true,
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
    label: 'Cancelled ',
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
