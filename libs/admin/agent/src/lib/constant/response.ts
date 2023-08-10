import { MemberSortTypes, SortingOrder } from '../types/agent';

export const SortBy: Record<MemberSortTypes, SortingOrder> = {
  'A-Z': {
    sort: 'firstName',
    order: 'ASC',
  },

  'Z-A': {
    sort: 'firstName',
    order: 'DESC',
  },
  Latest: {
    sort: 'created',
    order: 'DESC',
  },
  Modified: {
    sort: 'updated',
    order: 'DESC',
  },
  Oldest: {
    sort: 'created',
    order: 'ASC',
  },
};

export const SortFilterList = Object.keys(SortBy).map((key) => key);
