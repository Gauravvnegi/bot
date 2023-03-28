import { filtersChips } from '@hospitality-bot/admin/library';
import { Cols } from '@hospitality-bot/admin/shared';

export const cols: Cols[] = [
  {
    field: 'rating',
    header: 'Rating',
    isSort: false,
    sortType: 'number',
    dynamicWidth: true,
    width: '20%',
    isSearchDisabled: true,
  },
  {
    field: 'comment',
    header: 'Text',
    isSort: false,
    sortType: 'string',
    dynamicWidth: true,
    width: '40%',
    isSearchDisabled: true,
  },
  {
    field: 'sentiment',
    header: 'Sentiment',
    isSort: false,
    sortType: 'string',
    dynamicWidth: true,
    width: '20%',
    isSearchDisabled: true,
  },
  {
    field: 'topic',
    header: 'Topic',
    isSort: false,
    sortType: 'string',
    dynamicWidth: true,
    width: '20%',
    isSearchDisabled: true,
  },
];

export const chips = filtersChips.map((item) => ({ ...item }));

export const title = 'Sentiment';
