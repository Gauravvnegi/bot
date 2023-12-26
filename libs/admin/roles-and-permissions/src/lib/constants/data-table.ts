import { Cols } from 'libs/admin/shared/src/lib/types/table.type';
import { filtersChips } from '@hospitality-bot/admin/library';

export const tableName = 'My Team';

export const cols: Cols[] = [
  {
    field: 'firstName',
    header: 'Name / Mobile & Email',
    sortType: 'string',
    searchField: ['firstName', 'getContactDetails', 'email'],
  },
  {
    field: 'jobTitle',
    header: 'Job title',
    sortType: 'string',
    isSearchDisabled: true,
  },
  {
    field: 'status',
    header: 'Active',
    sortType: 'number',
    isSearchDisabled: true,
  },
];

export const chips = filtersChips.map((item) => ({ ...item }));
