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
    field: 'invoice_id',
    header: 'Invoice ID',
    sortType: 'string',
    searchField: ['id'],
  },
  {
    field: 'outlet_name',
    header: 'Outlet Name / Type',
    sortType: 'string',
    searchField: ['name'],
  },
  {
    field: 'booking_no',
    header: 'Booking No / Table No',
    sortType: 'string',
    searchField: ['booking_no'],
  },
  {
    field: 'guest',
    header: 'Guest / Company',
    sortType: 'string',
    searchField: ['guest_name'],
  },
  {
    field: 'date',
    header: 'Date / Time',
    sortType: 'string',
    searchField: ['booking_date'],
  },
  {
    field: 'amount',
    header: 'Amount Due / Total INR',
    sortType: 'string',
    searchField: ['amount'],
  },
  {
    field: 'scource',
    header: 'Scource',
    sortType: 'string',
    searchField: ['scource'],
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
