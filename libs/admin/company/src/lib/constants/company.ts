import { Option } from '@hospitality-bot/admin/shared';

export enum companyDiscount {
  PERCENTAGE = 'PERCENTAGE',
  DISCOUNT = 'DISCOUNT',
}

export const discountTypes: Option[] = [
  { label: '%OFF', value: companyDiscount.PERCENTAGE },
  { label: 'Flat', value: companyDiscount.DISCOUNT },
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

export const billingInstruction: Option[] = [
  {
    label: 'Billing Instruction 1',
    value: 'bi1',
  },
  {
    label: 'Billing Instruction 2',
    value: 'bi2',
  },
];
