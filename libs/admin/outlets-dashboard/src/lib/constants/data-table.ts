import { Cols } from '@hospitality-bot/admin/shared';

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
