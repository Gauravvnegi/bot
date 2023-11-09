import { Option } from '@hospitality-bot/admin/shared';

export enum companyDiscount {
  PERCENTAGE = 'PERCENTAGE',
  FLAT = 'FLAT',
}

export const discountTypes: Option[] = [
  { label: '%OFF', value: companyDiscount.PERCENTAGE },
  { label: 'Flat', value: companyDiscount.FLAT },
];

export const businessSource: Option[] = [
  {
    label: 'Business Source 1',
    value: 'bs1',
  },
  {
    label: 'Business Source 2',
    value: 'bs2',
  },
];
