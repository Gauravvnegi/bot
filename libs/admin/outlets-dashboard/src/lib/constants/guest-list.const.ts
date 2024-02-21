import { Option } from 'libs/admin/shared/src';
import { ChipType, TabsType } from '../types/guest.type';

export const seatedChips: Option<ChipType>[] = [
  {
    label: 'Seated',
    value: ChipType.seated,
  },
  {
    label: 'Waitlist',
    value: ChipType.waitlist,
  },
];

export const seatedTabGroup: Option<TabsType>[] = [
  {
    label: 'All',
    value: TabsType.all,
  },
  {
    label: 'Resident',
    value: TabsType.resident,
  },
  {
    label: 'Non-Resident',
    value: TabsType['non-resident'],
  },
];

export const slotHours = [
  {
    label: '30 Min',
    value: 30 * 60 * 1000, // 30 minutes converted to milliseconds
  },
  {
    label: '1 Hrs',
    value: 60 * 60 * 1000, // 1 hour converted to milliseconds
  },
  {
    label: '1:30 Min',
    value: 90 * 60 * 1000, // 1 hour 30 minutes converted to milliseconds
  },
  {
    label: '2 Hrs',
    value: 120 * 60 * 1000, // 2 hours converted to milliseconds
  },
  {
    label: '3 Hrs',
    value: 180 * 60 * 1000, // 3 hours converted to milliseconds
  },
  {
    label: '4 Hrs',
    value: 240 * 60 * 1000, // 4 hours converted to milliseconds
  },
  {
    label: '5 Hrs',
    value: 300 * 60 * 1000, // 5 hours converted to milliseconds
  },
];
