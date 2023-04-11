import { Cols } from "libs/admin/shared/src/lib/types/table.type";
import { filtersChips } from '@hospitality-bot/admin/library';

export const tableName = 'My Team';

export const cols: Cols[] = [
    {
      field: 'firstName',
      header: 'Name/Mobile & Email',
      sortType: 'string',
      isSort: true,
    },
    {
      field: 'departments',
      header: 'Department',
      sortType: 'string',
      isSort: true,
    },
    {
      field: 'jobTitle',
      header: 'Job title',
      sortType: 'string',
      isSort: true,
      isSearchDisabled: true,
    },
    {
      field: 'package',
      header: 'Active',
      isSort: false,
      isSearchDisabled: true,
    },
];

export const chips = filtersChips.map((item) => ({ ...item }));
