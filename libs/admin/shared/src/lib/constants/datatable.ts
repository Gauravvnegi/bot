import {
  Cols,
  EntityStateRecord,
  Filter,
  QuickReplyFilterConfig,
} from '../types/table.type';

export const quickReplyFilterDefaultConfig: QuickReplyFilterConfig = {
  key: 'status',
  isAllAType: false,
  isStatusBoolean: false,
  activeStateKey: 'ACTIVE',
};

export const defaultFilterChipValue = { label: 'All', value: 'ALL' } as const;
export const defaultRecordJson: EntityStateRecord<
  'ACTIVE' | 'INACTIVE' | typeof defaultFilterChipValue['value']
> = {
  ACTIVE: {
    label: 'Active',
    type: 'active',
  },
  INACTIVE: {
    label: 'Inactive',
    type: 'inactive',
  },
  ALL: {
    label: defaultFilterChipValue.label,
    type: 'default',
  },
};

export type TableValue = 'users' | 'hotels';
export const columns: Record<TableValue, Cols[]> = {
  users: [
    {
      field: 'name',
      header: 'Username',
      sortType: 'string',

      width: '15%',
    },
    {
      field: 'date',
      header: 'Date Registered',
      sortType: 'string',

      width: '15%',
    },
    {
      field: 'role',
      header: 'Role',
      sortType: 'string',

      width: '15%',
    },
    {
      field: 'status',
      header: 'Status',
      sortType: 'string',

      width: '15%',
    },
    {
      field: 'action',
      header: 'Actions',
      sortType: 'string',

      width: '15%',
    },
  ],
  hotels: [],
};

export const filters: Filter<TableValue, string>[] = [
  {
    label: 'User',
    value: 'users',
    content: '',
    disabled: false,
    total: 0,
    chips: [
      {
        label: 'All',
        value: 'all',
        total: 0,
        isSelected: true,
        type: 'default',
      },
      {
        label: 'New',
        value: 'new',
        total: 0,
        isSelected: false,
        type: 'active',
      },
      {
        label: 'Pending ',
        value: 'draft',
        total: 0,
        isSelected: false,
        type: 'draft',
      },
      {
        label: 'Failed',
        value: 'failed',
        total: 0,
        isSelected: false,
        type: 'failed',
      },
      {
        label: 'Completed ',
        value: 'completed',
        total: 0,
        isSelected: false,
        type: 'completed',
      },
      {
        label: 'Warning ',
        value: 'warning',
        total: 0,
        isSelected: false,
        type: 'warning',
      },
      {
        label: 'Initiated ',
        value: 'initiated',
        total: 0,
        isSelected: false,
        type: 'active',
      },
    ],
  },

  {
    label: 'Hotels',
    value: 'hotels',
    content: '',
    disabled: false,
    total: 0,
    chips: [
      {
        label: 'All',
        value: 'total',
        total: 0,
        isSelected: true,
        type: 'default',
      },
      {
        label: 'Active',
        value: 'active',
        total: 0,
        isSelected: false,
        type: 'active',
      },
      {
        label: 'Unavailable ',
        value: 'unavailable',
        total: 0,
        isSelected: false,
        type: 'draft',
      },
      {
        label: 'Sold Out',
        value: 'soldOut',
        total: 0,
        isSelected: false,
        type: 'failed',
      },
    ],
  },
];

export const rowValues: Record<TableValue, Record<string, any>[]> = {
  users: ['Tony', 'Bruce', 'Steve', 'Natasha', 'Tchala', 'Peter', 'Steven'].map(
    (item) => ({
      name: item,
      date: new Date(
        +new Date() - Math.floor(Math.random() * 10000000000)
      ).toUTCString(),
      role: Math.floor(Math.random()) > 5 ? 'Admin' : 'Member',
      status: Math.floor(Math.random()) > 5 ? 'Active' : 'Inactive',
      action:
        Math.floor(Math.random()) > 5
          ? 'ACTIVE'
          : Math.floor(Math.random())
          ? 'UNAVAILABLE'
          : 'SOLD_OUT',
    })
  ),
  hotels: [{}],
};

export const status = [
  {
    label: 'Active',
    value: 'ACTIVE',
    type: 'new',
  },
  {
    label: 'Unavailable',
    value: 'UNAVAILABLE',
    type: 'warning',
  },
  {
    label: 'Sold Out',
    value: 'SOLD_OUT',
    type: 'failed',
    disabled: true,
  },
];
