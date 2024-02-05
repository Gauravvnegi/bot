import { Cols } from '@hospitality-bot/admin/shared';

export const categoryCols: Cols[] = [
  {
    field: 'name',
    header: 'Category Name',
    sortType: 'string',
  },
  {
    field: 'ServiceItems',
    header: 'Service Items',
    sortType: 'string',
    isSearchDisabled: true,
    isSortDisabled: true,
  },
  {
    field: 'status',
    header: 'Status',
    isSearchDisabled: true,
    width: '20%',
  },
];
