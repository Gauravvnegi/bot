import { Option } from '@hospitality-bot/admin/shared';
import { DaysType } from '../types/dynamic-pricing.types';

export const Revenue = {
  add: 'add',
  update: 'update',
};

export const weeks: Option<DaysType>[] = [
  { label: 'Mon', value: 'MONDAY' },
  { label: 'Tue', value: 'TUESDAY' },
  { label: 'Wed', value: 'WEDNESDAY' },
  { label: 'Thu', value: 'THURSDAY' },
  { label: 'Fri', value: 'FRIDAY' },
  { label: 'Sat', value: 'SATURDAY' },
  { label: 'Sun', value: 'SUNDAY' },
];
