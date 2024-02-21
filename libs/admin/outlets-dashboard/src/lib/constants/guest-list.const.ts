import { Option } from 'libs/admin/shared/src';
import { GuestCard } from '../components/guest-card/guest-card.component';
import { ChipType, TabsType } from '../types/guest.type';

export const seatedCards: GuestCard[] = [
  {
    tableNo: 'T001',
    orderNo: 'O123',
    time: '12:30 PM',
    timeLimit: '2 hours',
    people: 4,
    name: 'John Doe',
    type: TabsType['non-resident'],
    feedback: 'Excellent service!',
    phone: '123-456-7890',
  },
  {
    tableNo: 'T002',
    orderNo: 'O124',
    time: '1:45 PM',
    timeLimit: '1.5 hours',
    people: 2,
    name: 'Jane Smith',
    type: TabsType.resident,
    phone: '987-654-3210',
  },
  {
    tableNo: 'T002',
    orderNo: 'O124',
    time: '1:45 PM',
    timeLimit: '1.5 hours',
    people: 2,
    name: 'Jane Smith',
    type: TabsType['non-resident'],
    phone: '987-654-3210',
  },
  {
    tableNo: 'T002',
    orderNo: 'O124',
    time: '1:45 PM',
    timeLimit: '1.5 hours',
    people: 2,
    name: 'Jane Smith',
    type: TabsType.resident,
    phone: '987-654-3210',
  },
  {
    tableNo: 'T002',
    orderNo: 'O124',
    time: '1:45 PM',
    timeLimit: '1.5 hours',
    people: 2,
    name: 'Jane Smith',
    type: TabsType['non-resident'],
    phone: '987-654-3210',
  },
  {
    tableNo: 'T002',
    orderNo: 'O124',
    time: '1:45 PM',
    timeLimit: '1.5 hours',
    people: 2,
    name: 'Jane Smith',
    type: TabsType.resident,
    phone: '987-654-3210',
  },
  {
    tableNo: 'T002',
    orderNo: 'O124',
    time: '1:45 PM',
    timeLimit: '1.5 hours',
    people: 2,
    name: 'Jane Smith',
    type: TabsType.resident,
    phone: '987-654-3210',
  },
  {
    tableNo: 'T002',
    orderNo: 'O124',
    time: '1:45 PM',
    timeLimit: '1.5 hours',
    people: 2,
    name: 'Jane Smith',
    type: TabsType['non-resident'],
    phone: '987-654-3210',
  },
  // Add more items as needed
];

export const waitListCards: GuestCard[] = [
  {
    tableNo: 'T001',
    orderNo: 'O123',
    time: '12:30 PM',
    people: 4,
    name: 'John Doe',
    type: TabsType.resident,
    feedback: 'Excellent service!',
    phone: '123-456-7890',
  },
  {
    tableNo: 'T002',
    orderNo: 'O124',
    time: '1:45 PM',
    people: 2,
    name: 'Jane Smith',
    type: TabsType['non-resident'],
    phone: '987-654-3210',
  },
  {
    tableNo: 'T002',
    orderNo: 'O124',
    time: '1:45 PM',
    people: 2,
    name: 'Jane Smith',
    type: TabsType.resident,
    phone: '987-654-3210',
  },
  {
    tableNo: 'T002',
    orderNo: 'O124',
    time: '1:45 PM',
    people: 2,
    name: 'Jane Smith',
    type: TabsType['non-resident'],
    phone: '987-654-3210',
  },
  {
    tableNo: 'T002',
    orderNo: 'O124',
    time: '1:45 PM',
    people: 2,
    name: 'Jane Smith',
    type: TabsType.resident,
    phone: '987-654-3210',
  },
  {
    tableNo: 'T002',
    orderNo: 'O124',
    time: '1:45 PM',
    people: 2,
    name: 'Jane Smith',
    type: TabsType['non-resident'],
    phone: '987-654-3210',
  },
  {
    tableNo: 'T002',
    orderNo: 'O124',
    time: '1:45 PM',
    people: 2,
    name: 'Jane Smith',
    type: TabsType.resident,
    phone: '987-654-3210',
  },
  {
    tableNo: 'T002',
    orderNo: 'O124',
    time: '1:45 PM',
    people: 2,
    name: 'Jane Smith',
    type: TabsType['non-resident'],
    phone: '987-654-3210',
  },
  // Add more items as needed
];

export const tableList: Option[] = [
  { label: 'Tb01', value: 'tb01' },
  { label: 'Tb02', value: 'tb02' },
  { label: 'Tb03', value: 'tb03', disabled: true },
  { label: 'Tb04', value: 'tb04' },
  { label: 'Tb05', value: 'tb05' },
  { label: 'Tb06', value: 'tb06', disabled: true },
  { label: 'Tb07', value: 'tb07' },
  { label: 'Tb08', value: 'tb08' },
  { label: 'Tb09', value: 'tb09', disabled: true },
  { label: 'Tb10', value: 'tb10', disabled: true },
  { label: 'Tb11', value: 'tb11', disabled: true },
  { label: 'Tb12', value: 'tb12' },
  { label: 'Tb13', value: 'tb13' },
  { label: 'Tb14', value: 'tb14' },
  { label: 'Tb15', value: 'tb15' },
  { label: 'Tb16', value: 'tb16', disabled: true },
  { label: 'Tb17', value: 'tb17' },
  { label: 'Tb18', value: 'tb18' },
  { label: 'Tb19', value: 'tb19' },
  { label: 'Tb20', value: 'tb20' },
];

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
    value: '30',
  },
  {
    label: '1 Hrs',
    value: '60',
  },
  {
    label: '1:30 Min',
    value: '90 Min',
  },
  {
    label: '2 Hrs',
    value: '120 Min',
  },
  {
    label: '3 Hrs',
    value: '180 Min',
  },
  {
    label: '4 Hrs',
    value: '240 Min',
  },
  {
    label: '5 Hrs',
    value: '300 Min',
  },
];
