import { IteratorField } from 'libs/admin/shared/src/lib/types/fields.type';
import { RatePlanData } from '../models/reservations.model';

export const roomFields: IteratorField[] = [
  {
    label: 'Room Type',
    name: 'roomTypeId',
    type: 'select',
    options: [],
    required: true,
    placeholder: 'Select',
    width: '22%',
    isAsync: true,
  },
  {
    label: 'Rate Plan',
    name: 'ratePlan',
    type: 'select',
    placeholder: 'Enter',
    width: '22%',
    isAsync: false,
  },
  {
    label: 'Room Number',
    name: 'roomNumber',
    type: 'multi-select',
    required: false,
    placeholder: 'Enter',
    width: '22%',
  },
  {
    label: 'Adult',
    name: 'adultCount',
    type: 'input',
    required: true,
    placeholder: 'Enter',
    width: '12%',
  },
  {
    label: 'Kids',
    name: 'childCount',
    type: 'input',
    required: false,
    placeholder: 'Enter',
    width: '12%',
  },
];

export type RoomFieldTypeOption = {
  label: string;
  value: string;
  roomCount: number;
  ratePlan: RatePlanData[];
  roomNumber: string[];
  maxChildren: number;
  maxAdult: number;
};

export const Reservation = {
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

export const menuItemFields: IteratorField[] = [
  {
    label: 'Menu Item',
    name: 'menuItems',
    type: 'select',
    required: true,
    placeholder: 'Search by name',
    width: '40%',
  },
  {
    label: 'Quantity',
    name: 'quantity',
    type: 'input',
    required: true,
    placeholder: 'Enter',
    width: '25%',
  },
  {
    label: 'Price',
    name: 'price',
    type: 'input',
    required: true,
    placeholder: 'Enter',
    width: '25%',
  },
];

export const spaFields: IteratorField[] = [
  {
    label: 'Service Name',
    name: 'serviceName',
    type: 'input',
    required: true,
    placeholder: 'Search by name',
    width: '40%',
  },
  {
    label: 'Quantity',
    name: 'serviceName',
    type: 'input',
    required: true,
    placeholder: 'Enter',
    width: '30%',
  },
  {
    label: 'Price',
    name: 'price',
    type: 'input',
    required: true,
    placeholder: 'Enter',
    width: '30%',
  },
];

export const venueFields: IteratorField[] = [
  {
    label: 'Description ',
    name: 'description',
    type: 'input',
    required: true,
    placeholder: 'Search by name',
    width: '30%',
  },
  {
    label: 'Quantity',
    name: 'serviceName',
    type: 'input',
    required: true,
    placeholder: 'Enter',
    width: '30%',
  },
  {
    label: 'Price',
    name: 'price',
    type: 'input',
    required: false,
    placeholder: 'Enter',
    width: '30%',
  },
];
