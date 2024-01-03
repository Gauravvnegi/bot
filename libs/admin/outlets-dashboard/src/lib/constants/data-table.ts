import { Cols, FlagType } from '@hospitality-bot/admin/shared';
import { DeliveryStatus } from '../types/reservation-table';

export const tabFilterItems = [
  {
    label: 'All',
    content: '',
    value: 'ALL',
    disabled: false,
    total: 0,
  },
  {
    label: 'Draft',
    content: '',
    value: 'DRAFT',
    disabled: false,
    total: 0,
  },
  {
    label: 'Confirmed',
    content: '',
    value: 'CONFIRMED',
    disabled: false,
    total: 0,
  },
  {
    label: 'Cancelled',
    content: '',
    value: 'CANCELLED',
    disabled: false,
    total: 0,
  },
  {
    label: 'No Show',
    content: '',
    value: 'NO_SHOW',
    disabled: false,
    total: 0,
  },
  {
    label: 'Wait List',
    content: '',
    value: 'WAIT_LIST',
    disabled: false,
    total: 0,
  },
];

export const cols: Cols[] = [
  {
    field: 'invoiceId',
    header: 'Invoice ID',
    sortType: 'string',
    searchField: ['id'],
  },
  {
    field: 'outletName',
    header: 'Outlet Name / Type',
    sortType: 'string',
    searchField: ['name', 'type'],
  },
  {
    field: 'bookingNumber',
    header: 'Booking No / Table No',
    sortType: 'string',
    searchField: ['bookingNumber', 'tableNumber'],
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
    sortType: 'date',
  },
  {
    field: 'dueAmount',
    header: 'Amount Due / Total INR',
    sortType: 'number',
    searchField: ['dueAmount', 'totalAmount'],
  },
  {
    field: 'source',
    header: 'Source',
    sortType: 'string',
    searchField: ['source'],
  },
  {
    field: 'payment',
    header: 'Payment',
    sortType: 'string',
    searchField: ['payment'],
  },
  {
    field: 'actions',
    header: 'Actions',
    isSortDisabled: true,
    isSearchDisabled: true,
  },
];
export const status = [
  {
    label: 'Confirmed',
    value: 'CONFIRMED',
    type: 'warning',
  },
  {
    label: 'Clone',
    value: 'CLONE',
    type: 'new',
  },
  {
    label: 'Delete',
    value: 'DELETE',
    type: 'failed',
  },
];

export const reservationTypes = {
  dineIn: {
    name: 'dinein',
    value: 'dinein',
    url: 'assets/svg/reservation-table.svg',
    whiteUrl: 'assets/svg/reservation-table-white.svg',
    backgroundColor: '#1AB99F',
  },
  delivery: {
    name: 'delivery',
    value: 'delivery',
    url: 'assets/svg/calendar-dark.svg',
    whiteUrl: 'assets/svg/calendar-white.svg',
    backgroundColor: '#DEFFF3',
  },
};

export const deliveryReservationStatusDetails: Record<
  DeliveryStatus,
  { label: string; type: FlagType }
> = {
  COMPLETED: {
    label: 'Completed',
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
  PREPARING: {
    label: 'Preparing',
    type: 'warning',
  },
  BLANK_TABLE: {
    label: 'Blank Table',
    type: 'draft',
  },
  PAID: {
    label: 'Paid',
    type: 'active',
  },
  RUNNING_KOT_TABLE: {
    label: 'Running KOT Table',
    type: 'completed',
  },
  RUNNING_TABLE: {
    label: 'Running Table',
    type: 'failed',
  },
  PRINTED_TABLE: {
    label: 'Printed Table',
    type: 'warning',
  },
};
