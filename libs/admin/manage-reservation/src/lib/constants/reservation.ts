import { IteratorField } from 'libs/admin/shared/src/lib/types/fields.type';

export const roomFields: IteratorField[] = [
  {
    label: 'Room Type',
    name: 'roomTypeId',
    type: 'select',
    options: [],
    required: false,
  },
  {
    label: 'Number of rooms',
    name: 'roomCount',
    type: 'input',
    required: true,
  },
  {
    label: 'Adult',
    name: 'adultCount',
    type: 'input',
    required: true,
  },
  {
    label: 'Kids',
    name: 'childCount',
    type: 'input',
    required: false,
  },
];

export type RoomFieldTypeOption = {
  label: string;
  value: string;
  roomCount: number;
  maxChildren: number;
  maxAdult: number;
};

export const Reservation = {
  reservationTypes: [
    { label: 'Draft', value: 'DRAFT' },
    { label: 'Confirmed', value: 'CONFIRMED' },
  ],

  bookingSources: [
    { label: 'OTA', value: 'OTA' },
    { label: 'Agent', value: 'AGENT' },
    { label: 'Walk-In', value: 'WALK_IN' },
    { label: 'Offline-sales', value: 'OFFLINE_SALES' },
  ],

  marketSegments: [
    { label: 'Leisure', value: 'Leisure' },
    { label: 'Corporate', value: 'Corporate' },
    { label: 'Social', value: 'Social' },
    { label: 'Leisure Group', value: 'Leisure Group' },
    { label: 'Corporate Group', value: 'Corporate Group' },
    { label: 'Social Group', value: 'Social Group' },
  ],
};
