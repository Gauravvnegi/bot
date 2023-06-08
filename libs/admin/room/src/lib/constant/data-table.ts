import {
  Cols,
  Filter
} from '@hospitality-bot/admin/shared';
import {
  RoomRecordsCount,
  RoomTypeRecordCounts
} from '../models/rooms-data-table.model';

export enum TableValue {
  room = 'ROOM',
  roomType = 'ROOM_TYPE',
}

export const roomFilter: Filter<TableValue, keyof RoomRecordsCount> = {
  label: 'Room',
  value: TableValue.room,
  content: '',
  disabled: false,
  total: 0,
  chips: [
    {
      label: 'All',
      value: 'ALL',
      total: 0,
      isSelected: true,
      type: 'default',
    },
    {
      label: 'Clean',
      value: 'CLEAN',
      total: 0,
      isSelected: false,
      type: 'new',
    },
    {
      label: 'Unavailable ',
      value: 'UNAVAILABLE',
      total: 0,
      isSelected: false,
      type: 'warning',
    },
    {
      label: 'Out of order',
      value: 'OUT_OF_ORDER',
      total: 0,
      isSelected: false,
      type: 'failed',
    },
    {
      label: 'Out of service',
      value: 'OUT_OF_SERVICE',
      total: 0,
      isSelected: false,
      type: 'failed',
    },
  ],
};

export const roomTypeFilter: Filter<TableValue, keyof RoomTypeRecordCounts> = {
  label: 'Room Type',
  value: TableValue.roomType,
  content: '',
  disabled: false,
  total: 0,
  chips: [
    {
      label: 'All',
      value: 'ALL',
      total: 0,
      isSelected: true,
      type: 'default',
    },
    {
      label: 'Active',
      value: 'ACTIVE',
      total: 0,
      isSelected: false,
      type: 'new',
    },
    {
      label: 'Inactive ',
      value: 'UNAVAILABLE',
      total: 0,
      isSelected: false,
      type: 'failed',
    },
  ],
};

export const filter: Filter<TableValue, string>[] = [
  roomFilter,
  roomTypeFilter,
];

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
    {
      field: 'price',
      header: 'Price',
      sortType: 'number',
      width: '23%',
    },
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
      width: '14%',
    },
    {
      field: 'area',
      header: 'Area',
      sortType: 'number',
      width: '13%',
    },
    {
      field: 'roomCount',
      header: 'Room Count',
      sortType: 'string',
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
  },
  {
    field: 'floor',
    header: 'Floor',
    sortType: 'number',
  },
  {
    field: 'roomStatus',
    header: 'Room Status',
    sortType: 'string',
  },
  {
    field: 'foStatus',
    header: 'FO Status',
    sortType: 'string',
  },
  {
    field: 'action',
    header: 'Action',
    isSearchDisabled: true,
  },
];

export const title: Record<TableValue, string> = {
  [TableValue.room]: 'Room',
  [TableValue.roomType]: 'Room Type',
};
