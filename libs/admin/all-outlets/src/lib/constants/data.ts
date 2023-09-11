import { Option } from '@hospitality-bot/admin/shared';
import { IteratorField } from 'libs/admin/shared/src/lib/types/fields.type';


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
    dataType: 'number',
  },
];
