import {
  Cols,
  Filter,
  Status as StatusType,
} from '@hospitality-bot/admin/shared';
import {
  RoomRecordsCount,
  RoomStateCounts,
} from '../models/rooms-data-table.model';

export enum Status {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
  SOLD_OUT = 'Sold Out',
  UNAVAILABLE = 'Unavailable',
}

export enum StatusEntity {
  active = 'ACTIVE',
  inactive = 'INACTIVE',
  soldOut = 'SOLD_OUT',
  unavailable = 'UNAVAILABLE',
}

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
      label: 'Active',
      value: 'ACTIVE',
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
      label: 'Sold Out',
      value: 'SOLD_OUT',
      total: 0,
      isSelected: false,
      type: 'failed',
    },
  ],
};

export const roomTypeFilter: Filter<TableValue, keyof RoomStateCounts> = {
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
      value: 'INACTIVE',
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

export const title: Record<TableValue, string> = {
  [TableValue.room]: 'Room',
  [TableValue.roomType]: 'Room Type',
};

export const status: Record<TableValue, StatusType[]> = {
  [TableValue.room]: [
    {
      label: Status.ACTIVE,
      value: 'ACTIVE',
      type: 'new',
    },
    {
      label: Status.UNAVAILABLE,
      value: 'UNAVAILABLE',
      type: 'warning',
    },
    {
      label: Status.SOLD_OUT,
      value: 'SOLD_OUT',
      type: 'failed',
      disabled: true,
    },
  ],
  [TableValue.roomType]: [
    {
      label: Status.ACTIVE,
      value: 'ACTIVE',
      type: 'new',
    },
    {
      label: Status.INACTIVE,
      value: 'INACTIVE',
      type: 'failed',
    },
  ],
};
