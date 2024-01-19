import { Cols, FlagType } from '@hospitality-bot/admin/shared';
import {
  ReservationStatus,
  PaymentData,
  PaymentStatus,
  TableStatus,
} from '../types/reservation-table';
import { MenuItemCard } from '../types/menu-order';

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

export const reservationTypes = {
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

export const CardConfig: Record<PaymentStatus, PaymentData> = {
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
};

export const ReservationStatusColorConfig: Record<ReservationStatus, string> = {
  COMPLETED: '#52B33F',
  CONFIRMED: '#3166F0',
  CANCELED: '#F43636',
  PREPARING: '',
  BLANK_TABLE: '',
  PAID: '',
  RUNNING_KOT_TABLE: '',
  RUNNING_TABLE: '',
  PRINTED_TABLE: '',
};

export const ReservationStatusDetails: Record<
  ReservationStatus,
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
  PREPARING: {
    label: 'Preparing',
    type: 'warning',
  },
  BLANK_TABLE: {
    label: 'Blank Table',
    type: 'draft',
  },
  PAID: {
    label: 'Paid',
    type: 'active',
  },
  RUNNING_KOT_TABLE: {
    label: 'Running KOT Table',
    type: 'completed',
  },
  RUNNING_TABLE: {
    label: 'Running Table',
    type: 'failed',
  },
  PRINTED_TABLE: {
    label: 'Printed Table',
    type: 'warning',
  },
};

export const dineInReservationResponse = {
  entityTypeCounts: {
    ALL: 50,
    GARDEN: 10,
    BAR: 20,
    TERACCE: 20,
  },
  entityStateCounts: {
    CONFIRMED: 4,
    CANCELED: 3,
    COMPLETED: 2,
    PREPARING: 2,
    BLANK_TABLE: 4,
    PAID: 1,
    RUNNING_KOT_TABLE: 4,
    RUNNING_TABLE: 3,
    PRINTED_TABLE: 7,
  },
  total: 9,
  reservationData: [
    {
      name: 'Natalia Portman',
      date: 1704968202,
      area: 'Garden',
      paymentMethod: 'Cash',
      totalAmount: 100,
      totalDueAmount: 50,
      bookingNumber: 2342312,
      groupId: 11111,
      nextStates: ['CONFIRMED'],
      invoiceId: '#12121212',
      reservationTime: '10:00 AM',
      adultCount: 2,
      orderNumber: 111,
      tableNumber: 'G01',
      reservationStatus: 'CANCELED',
      preparationTime: '05:00',
      price: 200,
      orderMethod: 'DELIVERY',
      paymentStatus: 'UNPAID',
      numberOfItems: 4,
      tableStatus: 'RUNNING_KOT_TABLE',
    },
    {
      name: 'Natalia Portman',
      date: 1704968202,
      area: 'Garden',
      paymentMethod: 'Cash',
      totalAmount: 100,
      totalDueAmount: 50,
      bookingNumber: 2342312,
      groupId: 11111,
      nextStates: ['CONFIRMED'],
      invoiceId: '#12121212',
      reservationTime: '10:00 AM',
      adultCount: 2,
      orderNumber: 111,
      tableNumber: 'G01',
      reservationStatus: 'CANCELED',
      preparationTime: '05:00',
      price: 200,
      orderMethod: 'DELIVERY',
      paymentStatus: 'UNPAID',
      numberOfItems: 4,
      tableStatus: 'RUNNING_TABLE',
    },
    {
      name: 'Natalia Portman',
      date: 1704968202,
      area: 'Garden',
      paymentMethod: 'Cash',
      totalAmount: 100,
      totalDueAmount: 50,
      bookingNumber: 2342312,
      groupId: 11111,
      nextStates: ['CONFIRMED'],
      invoiceId: '#12121212',
      reservationTime: '10:00 AM',
      adultCount: 2,
      orderNumber: 111,
      tableNumber: 'G01',
      reservationStatus: 'CANCELED',
      preparationTime: '05:00',
      price: 200,
      orderMethod: 'DELIVERY',
      paymentStatus: 'UNPAID',
      numberOfItems: 4,
      tableStatus: 'RUNNING_KOT_TABLE',
    },
    {
      name: 'Natalia Portman',
      date: 1704968202,
      area: 'Garden',
      paymentMethod: 'Cash',
      totalAmount: 100,
      totalDueAmount: 50,
      bookingNumber: 2342312,
      groupId: 11111,
      nextStates: ['CONFIRMED'],
      invoiceId: '#12121212',
      reservationTime: '10:00 AM',
      adultCount: 2,
      orderNumber: 111,
      tableNumber: 'G01',
      reservationStatus: 'COMPLETED',
      preparationTime: '05:00',
      price: 200,
      orderMethod: 'DELIVERY',
      paymentStatus: 'UNPAID',
      numberOfItems: 4,
      tableStatus: 'PRINTED_TABLE',
    },
    {
      name: 'Natalia Portman',
      date: 1704968202,
      area: 'Garden',
      paymentMethod: 'Cash',
      totalAmount: 100,
      totalDueAmount: 50,
      bookingNumber: 2342312,
      groupId: 11111,
      nextStates: ['CONFIRMED'],
      invoiceId: '#12121212',
      reservationTime: '10:00 AM',
      adultCount: 2,
      orderNumber: 111,
      tableNumber: 'G01',
      reservationStatus: 'COMPLETED',
      preparationTime: '05:00',
      price: 200,
      orderMethod: 'DELIVERY',
      paymentStatus: 'UNPAID',
      numberOfItems: 4,
      tableStatus: 'RUNNING_KOT_TABLE',
    },
    {
      name: 'Natalia Portman',
      date: 1704968202,
      area: 'Garden',
      paymentMethod: 'Cash',
      totalAmount: 100,
      totalDueAmount: 50,
      bookingNumber: 2342312,
      groupId: 11111,
      nextStates: ['CONFIRMED'],
      invoiceId: '#12121212',
      reservationTime: '10:00 AM',
      adultCount: 2,
      orderNumber: 111,
      tableNumber: 'G01',
      reservationStatus: 'COMPLETED',
      preparationTime: '05:00',
      price: 200,
      orderMethod: 'DELIVERY',
      paymentStatus: 'UNPAID',
      numberOfItems: 4,
      tableStatus: 'RUNNING_TABLE',
    },
    {
      name: 'Natalia Portman',
      date: 1704968202,
      area: 'Garden',
      paymentMethod: 'Cash',
      totalAmount: 100,
      totalDueAmount: 50,
      bookingNumber: 2342312,
      groupId: 11111,
      nextStates: ['CONFIRMED'],
      invoiceId: '#12121212',
      reservationTime: '10:00 AM',
      adultCount: 2,
      orderNumber: 111,
      tableNumber: 'G01',
      reservationStatus: 'COMPLETED',
      preparationTime: '05:00',
      price: 200,
      orderMethod: 'DELIVERY',
      paymentStatus: 'PAID',
      numberOfItems: 4,
      tableStatus: 'RUNNING_KOT_TABLE',
    },
    {
      name: 'Natalia Portman',
      date: 1704968202,
      area: 'Garden',
      paymentMethod: 'Cash',
      totalAmount: 100,
      totalDueAmount: 50,
      bookingNumber: 2342312,
      groupId: 11111,
      nextStates: ['CONFIRMED'],
      invoiceId: '#12121212',
      reservationTime: '10:00 AM',
      adultCount: 2,
      orderNumber: 111,
      tableNumber: 'G01',
      reservationStatus: 'COMPLETED',
      preparationTime: '05:00',
      price: 200,
      orderMethod: 'DELIVERY',
      paymentStatus: 'PAID',
      numberOfItems: 4,
      tableStatus: 'RUNNING_KOT_TABLE',
    },
    {
      name: 'Natalia Portman',
      date: 1704968202,
      area: 'Garden',
      paymentMethod: 'Cash',
      totalAmount: 100,
      totalDueAmount: 50,
      bookingNumber: 2342312,
      groupId: 11111,
      nextStates: ['CONFIRMED'],
      invoiceId: '#12121212',
      reservationTime: '10:00 AM',
      adultCount: 2,
      orderNumber: 111,
      tableNumber: 'G01',
      reservationStatus: 'COMPLETED',
      preparationTime: '05:00',
      price: 200,
      orderMethod: 'DELIVERY',
      paymentStatus: 'PAID',
      numberOfItems: 4,
      tableStatus: 'PRINTED_TABLE',
    },
  ],
};

export const reservationTabFilters = [
  {
    label: 'Popular',
    value: 'popular',
    isSelected: true,
  },
  {
    label: 'Burger',
    value: 'burger',
    isSelected: false,
  },
  {
    label: 'Dessert',
    value: 'dessert',
    isSelected: false,
  },
  {
    label: 'Beverages',
    value: 'beverages',
    isSelected: false,
  },
  {
    label: 'Pizza',
    value: 'pizza',
    isSelected: false,
  },
  {
    label: 'Biryani',
    value: 'biryani',
    isSelected: false,
  },
  {
    label: 'Breads',
    value: 'breads',
    isSelected: false,
  },
  {
    label: 'Chinense',
    value: 'chinese',
    isSelected: false,
  },
  {
    label: 'Indian',
    value: 'indian',
    isSelected: false,
  },
  {
    label: 'Italian',
    value: 'italian',
    isSelected: false,
  },
];

export const menuCardData = [
  {
    id: 'burger',
    itemName: 'Burger',
    price: 200,
    mealPreference: 'VEG',
    image: 'assets/images/menu-item.jpg',
  },
  {
    id: 'burger',
    itemName: 'Burger',
    price: 200,
    mealPreference: 'VEG',
    image: 'assets/images/menu-item.jpg',
  },
  {
    id: 'burger',
    itemName: 'Burger',
    price: 200,
    mealPreference: 'NON_VEG',
    image: 'assets/images/menu-item.jpg',
  },
  {
    id: 'burger',
    itemName: 'Burger',
    price: 200,
    mealPreference: 'VEG',
    image: 'assets/images/menu-item.jpg',
  },
  {
    id: 'burger',
    itemName: 'Burger',
    price: 200,
    mealPreference: 'NON_VEG',
    image: 'assets/images/menu-item.jpg',
  },
  {
    id: 'burger',
    itemName: 'Burger',
    price: 200,
    mealPreference: 'VEG',
    image: 'assets/images/menu-item.jpg',
  },
  {
    id: 'burger',
    itemName: 'Burger',
    price: 200,
    mealPreference: 'VEG',
    image: 'assets/images/menu-item.jpg',
  },
  {
    id: 'burger',
    itemName: 'Burger',
    price: 200,
    mealPreference: 'VEG',
    image: 'assets/images/menu-item.jpg',
  },
];
