import {
  Cols,
  Filter,
  Status as StatusType,
} from '@hospitality-bot/admin/shared';
import {
  RoomRecordsCount,
  RoomTypeRecordsCount,
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
      type: 'warning',
    },
    {
      label: 'Sold Out',
      value: 'soldOut',
      total: 0,
      isSelected: false,
      type: 'failed',
    },
  ],
};

export const roomTypeFilter: Filter<TableValue, keyof RoomTypeRecordsCount> = {
  label: 'Room Type',
  value: TableValue.roomType,
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
      label: 'Inactive ',
      value: 'inactive',
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
      header: 'Room / Type',
      isSort: true,
      sortType: 'string',
      dynamicWidth: true,
      width: '15%',
    },
    {
      field: 'roomNo',
      header: 'Room No.',
      isSort: true,
      sortType: 'string',
      dynamicWidth: true,
      width: '15%',
    },
    {
      field: 'date',
      header: 'Date',
      isSort: true,
      sortType: 'date',
      dynamicWidth: true,
      width: '28%',
    },
    {
      field: 'price',
      header: 'Price',
      isSort: true,
      sortType: 'number',
      dynamicWidth: true,
      width: '18%',
    },
    {
      field: 'status.value',
      header: 'Action / Status',
      isSort: true,
      sortType: 'string',
      dynamicWidth: true,
      width: '18%',
    },
  ],
  [TableValue.roomType]: [
    {
      field: 'name',
      header: 'Type',
      isSort: true,
      sortType: 'string',
      dynamicWidth: true,
      width: '14%',
    },
    {
      field: 'area',
      header: 'Area',
      isSort: true,
      sortType: 'number',
      dynamicWidth: true,
      width: '13%',
    },
    {
      field: 'roomCount',
      header: 'Room Count',
      isSort: true,
      sortType: 'string',
      dynamicWidth: true,
      width: '17%',
    },
    {
      field: 'amenities',
      header: 'Amenities',
      isSort: true,
      sortType: 'string',
      dynamicWidth: true,
      width: '18%',
    },
    {
      field: 'occupancy',
      header: 'Occupancy',
      isSort: true,
      sortType: 'number',
      dynamicWidth: true,
      width: '17%',
    },
    {
      field: 'status.value',
      header: 'Active',
      isSort: true,
      sortType: 'string',
      dynamicWidth: true,
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
