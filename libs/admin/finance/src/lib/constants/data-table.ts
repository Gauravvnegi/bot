import { filtersChips } from '@hospitality-bot/admin/library';
import { Chip, Cols, Filter, FlagType } from '@hospitality-bot/admin/shared';
import { TransactionStatus } from '../types/history';

export enum TableValue {
  ROOM = 'ROOM',
  RESTAURANT = 'RESTAURANT',
  BAR = 'BAR',
  SPA = 'SPA',
  VENUE = 'VENUE',
}

export const filters: Filter<TableValue, string>[] = [
  {
    label: 'Room',
    value: TableValue.ROOM,
    content: '',
    disabled: false,
    total: 0,
  },
  {
    label: 'Restaurant',
    value: TableValue.RESTAURANT,
    content: '',
    disabled: false,
    total: 0,
  },
  {
    label: 'Bar',
    value: TableValue.BAR,
    content: '',
    disabled: false,
    total: 0,
  },
  {
    label: 'Spa',
    value: TableValue.SPA,
    content: '',
    disabled: false,
    total: 0,
  },
  {
    label: 'Venue',
    value: TableValue.VENUE,
    content: '',
    disabled: false,
    total: 0,
  },
];

export const cols = {
  invoice: [
    {
      field: 'invoiceId',
      header: 'Invoice Id',
      sortType: 'number',
    },
    {
      field: 'bookingNumber',
      header: 'Booking No.',
      sortType: 'number',
    },
    {
      field: 'date',
      header: 'Invoice Date',
      sortType: 'date',
      isSearchDisabled: true,
    },
    {
      field: 'totalBill',
      header: 'Total Bill',
      sortType: 'number',
    },
  ],

  transaction: [
    {
      field: 'transactionId',
      header: 'Transaction Id',
      sortType: 'string',
    },
    {
      field: 'dateTime',
      header: 'Date & Time',
      sortType: 'date',
      isSearchDisabled: true
    },
    {
      field: 'status',
      header: 'Status',
      sortType: 'string',
    },
    {
      field: 'paymentMethod',
      header: 'Payment Method',
      sortType: 'string',
    },
    {
      field: 'remarks',
      header: 'Remarks',
      sortType: 'string',
    },
    {
      field: 'credit',
      header: 'Credit/Debit',
      sortType: 'number',
    },
    // {
    //   field: 'balanceDue',
    //   header: 'Balance Due',
    //   sortType: 'number',
    // },
  ],
};

export const records = [
  {
    invoiceId: '0024',
    bookingNumber: 1234,
    rooms: 204,
    invoiceDate: '20//10/12',
    paymentMethods: 'Cash',
    status: 'Paid',
    totalBill: 'INR 5000',
  },
  {
    invoiceId: '0024',
    bookingNumber: 1234,
    rooms: 204,
    invoiceDate: '20//10/12',
    paymentMethods: 'Cash',
    status: 'Paid',
    totalBill: 'INR 5000',
  },
  {
    invoiceId: '0024',
    bookingNumber: 1234,
    rooms: 204,
    invoiceDate: '20//10/12',
    paymentMethods: 'Cash',
    status: 'Paid',
    totalBill: 'INR 5000',
  },
  {
    invoiceId: '0024',
    bookingNumber: 1234,
    rooms: 204,
    invoiceDate: '20//10/12',
    paymentMethods: 'Cash',
    status: 'Unpaid',
    totalBill: 'INR 5000',
  },
  {
    invoiceId: '0024',
    bookingNumber: 1234,
    rooms: 204,
    invoiceDate: '20//10/12',
    paymentMethods: 'Cash',
    status: 'Paid',
    totalBill: 'INR 5000',
  },
];

export const title = 'Invoice History';

export const transactionStatus: Record<TransactionStatus, {label: string; type: FlagType}> = {
  SUCCESS: {
    label: 'Paid',
    type: 'active'
  },
  FAILURE: {
    label: 'Failed',
    type: 'failed'
  }
}
