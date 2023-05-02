import { filtersChips } from '@hospitality-bot/admin/library';
import { Cols } from '@hospitality-bot/admin/shared';

export const cols: Cols[] = [
  {
    field: 'rating',
    header: 'Rating',
    isSortDisabled: true,
    sortType: 'number',

    width: '20%',
    isSearchDisabled: true,
  },
  {
    field: 'comment',
    header: 'Text',
    isSortDisabled: true,
    sortType: 'string',

    width: '40%',
    isSearchDisabled: true,
  },
  {
    field: 'sentiment',
    header: 'Sentiment',
    isSortDisabled: true,
    sortType: 'string',

    width: '20%',
    isSearchDisabled: true,
  },
  {
    field: 'topic',
    header: 'Topic',
    isSortDisabled: true,
    sortType: 'string',

    width: '20%',
    isSearchDisabled: true,
  },
];

export const chips = filtersChips.map((item) => ({ ...item }));

export const title = 'Sentiment';
