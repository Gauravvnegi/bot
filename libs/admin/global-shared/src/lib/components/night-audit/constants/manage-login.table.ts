import { Cols } from '@hospitality-bot/admin/shared';

export const cols: Cols[] = [
  {
    field: 'name',
    header: 'Name',
  },
  {
    field: 'contact',
    header: 'Phone/Email',
  },
  {
    field: 'department',
    header: 'Department',
  },
  {
    field: 'jobTitle',
    header: 'Job Title',
  },
];

export const title = 'Logged-in Users';

// Dummy Data
export const usersList = [
  {
    name: 'John Doe',
    department: 'IT',
    contact: {
      phoneNumber: '1234567890',
      email: 'john.doe@example.com',
    },
    jobTitle: 'Software Engineer',
  },
  {
    name: 'Jane Smith',
    department: 'HR',
    jobTitle: 'HR Manager',
    contact: {
      phoneNumber: '9876543210',
      email: 'jane.smith@example.com',
    },
  },
  {
    name: 'Michael Johnson',
    department: 'Finance',
    jobTitle: 'Financial Analyst',
    contact: {
      phoneNumber: '5555555555',
      email: 'michael.johnson@example.com',
    },
  },
  {
    name: 'Sarah Davis',
    contact: {
      phoneNumber: '4444444444',
      email: 'sarah.davis@example.com',
    },
    department: 'Marketing',
    jobTitle: 'Marketing Specialist',
  },
  {
    name: 'Ryan Wilson',
    contact: {
      phoneNumber: '3333333333',
      email: 'ryan.wilson@example.com',
    },
    department: 'Sales',
    jobTitle: 'Sales Representative',
  },
  {
    name: 'Amanda Brown',
    department: 'Operations',
    jobTitle: 'Operations Manager',
    contact: {
      phoneNumber: '2222222222',
      email: 'amanda.brown@example.com',
    },
  },
  {
    name: 'Emily Miller',
    department: 'HR',
    jobTitle: 'HR Coordinator',
    contact: {
      phoneNumber: '1111111111',
      email: 'emily.miller@example.com',
    },
  },
];
