import { Chip, Cols } from '@hospitality-bot/admin/shared';

export const title = 'Tax';

export const cols: Cols[] = [
  {
    field: 'countryName',
    header: 'Country',
    sortType: 'string',
    dynamicWidth: true,
    width: '30%',
    isSort: true,
  },
  {
    field: 'taxType',
    header: 'Tax Type',
    sortType: 'string',
    isSort: true,
    dynamicWidth: true,
    width: '20%',
  },
  {
    field: 'taxRate',
    header: 'Tax%',
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


