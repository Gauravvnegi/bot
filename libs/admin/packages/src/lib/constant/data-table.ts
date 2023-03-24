import { filtersChips } from '@hospitality-bot/admin/library';
import { Cols } from '@hospitality-bot/admin/shared';

export const title = 'Packages';

export const cols: Cols[] = [
  {
    field: 'name',
    header: 'Name/Category',
    sortType: 'string',
    dynamicWidth: true,
    width: '30%',
    isSort: true,
  },
  {
    field: 'code',
    header: 'Code/Source',
    sortType: 'string',
    isSort: true,
    dynamicWidth: true,
    width: '20%',
  },
  {
    field: 'discountedPrice',
    header: 'Amount',
    sortType: 'number',
    isSort: true,
    dynamicWidth: true,
    width: '20%',
  },
  {
    field: 'status',
    header: 'Actions',
    isSort: false,
    isSearchDisabled: true,
    dynamicWidth: true,
    width: '15%',
  },
];

export const chips = filtersChips.map((item) => ({ ...item }));
