import { Cols } from 'libs/admin/shared/src/lib/types/table.type';
import { filtersChips } from '@hospitality-bot/admin/library';

export const tableName = 'My Team';

export const cols: Cols[] = [
  {
    field: 'firstName',
    header: 'Name',
    sortType: 'string',
    searchField: ['firstName'],
  },
  {
    field: 'email',
    header: 'Mobile / Email',
    sortType: 'string',
    searchField: ['phoneNumber', 'email'],
  },

  {
    field: 'jobTitle',
    header: 'Job title',
    sortType: 'string',
    isSearchDisabled: false,
  },
  {
    field: 'availableStatus.label',
    header: 'Availability',
    sortType: 'string',
    isSearchDisabled: true,
  },
  {
    field: 'status',
    header: 'Active',
    sortType: 'number',
    isSearchDisabled: true,
    width: '20%',
  },
];

export const chips = filtersChips.map((item) => ({ ...item }));
