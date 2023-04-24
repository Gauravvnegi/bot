import { filtersChips } from '@hospitality-bot/admin/library';
import { Cols } from '@hospitality-bot/admin/shared';
export const tabFilterItems = [
  {
    label: 'All',
    content: '',
    value: 'ALL',
    disabled: false,
    total: 0,
  },
];
export const cols: Cols[] = [
  {
    field: 'name',
    header: 'Name/Applied on',
    isSort: true,
    sortType: 'string',
    dynamicWidth: true,
    width: '30%',
  },
  {
    field: 'packageCode',
    header: 'Code/Source',
    isSort: true,
    sortType: 'string',
    dynamicWidth: true,
    width: '20%',
  },
  {
    field: 'startDate',
    header: 'Valid From/To',
    isSort: true,
    sortType: 'string',
    dynamicWidth: true,
    width: '25%',
    isSearchDisabled: true,
  },
  {
    field: 'status',
    header: 'Action',
    isSort: true,
    sortType: 'string',
    dynamicWidth: true,
    width: '20%',
    isSearchDisabled: true,
  },
];

export const chips = filtersChips.map((item) => ({ ...item }));

export const title = 'Offers';
