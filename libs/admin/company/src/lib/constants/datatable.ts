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
    header: 'Email/No.',
    sortType: 'string',
    searchField: ['email', 'phoneNumber'],
  },
  {
    field: 'salesPersonName',
    header: 'Sales Person Name/No.',
    sortType: 'string',
    searchField: ['salesPersonName', 'salesPersonNumber'],
  },
  {
    field: 'discount',
    header: 'Discount',
    sortType: 'number',
  },
  {
    field: 'creditLimit',
    header: 'Credit Limit',
    sortType: 'number',
  },
  {
    field: 'created',
    header: 'Created',
    sortType: 'number',
    searchField: ['createdString'],
  },
  {
    field: 'status',
    header: 'Action/Status',
    sortType: 'number',
    isSearchDisabled: true,
  },
];

export const chips = filtersChips.map((item) => ({ ...item }));

export const title = 'Company';
