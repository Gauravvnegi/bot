import { FlagType } from '@hospitality-bot/admin/shared';
import { GuestModalStatus } from '../types/guest.type';
export const guestStatusDetails: Record<
  'HIGHRISK' | 'HIGHPOTENTIAL' | 'VIP' | GuestModalStatus,
  { label: string; type: FlagType }
> = {
  HIGHRISK: {
    label: 'High Risk',
    type: 'failed',
  },
  HIGHPOTENTIAL: {
    label: 'High Potential',
    type: 'warning',
  },
  VIP: {
    label: 'VIP',
    type: 'active',
  },
  BOT: {
    label: 'BOT',
    type: 'warning',
  },
  EMAIL: {
    label: 'EMAIL',
    type: 'warning',
  },
  MICROSITE: {
    label: 'MICROSITE',
    type: 'active',
  },
  OTHERS: {
    label: 'OTHERS',
    type: 'default',
  },
  WHATSAPP: {
    label: 'WHATSAPP',
    type: 'completed',
  },
};

export const chips = {
  documents: [
    { label: 'All', icon: '', value: 'ALL', isSelected: true, type: 'default' },
    {
      label: 'Initiated',
      icon: '',
      value: 'INITIATED',
      total: 0,
      isSelected: false,
      type: 'warning',
    },
    {
      label: 'Pending ',
      icon: '',
      value: 'PENDING',
      total: 0,
      isSelected: false,
      type: 'initiated',
    },
    {
      label: 'Accepted ',
      icon: '',
      value: 'ACCEPTED',
      total: 0,
      isSelected: false,
      type: 'completed',
    },
    {
      label: 'Rejected ',
      icon: '',
      value: 'REJECTED',
      total: 0,
      isSelected: false,
      type: 'failed',
    },
  ],
  payments: [
    { label: 'All', icon: '', value: 'ALL', isSelected: true, type: 'default' },
    {
      label: 'Fully Recieved',
      icon: '',
      value: 'FULLYRECIEVED',
      total: 0,
      isSelected: false,
      type: 'new',
    },
    {
      label: 'Partially Recieved ',
      icon: '',
      value: 'PARTIALLYRECIEVED',
      total: 0,
      isSelected: false,
      type: 'warning',
    },
    {
      label: 'Not Recieved ',
      icon: '',
      value: 'NOTRECIEVED',
      total: 0,
      isSelected: false,
      type: 'failed',
    },
  ],
  status: [
    { label: 'All', icon: '', value: 'ALL', isSelected: true, type: 'default' },
    {
      label: 'New',
      icon: '',
      value: 'NEW',
      total: 0,
      isSelected: false,
      type: 'draft',
    },
    {
      label: 'Precheckin ',
      icon: '',
      value: 'PRECHECKIN',
      total: 0,
      isSelected: false,
      type: 'initiated',
    },
    {
      label: 'Checkin ',
      icon: '',
      value: 'CHECKIN',
      total: 0,
      isSelected: false,
      type: 'completed',
    },
    {
      label: 'Checkout ',
      icon: '',
      value: 'CHECKOUT',
      total: 0,
      isSelected: false,
      type: 'completed',
    },
  ],
  type: [
    {
      label: 'VIP',
      icon: '',
      value: 'VIP',
      total: 0,
      isSelected: true,
      type: 'draft',
    },
  ],
  datatable: [
    { label: 'All', icon: '', value: 'ALL', isSelected: true, type: 'default' },
    {
      label: 'VIP',
      icon: '',
      value: 'VIP',
      total: 0,
      isSelected: false,
      type: 'draft',
    },
    {
      label: 'High Potential ',
      icon: '',
      value: 'HIGHPOTENTIAL',
      total: 0,
      isSelected: false,
      type: 'initiated',
    },
    {
      label: 'High Risk ',
      icon: '',
      value: 'HIGHRISK',
      total: 0,
      isSelected: false,
      type: 'completed',
    },
  ],
};

export enum SourceChipsType {
  Bot = 'warning',
  Email = 'warning',
  Microsite = 'active',
  Others = 'draft',
  Whatsapp = 'completed',
}

export const guest = {
  tabFilterItems: {
    documents: [
      {
        label: 'All',
        content: '',
        value: 'ALL',
        disabled: false,
        total: 0,
        chips: chips.documents,
        lastPage: 0,
      },
      {
        label: 'VIP',
        content: '',
        value: 'VIP',
        disabled: false,
        total: 0,
        chips: chips.documents,
        lastPage: 0,
      },
      {
        label: 'General',
        content: '',
        value: 'GENERAL',
        disabled: false,
        total: 0,
        chips: chips.documents,
        lastPage: 0,
      },
    ],
    payments: [
      {
        label: 'All',
        content: '',
        value: 'ALL',
        disabled: false,
        total: 0,
        chips: chips.payments,
        lastPage: 0,
      },
      {
        label: 'VIP',
        content: '',
        value: 'VIP',
        disabled: false,
        total: 0,
        chips: chips.payments,
        lastPage: 0,
      },
      {
        label: 'General',
        content: '',
        value: 'GENERAL',
        disabled: false,
        total: 0,
        chips: chips.payments,
        lastPage: 0,
      },
    ],
    status: [
      {
        label: 'All',
        content: '',
        value: 'ALL',
        disabled: false,
        total: 0,
        chips: chips.status,
        lastPage: 0,
      },
      {
        label: 'VIP',
        content: '',
        value: 'VIP',
        disabled: false,
        total: 0,
        chips: chips.status,
        lastPage: 0,
      },
      {
        label: 'General',
        content: '',
        value: 'GENERAL',
        disabled: false,
        total: 0,
        chips: chips.status,
        lastPage: 0,
      },
    ],
    type: [
      {
        label: 'Arrival',
        content: '',
        value: 'ARRIVAL',
        disabled: false,
        total: 0,
        chips: chips.type,
        lastPage: 0,
      },
      {
        label: 'Inhouse',
        content: '',
        value: 'INHOUSE',
        disabled: false,
        total: 0,
        chips: chips.type,
        lastPage: 0,
      },
      {
        label: 'Departure',
        content: '',
        value: 'DEPARTURE',
        disabled: false,
        total: 0,
        chips: chips.type,
        lastPage: 0,
      },
      {
        label: 'Out-Guest',
        content: '',
        value: 'OUTGUEST',
        disabled: false,
        total: 0,
        chips: chips.type,
        lastPage: 0,
      },
    ],
    datatable: [
      {
        label: 'Due-In',
        content: '',
        value: 'DUEIN',
        disabled: false,
        total: 0,
        chips: chips.datatable,
        lastPage: 0,
      },
      {
        label: 'In-house',
        content: '',
        value: 'INHOUSE',
        disabled: false,
        total: 0,
        chips: chips.datatable,
        lastPage: 0,
      },
      {
        label: 'Due-out',
        content: '',
        value: 'DUEOUT',
        disabled: false,
        total: 0,
        chips: chips.datatable,
        lastPage: 0,
      },
      {
        label: 'Check-Out',
        content: '',
        value: 'CHECKEDOUT',
        disabled: false,
        total: 0,
        chips: chips.datatable,
        lastPage: 0,
      },
    ],
  },
  cols: {
    datatable: [
      {
        field: 'fullName',
        header: 'Guest / Company',
        sortType: 'string',
        searchField: ['fullName'],
      },
      {
        field: 'booking.getArrivalTimeStamp()',
        header: 'Arrival / Departure',
        sortType: 'date',
        isSearchDisabled: true,
      },
      {
        field: 'booking.bookingNumber',
        header: 'Booking No. / Feedback',
        sortType: 'number',
        searchField: [
          'booking.bookingNumber',
          'feedback.comments',
          'feedback.rating',
        ],
      },
      {
        field: `phoneNumber`,
        header: 'Phone No.',
        sortType: 'number',
        searchField: ['phoneNumber', 'countryCode'],
      },
      {
        field: 'payment.totalAmount',
        header: 'Amount Due/ Total Spend',
        sortType: 'number',
        isSearchDisabled: true,
      },
      {
        field: 'guestAttributes.overAllNps',
        header: 'Overall NPS',
        sortType: 'number',
      },
      //  {
      //    field: 'guestAttributes.churnProbalilty',
      //    header: 'Churn Prob / Prediction',
      //    sortType: 'number',
      //    searchField: [
      //      'guestAttributes.churnProbalilty',
      //      'guestAttributes.churnPrediction',
      //    ],
      //  },
      {
        field: 'stageAndourney',
        header: 'Stage/ Channels',
        isSearchDisabled: true,
      },
    ],
  },
  chartTypes: {
    typeGuest: [
      { name: 'Line', value: 'line', url: 'assets/svg/line-graph.svg' },
      { name: 'Bar', value: 'bar', url: 'assets/svg/bar-graph.svg' },
    ],
  },
  legend: {
    typeGuest: [
      {
        label: 'Due-In',
        bubbleColor: '#FF9F67',
      },
      {
        label: 'In House',
        bubbleColor: '#30D8B6',
      },
      {
        label: 'Due-Out',
        bubbleColor: '#F25E5E',
      },
      {
        label: 'Check-Out',
        bubbleColor: '#4A73FB',
      },
    ],
  },
  interval: {
    week: 'week',
  },
  images: {
    document: {
      url: 'assets/svg/guest_documents.svg',
      alt: 'Guest Document',
    },
    payment: {
      url: 'assets/svg/guest_payments.svg',
      alt: 'Guest Payment',
    },
    source: {
      url: 'assets/svg/guest_source.svg',
      alt: 'Guest Source',
    },
    vip: {
      url: 'assets/svg/Guest.svg',
      alt: 'VIP',
    },
    tooltip: {
      url: 'assets/svg/info.svg',
      alt: 'info-icon',
    },
  },
  dropdown: {
    typeGuest: [
      { label: 'All Guests', value: '' },
      { label: 'New Guests', value: 'NEWGUEST' },
      { label: 'Recurring Guests', value: 'REPEATGUEST' },
      { label: 'VIP Guests', value: 'VIP' },
    ],
  },
};

export const colors = {
  INITIATED: '#FF8F00',
  PENDING: '#38649F',
  FAILED: '#EE1044',
  COMPLETED: '#389F99',
};

export const label = {
  INITIATED: 'Initiated',
  PENDING: 'Pending',
  FAILED: 'Rejected',
  COMPLETED: 'Accepted',
};