import { Option } from '@hospitality-bot/admin/shared';
import { IteratorField } from 'libs/admin/shared/src/lib/types/fields.type';

export const days: Option[] = [
  { label: 'Sunday', value: 'SUNDAY' },
  { label: 'Monday', value: 'MONDAY' },
  { label: 'Tuesday', value: 'TUESDAY' },
  { label: 'Wednesday', value: 'WEDNESDAY' },
  { label: 'Thursday', value: 'THURSDAY' },
  { label: 'Friday', value: 'FRIDAY' },
  { label: 'Saturday', value: 'SATURDAY' },
];

export const hours = [
  { label: '12:00 AM', value: 0 },
  { label: '12:30 AM', value: 1800 },
  { label: '1:00 AM', value: 3600 },
  { label: '1:30 AM', value: 5400 },
  { label: '2:00 AM', value: 7200 },
  { label: '2:30 AM', value: 9000 },
  { label: '3:00 AM', value: 10800 },
  { label: '3:30 AM', value: 12600 },
  { label: '4:00 AM', value: 14400 },
  { label: '4:30 AM', value: 16200 },
  { label: '5:00 AM', value: 18000 },
  { label: '5:30 AM', value: 19800 },
  { label: '6:00 AM', value: 21600 },
  { label: '6:30 AM', value: 23400 },
  { label: '7:00 AM', value: 25200 },
  { label: '7:30 AM', value: 27000 },
  { label: '8:00 AM', value: 28800 },
  { label: '8:30 AM', value: 30600 },
  { label: '9:00 AM', value: 32400 },
  { label: '9:30 AM', value: 34200 },
  { label: '10:00 AM', value: 36000 },
  { label: '10:30 AM', value: 37800 },
  { label: '11:00 AM', value: 39600 },
  { label: '11:30 AM', value: 41400 },
  { label: '12:00 PM', value: 43200 },
  { label: '12:30 PM', value: 45000 },
  { label: '1:00 PM', value: 46800 },
  { label: '1:30 PM', value: 48600 },
  { label: '2:00 PM', value: 50400 },
  { label: '2:30 PM', value: 52200 },
  { label: '3:00 PM', value: 54000 },
  { label: '3:30 PM', value: 55800 },
  { label: '4:00 PM', value: 57600 },
  { label: '4:30 PM', value: 59400 },
  { label: '5:00 PM', value: 61200 },
  { label: '5:30 PM', value: 63000 },
  { label: '6:00 PM', value: 64800 },
  { label: '6:30 PM', value: 66600 },
  { label: '7:00 PM', value: 68400 },
  { label: '7:30 PM', value: 70200 },
  { label: '8:00 PM', value: 72000 },
  { label: '8:30 PM', value: 73800 },
  { label: '9:00 PM', value: 75600 },
  { label: '9:30 PM', value: 77400 },
  { label: '10:00 PM', value: 79200 },
  { label: '10:30 PM', value: 81000 },
  { label: '11:00 PM', value: 82800 },
  { label: '11:30 PM', value: 84600 },
];

export const dimensions: Option[] = [
  { label: 'Sq. Ft.', value: 'sqft' },
  { label: 'Sq. M.', value: 'sqm' },
  { label: 'Sq. Yd.', value: 'sqyd' },
  { label: 'Sq. Km.', value: 'sqkm' },
  { label: 'Sq. Mi.', value: 'sqmi' },
  { label: 'Sq. In.', value: 'sqin' },
  { label: 'Sq. Cm.', value: 'sqcm' },
  { label: 'Sq. Mm.', value: 'sqmm' },
  { label: 'Acre', value: 'acre' },
  { label: 'Hectare', value: 'hectare' },
];

export const cuisinesType: Option[] = [
  { label: 'Italian', value: 'italian' },
  { label: 'French', value: 'french' },
  { label: 'Chinese', value: 'chinese' },
  { label: 'Mexican', value: 'mexican' },
  { label: 'Japanese', value: 'japanese' },
  { label: 'Spanish', value: 'spanish' },
  { label: 'Greek', value: 'greek' },
  { label: 'Indian', value: 'indian' },
];

export const restaurantTabItemList = [
  {
    label: 'Complimentary Services',
    value: 'COMPLIMENTARY_SERVICES',
  },
];

export const spaTabItemList = [
  {
    label: 'Paid Services',
    value: 'PAID_SERVICES',
  },
];

export const VenueTabItemList = [
  {
    label: 'Paid Services',
    value: 'PAID_SERVICES',
  },
  {
    label: 'Complimentary Services',
    value: 'COMPLIMENTARY_SERVICES',
  },
];

export const foodPackageFields: IteratorField[] = [
  {
    label: 'Food Category',
    name: 'name',
    type: 'input',
    required: false,
    placeholder: 'Enter name',
    width: '45%',
  },
  {
    label: 'Type',
    name: 'type',
    type: 'input',
    required: false,
    placeholder: 'Enter',
    width: '40%',
  },
];
