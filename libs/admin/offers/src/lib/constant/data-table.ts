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
    header: 'Name / Applied on',
    sortType: 'string',
    width: '30%',
    searchField: ['name', 'appliedOn'],
  },
  {
    field: 'packageCode',
    header: 'Code / Source',
    sortType: 'string',
    width: '20%',
    searchField: ['packageCode', 'source'],
  },
  {
    field: 'startDate',
    header: 'Valid From / To',
    sortType: 'string',
    width: '25%',
    isSearchDisabled: true,
  },
  {
    field: 'status',
    header: 'Action',
    sortType: 'string',
    width: '20%',
    isSearchDisabled: true,
  },
];

export const chips = filtersChips.map((item) => ({ ...item }));

export const title = 'Offers';
