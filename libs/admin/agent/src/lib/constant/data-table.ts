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
    width: '10%',
  },
  {
    field: 'iataNo',
    header: 'IATA No',
    sortType: 'string',
    width: '8%',
  },
  {
    field: 'email',
    header: 'Email',
    sortType: 'string',
    width: '10%',
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
    width: '5%',
    isSearchDisabled: true,
  },
];

export const chips = filtersChips.map((item) => ({ ...item }));

export const title = 'Agent'; // routes
