import { filtersChips } from '@hospitality-bot/admin/library';
import { Cols } from '@hospitality-bot/admin/shared';

export const cols: Cols[] = [
  {
    field: 'name',
    header: 'Name',
    sortType: 'string',
    width: '30%',
    searchField: ['name'],
  },
  {
    field: 'packageCode',
    header: 'Code',
    sortType: 'string',
    width: '20%',
    searchField: ['packageCode', 'source'],
  },
  {
    field: 'startDate',
    header: 'Valid From / To',
    sortType: 'string',
    width: '25%',
    isSearchDisabled: true,
  },
  {
    field: 'status',
    header: 'Action',
    sortType: 'number',
    width: '20%',
    isSearchDisabled: true,
  },
];

export const chips = filtersChips.map((item) => ({ ...item }));

export const title = 'Offers';

export enum DiscountType {
  PERCENTAGE = '%OFF',
  FLAT = 'FLAT',
}
