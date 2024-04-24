import { Cols, FlagType } from '@hospitality-bot/admin/shared';
import {
  PaymentData,
  PaymentStatus,
  TableStatus,
  OrderReservationStatus,
} from '../types/reservation-table';

export const posCols: Cols[] = [
  {
    field: 'invoiceId',
    header: 'Invoice ID',
    sortType: 'string',
    searchField: ['id'],
  },
  {
    field: 'tableNumber',
    header: 'Table / Area',
    sortType: 'string',
    searchField: ['tableNumber', 'area'],
  },
  {
    field: 'bookingNumber',
    header: 'Booking No. / Group Id',
    sortType: 'string',
    searchField: ['bookingNumber', 'groupId'],
  },
  {
    field: 'guestName',
    header: 'Guest',
    sortType: 'string',
    searchField: ['guestName'],
  },
  {
    field: 'date',
    header: 'Date / Time',
    sortType: 'date',
    isSearchDisabled: true,
  },
  {
    field: 'dueAmount',
    header: 'Amount Due / Total INR',
    sortType: 'number',
    searchField: ['dueAmount', 'totalAmount'],
  },
  {
    field: 'paymentMethod',
    header: 'Payment',
    sortType: 'string',
    searchField: ['paymentMethod'],
  },
  {
    field: 'actions',
    header: 'Actions',
    isSortDisabled: true,
    isSearchDisabled: true,
  },
];

export const tableTypes = {
  card: {
    name: 'Card',
    value: 'card',
    url: 'assets/svg/card-view-black.svg',
    whiteUrl: 'assets/svg/card-view-white.svg',
    backgroundColor: '#1AB99F',
  },
  table: {
    name: 'Table',
    value: 'table',
    url: 'assets/svg/table-view-black.svg',
    whiteUrl: 'assets/svg/table-view-white.svg',
    backgroundColor: '#DEFFF3',
  },
};

export const OrderPaymentConfig: Record<PaymentStatus, PaymentData> = {
  PAID: {
    icon: 'assets/svg/check.svg',
    text: 'Paid',
  },
  UNPAID: {
    icon: 'assets/svg/exclamation.svg',
    text: 'Due',
  },
};

export const TableStatusConfig: Record<
  TableStatus,
  { backgroundColor: string; borderColor: string }
> = {
  RUNNING_KOT_TABLE: {
    borderColor: '#F9E2C8',
    backgroundColor: '#FDF5EC',
  },
  RUNNING_TABLE: {
    borderColor: '#CFEBFC',
    backgroundColor: '#F1F9FE',
  },
  PRINTED_TABLE: {
    borderColor: '#E0EFD7',
    backgroundColor: '#EEF8EC',
  },
  VACANT_TABLE: {
    borderColor: 'rgba(112, 112, 112, 0.35)',
    backgroundColor: '#fff',
  },
};

export const TableReservationStatusDetails: Record<
  TableStatus,
  { label: string; type?: FlagType; color?: string }
> = {
  VACANT_TABLE: {
    label: 'Blank Table',
    color: '#D6D6D6',
  },
  RUNNING_KOT_TABLE: {
    label: 'Running KOT Table',
    color: '#FF9F40',
  },
  RUNNING_TABLE: {
    label: 'Running Table',
    color: '#3166F0',
  },
  PRINTED_TABLE: {
    label: 'Printed Table',
    color: '#52B33F',
  },
};

export const OrderReservationStatusDetails: Record<
  OrderReservationStatus,
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
  DRAFT: {
    label: 'Draft',
    type: 'warning',
  },
};

export const reservationTabFilters = [
  {
    label: 'Popular',
    value: 'POPULAR',
    isSelected: true,
  },
];

export enum OrderTableType {
  ALL = 'ALL',
  ONLINE_ORDER = 'ONLINE_ORDER',
  TAKE_AWAY = 'TAKE_AWAY',
  DINE_IN = 'DINE_IN',
  DELIVERY = 'DELIVERY',
}

export const orderMenuOptions = [
  { label: 'Manage Invoice', value: 'MANAGE_INVOICE' },
  { label: 'Edit Order', value: 'EDIT_ORDER' },
];
