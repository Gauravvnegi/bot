import { Option } from 'libs/admin/shared/src';
import { GuestCard } from '../components/guest-card/guest-card.component';

export const seatedCards: GuestCard[] = [
  {
    tableNo: 'T001',
    orderNo: 'O123',
    time: '12:30 PM',
    timeLimit: '2 hours',
    people: 4,
    name: 'John Doe',
    type: 'Resident',
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
    type: 'None-Resident',
    phone: '987-654-3210',
  },
  {
    tableNo: 'T002',
    orderNo: 'O124',
    time: '1:45 PM',
    timeLimit: '1.5 hours',
    people: 2,
    name: 'Jane Smith',
    type: 'None-Resident',
    phone: '987-654-3210',
  },
  {
    tableNo: 'T002',
    orderNo: 'O124',
    time: '1:45 PM',
    timeLimit: '1.5 hours',
    people: 2,
    name: 'Jane Smith',
    type: 'None-Resident',
    phone: '987-654-3210',
  },
  {
    tableNo: 'T002',
    orderNo: 'O124',
    time: '1:45 PM',
    timeLimit: '1.5 hours',
    people: 2,
    name: 'Jane Smith',
    type: 'None-Resident',
    phone: '987-654-3210',
  },
  {
    tableNo: 'T002',
    orderNo: 'O124',
    time: '1:45 PM',
    timeLimit: '1.5 hours',
    people: 2,
    name: 'Jane Smith',
    type: 'None-Resident',
    phone: '987-654-3210',
  },
  {
    tableNo: 'T002',
    orderNo: 'O124',
    time: '1:45 PM',
    timeLimit: '1.5 hours',
    people: 2,
    name: 'Jane Smith',
    type: 'None-Resident',
    phone: '987-654-3210',
  },
  {
    tableNo: 'T002',
    orderNo: 'O124',
    time: '1:45 PM',
    timeLimit: '1.5 hours',
    people: 2,
    name: 'Jane Smith',
    type: 'None-Resident',
    phone: '987-654-3210',
  },
  // Add more items as needed
];

export const seatedChips: Option[] = [
  {
    label: 'Seated',
    value: 'seated',
  },
  {
    label: 'Watchlist',
    value: 'watchlist',
  },
];

export const seatedTabGroup: Option[] = [
  {
    label: 'All',
    value: 'all',
  },
  {
    label: 'Resident',
    value: 'resident',
  },
  {
    label: 'Non-Resident',
    value: 'Resident',
  },
];
