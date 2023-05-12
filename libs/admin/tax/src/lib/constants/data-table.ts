import { Chip, Cols } from '@hospitality-bot/admin/shared';

export const title = 'Tax';

export const cols: Cols[] = [
  {
    field: 'countryName',
    header: 'Country',
    sortType: 'string',

    width: '23.75%',
  },
  {
    field: 'taxType',
    header: 'Tax Type',
    sortType: 'string',

    width: '23.75%',
  },
  {
    field: 'category',
    header: 'Category',
    sortType: 'string',

    width: '23.75%',
  },
  {
    field: 'taxRate',
    header: 'Tax%',
    sortType: 'number',

    width: '23.75%',
  },
  {
    field: 'status',
    header: 'Actions',
    isSortDisabled: true,
    isSearchDisabled: true,

    width: '23.75%',
  },
];
export const tabFilterItems = [
  {
    label: 'All',
    content: '',
    value: 'ALL',
    disabled: false,
    total: 0,
  },
];

export const filtersChips: Chip<'ALL' | 'ACTIVE' | 'INACTIVE'>[] = [
  {
    label: 'All',
    value: 'ALL',
    total: 0,
    isSelected: true,
    type: 'default',
  },
  {
    label: 'Active',
    value: 'ACTIVE',
    total: 0,
    isSelected: false,
    type: 'new',
  },
  {
    label: 'Inactive ',
    value: 'INACTIVE',
    total: 0,
    isSelected: false,
    type: 'failed',
  },
];
