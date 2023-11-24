import { Cols } from '@hospitality-bot/admin/shared';
import { IGCellInfo } from 'libs/admin/shared/src/lib/components/interactive-grid/interactive-grid.component';

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

const options: Record<'CHECKIN' | 'CHECKOUT', IGCellInfo['options']> = {
  CHECKIN: [{ label: 'Checking', value: 'checking' }],
  CHECKOUT: [{ label: 'Checking', value: 'checking' }],
};
