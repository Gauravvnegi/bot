import { Cols } from '@hospitality-bot/admin/shared';

export enum TableValue {
  room = 'ROOM',
  roomType = 'ROOM_TYPE',
}

export const cols: Record<TableValue, Cols[]> = {
  [TableValue.room]: [
    {
      field: 'type',
      header: 'Room No / Type',
      sortType: 'string',
      searchField: ['type', 'roomNo'],
      width: '23%',
    },
    {
      field: 'date',
      header: 'Date',
      sortType: 'date',
      isSearchDisabled: true,
    },
    {
      field: 'foStatus',
      header: 'Housekeeping Status',
      sortType: 'string',
      isSearchDisabled: true,
    },
    // {
    //   field: 'price',
    //   header: 'Price',
    //   sortType: 'number',
    //   width: '23%',
    // },
    {
      field: 'status',
      header: 'Action / Status',
      sortType: 'string',
      isSearchDisabled: true,
      width: '16%',
    },
  ],
  [TableValue.roomType]: [
    {
      field: 'name',
      header: 'Type',
      sortType: 'string',
      width: '20%',
    },
    {
      field: 'area',
      header: 'Area',
      sortType: 'number',
      width: '16%',
    },
    {
      field: 'roomCount',
      header: 'Room Count',
      sortType: 'number',
      width: '17%',
    },
    {
      field: 'amenities',
      header: 'Services',
      sortType: 'array',
      width: '18%',
    },
    {
      field: 'occupancy',
      header: 'Occupancy',
      sortType: 'number',
      width: '17%',
    },
    {
      field: 'status',
      header: 'Action',
      sortType: 'string',
      width: '16%',
      isSearchDisabled: true,
      isSortDisabled: true,
    },
  ],
};

export const roomDetailsCols: Cols[] = [
  {
    field: 'roomNumber',
    header: 'Room Number',
    sortType: 'number',
    width: '20%',
  },
  {
    field: 'floor',
    header: 'Floor',
    sortType: 'number',
    width: '20%',
  },
  {
    field: 'status',
    header: 'Room Status',
    sortType: 'string',
    width: '20%',
  },
  {
    field: 'foStatus',
    header: 'FO Status',
    sortType: 'string',
    width: '20%',
  },
  {
    field: 'action',
    header: 'Action',
    isSortDisabled: true,
    isSearchDisabled: true,
    width: '20%',
  },
];

export const title: Record<TableValue, string> = {
  [TableValue.room]: 'Room',
  [TableValue.roomType]: 'Room Type',
};
