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
    nama: 'John Doe',
    phoneNumber: '1234567890',
    email: 'john.doe@example.com',
    department: 'IT',
    jobTitle: 'Software Engineer',
  },
  {
    nama: 'Jane Smith',
    phoneNumber: '9876543210',
    email: 'jane.smith@example.com',
    department: 'HR',
    jobTitle: 'HR Manager',
  },
  {
    nama: 'Michael Johnson',
    phoneNumber: '5555555555',
    email: 'michael.johnson@example.com',
    department: 'Finance',
    jobTitle: 'Financial Analyst',
  },
  {
    nama: 'Sarah Davis',
    phoneNumber: '4444444444',
    email: 'sarah.davis@example.com',
    department: 'Marketing',
    jobTitle: 'Marketing Specialist',
  },
  {
    nama: 'Ryan Wilson',
    phoneNumber: '3333333333',
    email: 'ryan.wilson@example.com',
    department: 'Sales',
    jobTitle: 'Sales Representative',
  },
  {
    nama: 'Amanda Brown',
    phoneNumber: '2222222222',
    email: 'amanda.brown@example.com',
    department: 'Operations',
    jobTitle: 'Operations Manager',
  },
  {
    nama: 'Emily Miller',
    phoneNumber: '1111111111',
    email: 'emily.miller@example.com',
    department: 'HR',
    jobTitle: 'HR Coordinator',
  },
];
