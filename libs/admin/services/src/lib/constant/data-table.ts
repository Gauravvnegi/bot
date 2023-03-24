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
    header: 'Name/Category',
    isSort: true,
    sortType: 'string',
    dynamicWidth: true,
    width: '30%',
  },
  {
    field: 'code',
    header: 'Code/Source',
    isSort: true,
    sortType: 'string',
    dynamicWidth: true,
    width: '20%',
  },
  {
    field: 'type',
    header: 'Type',
    isSort: true,
    sortType: 'string',
    dynamicWidth: true,
    width: '17%',
  },
  {
    field: 'amount',
    header: 'Amount',
    isSort: true,
    sortType: 'string',
    dynamicWidth: true,
    width: '15%',
  },
  {
    field: 'status',
    header: 'Action',
    isSort: true,
    sortType: 'string',
    dynamicWidth: true,
    width: '18%',
    isSearchDisabled: true,
  },
];

export const title = 'Services';

export const chips = filtersChips.map((item) => ({ ...item }));
