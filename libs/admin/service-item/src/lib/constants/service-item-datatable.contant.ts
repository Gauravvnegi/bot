import { Cols } from '@hospitality-bot/admin/shared';

export const title = 'Service Item';

export const cols: Cols[] = [
  {
    field: 'name',
    header: 'Name / Category',
    sortType: 'string',
    width: '20%',
    searchField: ['name', 'category'],
  },
  {
    field: 'users',
    header: 'Users',
    width: '15%',
    isSearchDisabled: true,
    isSortDisabled: true,
  },
  {
    field: 'sla',
    header: 'SLA',
    width: '15%',
    isSearchDisabled: true,
    isSortDisabled: true,
  },
  {
    field: 'complaintsDue',
    header: 'Complaint Due / Total',
    width: '15%',
    isSearchDisabled: true,
    isSortDisabled: true,
  },
  {
    field: 'remarks',
    header: 'Remarks',
    width: '15%',
    isSortDisabled: true,
    searchField: ['remarks'],
  },
  {
    field: 'status',
    header: 'Actions',
    sortType: 'number',
    isSearchDisabled: true,
    width: '15%',
  },
];
