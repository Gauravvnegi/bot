import { filtersChips } from '@hospitality-bot/admin/library';
import { Cols } from '@hospitality-bot/admin/shared';

export const title = 'Packages';

export const cols: Cols[] = [
  {
    field: 'name',
    header: 'Name / Category',
    sortType: 'string',
    width: '30%',
    searchField: ['name', 'category'],
  },
  {
    field: 'code',
    header: 'Code / Source',
    sortType: 'string',
    width: '20%',
    searchField: ['code', 'source'],
  },
  {
    field: 'discountedPrice',
    header: 'Amount',
    sortType: 'number',
    width: '20%',
  },
  {
    field: 'status',
    header: 'Actions',
    isSortDisabled: true,
    isSearchDisabled: true,
    width: '15%',
  },
];

export const chips = filtersChips.map((item) => ({ ...item }));
