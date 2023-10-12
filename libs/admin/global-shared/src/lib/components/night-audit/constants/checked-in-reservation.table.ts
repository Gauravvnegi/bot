import { Cols } from '@hospitality-bot/admin/shared';
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
    width: '16%',
  },
];

// For the decoration, it must use TableViewDataType Type...
export const checkedInList: TableViewDataType[] = [
  {
    invoiceId: 'INV001',
    roomInfo: {
      icon: 'pi pi-users',
      styleClass: 'active-text',
      roomNumber: '101 - Single',
    },
    bookingNo: 'BN001',
    stakeHolder: {
      guest: 'Guest',
      company: 'Google',
      postText: 'tiny-text',
    },
    visitStatus: '03/03/2023',
    expenses: {
      dueAmount: 5000,
      total: 7000,
      preText: 'danger-text',
      textSeparator: '/',
      textInlineBlock: true,
    },
    sourceName: {
      source: 'Ameer',
      name: 'Agent',
      postText: 'tiny-text',
    },
    amount: '5000',
    action: {
      dropDown: {
        currentState: 'NoShow',
        nextStates: ['NoShow', 'CANCEL'],
      },
      quick: [{ label: 'Edit Reservation', value: 'edit-reservation' }],
    },
  },
  {
    invoiceId: 'INV002',
    roomInfo: {
      icon: 'pi pi-users',
      styleClass: 'active-text',
      roomNumber: '102 - Double',
    },
    bookingNo: 'BN002',
    stakeHolder: {
      guest: 'Gourav',
      company: 'Google',
      postText: 'tiny-text',
    },
    visitStatus: '03/03/2023',
    expenses: '5000/8000',
    sourceName: {
      source: 'Ameer',
      name: 'Agent',
      postText: 'tiny-text',
    },
    amount: '8000',
    action: {
      dropDown: {
        currentState: 'NoShow',
        nextStates: ['NoShow', 'CANCEL'],
      },
      quick: [{ label: 'Reservation', value: 'reservation' }],
    },
  },
  {
    invoiceId: 'INV003',
    roomInfo: {
      icon: 'pi pi-users',
      styleClass: 'active-text',
      roomNumber: '102 - Suite',
    },
    bookingNo: 'BN003',
    stakeHolder: {
      guest: 'Gourav',
      company: 'Google',
      postText: 'tiny-text',
    },
    visitStatus: '03/03/2023',
    expenses: '9000/9000',
    sourceName: {
      source: 'Ameer',
      name: 'Agent',
      postText: 'tiny-text',
    },
    amount: '6000',
    action: {
      dropDown: {
        currentState: 'CANCEL',
        nextStates: ['NoShow', 'CANCEL'],
      },
      quick: [{ label: 'Reservation', value: 'reservation' }],
    },
  },
  {
    invoiceId: 'INV004',
    roomInfo: {
      icon: 'pi pi-users',
      styleClass: 'active-text',
      roomNumber: '103 - Double',
    },
    bookingNo: 'BN004',
    stakeHolder: {
      guest: 'Sourav',
      company: 'BigOh',
      postText: 'tiny-text',
    },
    visitStatus: '03/03/2023',
    expenses: '6000/7000',
    sourceName: {
      source: 'Ameer',
      name: 'Agent',
      postText: 'tiny-text',
    },
    amount: '7000',
    action: {
      dropDown: {
        currentState: 'NoShow',
        nextStates: ['NoShow', 'CANCEL'],
      },
      quick: [{ label: 'Reservation', value: 'reservation' }],
    },
  },
];
