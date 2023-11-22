import { Cols, FlagType } from '@hospitality-bot/admin/shared';
import { TableViewDataType } from '../../../types/table-view.type';

export const cols: Cols[] = [
  {
    field: 'invoiceId',
    header: 'Invoice Id',
  },
  {
    field: 'roomInfo',
    header: 'Room No / Type',
    width: '14%',
  },
  {
    field: 'bookingNo',
    header: 'Booking No',
    width: '12%',
  },
  {
    field: 'stakeHolder',
    header: 'Guest / Company',
  },
  {
    field: 'visitStatus',
    header: 'Arrival / Departure',
  },
  {
    field: 'expenses',
    header: 'Amount Due / Total (INR)',
    width: '13%',
  },
  {
    field: 'sourceName',
    header: 'Source / Name',
  },
  {
    field: 'action',
    header: 'Actions',
    width: '20%',
  },
];

export const reservationStatus: Record<
  'NOSHOW' | 'CONFIRMED' | 'CANCELED',
  { label: string; type: FlagType }
> = {
  NOSHOW: {
    label: 'No Show',
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

export const quickActions = {
  modify: 'modify',
  settlement: 'settlement',
};
