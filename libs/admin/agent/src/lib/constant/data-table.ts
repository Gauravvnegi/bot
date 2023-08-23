import { filtersChips } from '@hospitality-bot/admin/library';
import { Cols } from '@hospitality-bot/admin/shared';

export const cols: Cols[] = [
  {
    field: 'name',
    header: 'Name / Code',
    sortType: 'string',
    width: '10%',
    searchField: ['name', 'code'],
  },
  {
    field: 'company',
    header: 'Company',
    sortType: 'string',
    width: '7%',
  },
  {
    field: 'iataNo',
    header: 'IATA No',
    sortType: 'string',
    width: '6%',
  },
  {
    field: 'email',
    header: 'Email/Phone No.',
    sortType: 'string',
    width: '10%',
    searchField: ['email', 'phoneNo'],
  },
  {
    field: 'commission',
    header: 'Commission',
    sortType: 'string',
    width: '5%',
  },
  {
    field: `created`,
    header: 'Created',
    sortType: 'string',
    width: '8%',
    searchField: ['createdString'],
  },
  {
    field: 'status',
    header: 'Action',
    sortType: 'string',
    width: '8%',
    isSearchDisabled: true,
  },
];

export const chips = filtersChips.map((item) => ({ ...item }));

export const title = 'Agent'; // routes
