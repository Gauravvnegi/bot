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
    field: 'departments',
    header: 'Department',
    sortType: 'string',
  },
  {
    field: 'jobTitle',
    header: 'Job title',
    sortType: 'string',
    isSearchDisabled: true,
  },
  {
    field: 'package',
    header: 'Active',
    isSortDisabled: true,
    isSearchDisabled: true,
  },
];

export const chips = filtersChips.map((item) => ({ ...item }));
