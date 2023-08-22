import { IteratorField } from 'libs/admin/shared/src/lib/types/fields.type';
import { RatePlanData } from '../models/reservations.model';
import {
  AddedRatePlans,
  ReservationRatePlan,
} from 'libs/admin/room/src/lib/constant/form';

export const roomFields: IteratorField[] = [
  {
    label: 'Room Type',
    name: 'roomTypeId',
    type: 'select',
    options: [],
    required: true,
    placeholder: 'Select',
    width: '18%',
    isAsync: true,
  },
  {
    label: 'Rate Plan',
    name: 'ratePlan',
    type: 'select',
    placeholder: 'Enter',
    width: '20%',
    isAsync: false,
  },
  {
    label: 'Room Count',
    name: 'roomCount',
    type: 'input',
    required: true,
    placeholder: 'Enter',
    width: '10%',
  },
  {
    label: 'Room Number',
    name: 'roomNumbers',
    type: 'multi-select',
    placeholder: 'Enter',
    width: '18%',
    loading: [false],
  },
  {
    label: 'Adult',
    name: 'adultCount',
    type: 'input',
    placeholder: 'Enter',
    width: '10%',
  },
  {
    label: 'Kids',
    name: 'childCount',
    type: 'input',
    placeholder: 'Enter',
    width: '10%',
  },
];

export type RoomFieldTypeOption = {
  label: string;
  value: string;
  roomCount: number;
  ratePlan?: ReservationRatePlan[];
  maxChildren: number;
  maxAdult: number;
  id?: string;
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
    options: [],
    required: true,
    placeholder: 'Search by name',
    width: '40%',
    isAsync: true,
  },
  {
    label: 'Quantity',
    name: 'unit',
    type: 'input',
    required: false,
    placeholder: 'Enter',
    width: '25%',
    dataType: 'number',
  },
  {
    label: 'Amount',
    name: 'amount',
    type: 'input',
    required: false,
    placeholder: 'Enter',
    width: '25%',
    disabled: true,
    dataType: 'number',
  },
];

export const spaFields: IteratorField[] = [
  {
    label: 'Service Name',
    name: 'serviceName',
    type: 'select',
    required: false,
    options: [],
    placeholder: 'Search by name',
    width: '36%',
    isAsync: true,
  },
  {
    label: 'Quantity',
    name: 'unit',
    type: 'input',
    required: false,
    placeholder: 'Enter',
    width: '28%',
    dataType: 'number',
  },
  {
    label: 'Amount',
    name: 'amount',
    type: 'input',
    required: false,
    placeholder: 'Enter',
    width: '28%',
    disabled: true,
    dataType: 'number',
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
    name: 'unit',
    type: 'input',
    required: true,
    placeholder: 'Enter',
    width: '30%',
    dataType: 'number',
  },
  {
    label: 'Amount',
    name: 'amount',
    type: 'input',
    required: false,
    placeholder: 'Enter',
    width: '30%',
    disabled: true,
    dataType: 'number',
  },
];

export const statusOptions = [
  { label: 'Draft', value: 'DRAFT' },
  { label: 'Confirmed', value: 'CONFIRMED' },
  { label: 'Waitlisted', value: 'WAITLISTED' },
  { label: 'Canceled', value: 'CANCELED' },
  { label: 'No Show', value: 'NOSHOW' },
  { label: 'Completed', value: 'COMPLETED' },
];

export const editModeStatusOptions = [
  { label: 'Draft', value: 'DRAFT' },
  { label: 'Confirmed', value: 'CONFIRMED' },
  { label: 'Waitlisted', value: 'WAITLISTED' },
  { label: 'Completed', value: 'COMPLETED' },
];

export const eventOptions = [
  { label: 'Anniversary', value: 'ANNIVERSARY' },
  { label: 'Birthday', value: 'BIRTHDAY' },
  { label: 'Wedding', value: 'WEDDING' },
  { label: 'Conference', value: 'CONFERENCE' },
  { label: 'Exhibition', value: 'EXHIBITION' },
  { label: 'Seminar', value: 'SEMINAR' },
];

export const restaurantReservationTypes = [
  { label: 'Dine-in', value: 'DINE_IN' },
  { label: 'Delivery', value: 'DELIVERY' },
];

export const roomReservationTypes = [
  { label: 'Draft', value: 'DRAFT' },
  { label: 'Confirmed', value: 'CONFIRMED' },
];
