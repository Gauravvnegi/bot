import { filtersChips } from '@hospitality-bot/admin/library';
import { Cols } from '@hospitality-bot/admin/shared';

export const cols: Cols[] = [
  {
    field: 'companyName',
    header: 'Name / Code',
    sortType: 'string',
    searchField: ['companyName', 'code'],
  },
  {
    field: 'contactName',
    header: 'Contact Name',
    sortType: 'string',
  },
  {
    field: 'email',
    header: 'Email',
    sortType: 'string',
  },
  {
    field: 'phoneNumber',
    header: 'Phone No.',
    sortType: 'string',
  },
  {
    field: 'salesPersonName',
    header: 'Sales Person Name',
    sortType: 'string',
  },
  {
    field: 'salesPersonNumber',
    header: 'Sales Person No.',
    sortType: 'string',
  },
  {
    field: 'discount',
    header: 'Discount',
    sortType: 'number',
  },
  {
    field: 'status',
    header: 'Action/Status',
    sortType: 'string',
    isSearchDisabled: true,
  },
];

export const chips = filtersChips.map((item) => ({ ...item }));

export const title = 'Company';
