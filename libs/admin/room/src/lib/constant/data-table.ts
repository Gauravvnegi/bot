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
    },
    {
      field: 'foStatus',
      header: 'Reservation Status',
      sortType: 'string',
    },
    // {
    //   field: 'price',
    //   header: 'Price',
    //   sortType: 'number',
    //   width: '23%',
    // },
    {
      field: 'status.value',
      header: 'Action / Status',
      sortType: 'string',
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
      isSearchDisabled: true,
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
      field: 'status.value',
      header: 'Active',
      sortType: 'string',
      width: '16%',
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
    field: 'roomStatus',
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
    isSearchDisabled: true,
    width: '20%',
  },
];

export const title: Record<TableValue, string> = {
  [TableValue.room]: 'Room',
  [TableValue.roomType]: 'Room Type',
};
