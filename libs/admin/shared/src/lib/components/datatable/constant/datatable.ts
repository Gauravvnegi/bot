import { Cols, Filter } from '../../../types/table.type';

export type TableValue = 'users' | 'hotels';
export const columns: Record<TableValue, Cols[]> = {
  users: [
    {
      field: 'name',
      header: 'Username',
      isSort: true,
      sortType: 'string',
      dynamicWidth: true,
      width: '15%',
    },
    {
      field: 'date',
      header: 'Date Registered',
      isSort: true,
      sortType: 'string',
      dynamicWidth: true,
      width: '15%',
    },
    {
      field: 'role',
      header: 'Role',
      isSort: true,
      sortType: 'string',
      dynamicWidth: true,
      width: '15%',
    },
    {
      field: 'status',
      header: 'Status',
      isSort: true,
      sortType: 'string',
      dynamicWidth: true,
      width: '15%',
    },
    {
      field: 'action',
      header: 'Actions',
      isSort: true,
      sortType: 'string',
      dynamicWidth: true,
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
        type: 'new',
      },
      {
        label: 'Unavailable ',
        value: 'unavailable',
        total: 0,
        isSelected: false,
        type: 'pending',
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
        type: 'new',
      },
      {
        label: 'Unavailable ',
        value: 'unavailable',
        total: 0,
        isSelected: false,
        type: 'pending',
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
          ? { label: 'Active', value: 'ACTIVE' }
          : { label: 'Inactive', value: 'INACTIVE' },
    })
  ),
  hotels: [{}],
};
