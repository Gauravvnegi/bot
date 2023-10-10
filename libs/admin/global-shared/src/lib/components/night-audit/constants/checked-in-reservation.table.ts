import { Cols } from '@hospitality-bot/admin/shared';

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
    field: 'amount',
    header: 'Amount Due',
  },
  {
    field: 'action',
    header: 'Actions',
  },
];

// Dummy Data
export const checkedInList = [
  {
    invoiceId: 'INV001',
    roomInfo: {
      roomNumber: '101',
      type: 'Single',
    },
    bookingNo: 'BN001',
    stakeHolder: {
      guest: 'Guest',
      company: 'Google',
    },
    visitStatus: '03/03/2023',
    expenses: '5000/7000',
    sourceName: {
      source: 'Ameer',
      name: 'Agent',
    },
    amount: '5000',
    action: {
      dropDown: [
        { label: 'No Show', value: 'no-show' },
        { label: 'Cancel', value: 'cancel' },
      ],
      quick: [{ label: 'Reservation', value: 'reservation' }],
    },
  },
  {
    invoiceId: 'INV002',
    roomInfo: {
      roomNumber: '102',
      type: 'Double',
    },
    bookingNo: 'BN002',
    stakeHolder: {
      guest: 'Gourav',
      company: 'Google',
    },
    visitStatus: '03/03/2023',
    expenses: '5000/8000',
    sourceName: {
      source: 'Ameer',
      name: 'Agent',
    },
    amount: '8000',
    action: {
      dropDown: [
        { label: 'No Show', value: 'no-show' },
        { label: 'Cancel', value: 'cancel' },
      ],
      quick: [{ label: 'Reservation', value: 'reservation' }],
    },
  },
  {
    invoiceId: 'INV003',
    roomInfo: {
      roomNumber: '102',
      type: 'Suite',
    },
    bookingNo: 'BN003',
    stakeHolder: {
      guest: 'Gourav',
      company: 'Google',
    },
    visitStatus: '03/03/2023',
    expenses: '9000/9000',
    sourceName: {
      source: 'Ameer',
      name: 'Agent',
    },
    amount: '6000',
    action: {
      dropDown: [
        { label: 'No Show', value: 'no-show' },
        { label: 'Cancel', value: 'cancel' },
      ],
      quick: [{ label: 'Reservation', value: 'reservation' }],
    },
  },
  {
    invoiceId: 'INV004',
    roomInfo: {
      roomNumber: '103',
      type: 'Double',
    },
    bookingNo: 'BN004',
    stakeHolder: {
      guest: 'Sourav',
      company: 'BigOh',
    },
    visitStatus: '03/03/2023',
    expenses: '6000/7000',
    sourceName: 'Walk-in',
    amount: '7000',
    action: {
      dropDown: [
        { label: 'No Show', value: 'no-show' },
        { label: 'Cancel', value: 'cancel' },
      ],
      quick: [{ label: 'Reservation', value: 'reservation' }],
    },
  },
];
