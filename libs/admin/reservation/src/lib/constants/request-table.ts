import { Cols } from '@hospitality-bot/admin/shared';

export const cols: Cols[] = [
  {
    field: 'requestTimeStamp',
    header: 'Date/Time',
    isSort: true,
    sortType: 'Date',
    isSearchDisabled: true,
  },
  {
    field: 'bookingNumber',
    header: 'Booking No.',
    isSort: true,
    sortType: 'number',
    isSearchDisabled: true,
  },
  {
    field: 'type',
    header: 'Type',
    isSort: true,
    sortType: 'string',
    isSearchDisabled: true,
  },
  {
    field: 'message.status',
    header: 'Message/Status',
    isSort: true,
    sortType: 'string',
    isSearchDisabled: true,
  },
];
