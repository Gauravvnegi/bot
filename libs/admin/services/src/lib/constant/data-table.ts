import { filtersChips } from '@hospitality-bot/admin/library';
import { Cols, Filter } from '@hospitality-bot/admin/shared';

/**
 * Table filter values
 */
export enum TableValue {
  PAID = 'PAID',
  COMPLIMENTARY = 'COMPLIMENTARY',
  ALL = 'ALL',
}

export const filters: Filter<TableValue, string>[] = [
  {
    label: 'All',
    value: TableValue.ALL,
    content: '',
    disabled: false,
    total: 0,
  },
  {
    label: 'Paid',
    value: TableValue.PAID,
    content: '',
    disabled: false,
    total: 0,
  },
  {
    label: 'Complimentary',
    value: TableValue.COMPLIMENTARY,
    content: '',
    disabled: false,
    total: 0,
  },
];

export const cols: Cols[] = [
  {
    field: 'name',
    header: 'Name / Category',
    sortType: 'string',
    width: '30%',
    searchField: ['name', 'category'],
  },
  {
    field: 'code',
    header: 'Code / Source',
    sortType: 'string',
    width: '20%',
    searchField: ['code', 'source'],
  },
  {
    field: 'type',
    header: 'Type',
    sortType: 'string',
    width: '17%',
  },
  {
    field: 'amount',
    header: 'Amount',
    sortType: 'string',
    width: '15%',
  },
  {
    field: 'status',
    header: 'Action',
    sortType: 'string',
    width: '18%',
    isSearchDisabled: true,
  },
];

export const title = 'Services';

export const chips = filtersChips.map((item) => ({ ...item }));
