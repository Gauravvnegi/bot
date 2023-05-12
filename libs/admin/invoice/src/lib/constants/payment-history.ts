import { Cols } from '@hospitality-bot/admin/shared';

export const paymentHistoryCols: Cols[] = [
  {
    field: 'transactionId',
    header: 'Transaction ID',
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
    sortType: 'number',
    isSearchDisabled: true,
  },
  {
    field: 'remarks',
    header: 'Remarks',
    sortType: 'string',
    isSearchDisabled: true,
  },
  {
    field: 'amount',
    header: 'Amount',
    sortType: 'number',
  },
];

export const records = [
  {
    id: '3a2beede-c18f-4912-b9b1-54d1a53ebf9e',
    amount: 1000.0,
    transactionId: '309006698315',
    status: 'PAID',
    reservationId: '09335387-1fd6-484d-a5b5-91a7c823d2d0',
    created: 1609132364673,
    paymentMethod: null,
    remarks: null,
  },
  {
    id: '1aa0fd4d-0cf1-4552-9dd6-a7fe6f781dc1',
    amount: 100.0,
    transactionId: '309006695349',
    status: 'PAID',
    reservationId: '00a58a56-faaf-405a-9e0b-1932b715297d',
    created: 1608823465749,
    paymentMethod: null,
    remarks: null,
  },
  {
    id: '607d7a6d-03f5-4ac9-8b61-e7c2fb1d05f0',
    amount: 0.0,
    transactionId: null,
    status: 'UNPAID',
    reservationId: null,
    created: 1608823426145,
    paymentMethod: null,
    remarks: null,
  },
  {
    id: 'ca60e9fd-48d5-4232-a012-7f49a9348664',
    amount: 100.0,
    transactionId: '309006695205',
    status: 'UNPAID',
    reservationId: '00a58a56-faaf-405a-9e0b-1932b715297d',
    created: 1608818920625,
    paymentMethod: null,
    remarks: null,
  },
  {
    id: '1d498e62-b712-4c10-9c8e-0b71e46e5d0d',
    amount: 0.0,
    transactionId: null,
    status: 'PAID',
    reservationId: null,
    created: 1608661219933,
    paymentMethod: null,
    remarks: null,
  },
];

export enum PaymentHistoryValue {
  ALL = 'ALL',
  PAID = 'PAID',
  UNPAID = 'UNPAID',
}

export const filters = [
  {
    label: 'All',
    value: 'ALL',
    content: '',
    disabled: false,
    total: 0,
  },
  {
    label: 'Paid',
    value: 'PAID',
    content: '',
    disabled: false,
    total: 0,
  },
  {
    label: 'Unpaid',
    value: 'UNPAID',
    content: '',
    disabled: false,
    total: 0,
  },
];
