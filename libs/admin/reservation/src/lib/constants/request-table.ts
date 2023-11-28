import { Cols } from '@hospitality-bot/admin/shared';

export const cols: Cols[] = [
  {
    field: 'requestTimeStamp',
    header: 'Date / Time',
    sortType: 'Date',
    isSearchDisabled: true,
  },
  {
    field: 'bookingNumber',
    header: 'Booking No.',
    sortType: 'number',
    isSearchDisabled: true,
  },
  {
    field: 'type',
    header: 'Type',
    sortType: 'string',
    isSearchDisabled: true,
  },
  {
    field: 'message.status',
    header: 'Message / Status',
    sortType: 'string',
    isSearchDisabled: true,
  },
];
