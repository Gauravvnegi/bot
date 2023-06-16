import { filtersChips } from '@hospitality-bot/admin/library';
import { Chip, Cols, Filter } from '@hospitality-bot/admin/shared';

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
      field: 'id',
      header: 'Invoice Id',
      sortType: 'number',
    },
    {
      field: 'bookingNumber',
      header: 'Booking No./ Order No.',
      sortType: 'number',
    },
    {
      field: 'rooms',
      header: 'Rooms',
      sortType: 'number',
    },
    {
      field: 'date',
      header: 'Invoice Date',
      sortType: 'string',
    },
    {
      field: 'bill',
      header: 'Total Bill',
      sortType: 'number',
    },
  ],

  transaction: [
    {
      field: 'id',
      header: 'Transaction Id',
      sortType: 'number',
    },
    {
      field: 'dateTime',
      header: 'Date & Time',
      sortType: 'number',
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
      sortType: 'number',
    },
    {
      field: 'credit',
      header: 'Credit/Debit',
      sortType: 'string',
    },
    {
      field: 'balanceDue',
      header: 'Balance Due',
      sortType: 'number',
    },
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

export const transactionChips: Chip<'ALL' | 'PAID' | 'UNPAID'>[] = [
  {
    label: 'All',
    value: 'ALL',
    total: 0,
    isSelected: true,
    type: 'default',
  },
  {
    label: 'Paid',
    value: 'PAID',
    total: 0,
    isSelected: false,
    type: 'active',
  },
  {
    label: 'Unpaid',
    value: 'UNPAID',
    total: 0,
    isSelected: false,
    type: 'failed',
  },
];

export const invoiceChips: Chip<'ALL' | 'PAID' | 'UNPAID'>[] = [
  {
    label: 'All',
    value: 'ALL',
    total: 0,
    isSelected: true,
    type: 'default',
  },
  {
    label: 'Paid',
    value: 'PAID',
    total: 0,
    isSelected: false,
    type: 'active',
  },
  {
    label: 'Unpaid',
    value: 'UNPAID',
    total: 0,
    isSelected: false,
    type: 'failed',
  },
];
