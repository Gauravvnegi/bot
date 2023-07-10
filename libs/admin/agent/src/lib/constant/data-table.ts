import { filtersChips } from '@hospitality-bot/admin/library';
import { Cols } from '@hospitality-bot/admin/shared';

export const cols: Cols[] = [
  {
    field: 'name',
    header: 'Agent Name / Code',
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
    header: 'Email',
    sortType: 'string',
    width: '7%',
  },
  {
    field: 'phoneNo',
    header: 'Phone No',
    sortType: 'string',
    width: '10%',
  },
  {
    field: 'commission',
    header: 'Commission',
    sortType: 'string',
    width: '8%',
  },
  {
    field: 'status',
    header: 'Action',
    sortType: 'string',
    width: '10%',
    isSearchDisabled: true,
  },
];

export const chips = filtersChips.map((item) => ({ ...item }));

export const title = 'Agent'; // routes
