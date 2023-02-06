import {
  Cols,
  Filter,
  Status as StatusType,
} from '@hospitality-bot/admin/shared';
import {
  RoomRecordsCount,
  RoomTypeRecordsCount,
} from '../models/rooms-data-table.model';
import { TableValue } from '../types/room';

export enum Status {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
  SOLD_OUT = 'Sold Out',
  UNAVAILABLE = 'Unavailable',
}

export const roomFilter: Filter<TableValue, keyof RoomRecordsCount> = {
  label: 'Room',
  value: 'room',
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
};

export const roomTypeFilter: Filter<TableValue, keyof RoomTypeRecordsCount> = {
  label: 'Room Type',
  value: 'roomType',
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
      type: 'pending',
    },
  ],
};

export const filter: Filter<TableValue, string>[] = [
  roomFilter,
  roomTypeFilter,
];

export const cols: Record<TableValue, Cols[]> = {
  room: [
    {
      field: 'roomType',
      header: 'Room / Type',
      isSort: true,
      sortType: 'string',
      dynamicWidth: true,
      width: '20%',
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
      sortType: 'string',
      dynamicWidth: true,
      width: '30%',
    },
    {
      field: 'price',
      header: 'Price',
      isSort: true,
      sortType: 'string',
      dynamicWidth: true,
      width: '15%',
    },
    {
      field: 'status',
      header: 'Action / Status',
      isSort: true,
      sortType: 'string',
      dynamicWidth: true,
      width: '15%',
    },
  ],
  roomType: [
    {
      field: 'type',
      header: 'Type',
      isSort: true,
      sortType: 'string',
      dynamicWidth: true,
      width: '15%',
    },
    {
      field: 'area',
      header: 'Area',
      isSort: true,
      sortType: 'string',
      dynamicWidth: true,
      width: '15%',
    },
    {
      field: 'roomCount',
      header: 'Room Count',
      isSort: true,
      sortType: 'string',
      dynamicWidth: true,
      width: '15%',
    },
    {
      field: 'amenities',
      header: 'Amenities',
      isSort: true,
      sortType: 'string',
      dynamicWidth: true,
      width: '20%',
    },
    {
      field: 'occupancy',
      header: 'Occupancy',
      isSort: true,
      sortType: 'string',
      dynamicWidth: true,
      width: '15%',
    },
    {
      field: 'active',
      header: 'Active',
      isSort: true,
      sortType: 'string',
      dynamicWidth: true,
      width: '15%',
    },
  ],
};

export const title: Record<TableValue, string> = {
  room: 'Room',
  roomType: 'Room Type',
};

export const status: Record<TableValue, StatusType[]> = {
  room: [
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
    },
  ],
  roomType: [
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
