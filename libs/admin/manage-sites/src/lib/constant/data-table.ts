import { Chip, Cols, Status } from '@hospitality-bot/admin/shared';
import { ManageSiteStatus } from './manage-site';

export const status: Status[] = [
  {
    label: 'Draft',
    value: ManageSiteStatus.DRAFT,
    type: 'warning',
  },
  {
    label: 'Published',
    value: ManageSiteStatus.PUBLISHED,
    type: 'new',
  },
  {
    label: 'Inactive',
    value: ManageSiteStatus.INACTIVE,
    type: 'failed',
  },
];

export const chips: Chip<ManageSiteStatus | 'ALL'>[] = [
  {
    label: 'All',
    value: 'ALL',
    total: 0,
    isSelected: true,
    type: 'default',
  },
  {
    label: 'Published',
    value: ManageSiteStatus.PUBLISHED,
    total: 0,
    isSelected: false,
    type: 'new',
  },
  {
    label: 'Draft',
    value: ManageSiteStatus.DRAFT,
    total: 0,
    isSelected: false,
    type: 'warning',
  },
  {
    label: 'Inactive',
    value: ManageSiteStatus.INACTIVE,
    total: 0,
    isSelected: false,
    type: 'failed',
  },
];

export const cols: Cols[] = [
  {
    field: 'thumbnail',
    header: 'Thumbnail',
    isSort: false,
    sortType: 'string',
    dynamicWidth: true,
    isSearchDisabled: true,

    width: '15%',
  },
  {
    field: 'siteName',
    header: 'Hotel site name',
    isSort: true,
    sortType: 'string',
    dynamicWidth: true,
    width: '18%',
  },
  {
    field: 'url',
    header: 'URL',
    isSort: true,
    sortType: 'string',
    dynamicWidth: true,
    width: '32%',
  },
  {
    field: 'expiry',
    header: 'Expiry',
    isSort: true,
    sortType: 'number',
    dynamicWidth: true,
    width: '15%',
    isSearchDisabled: true,
  },
  {
    field: 'status',
    header: 'Actions',
    isSort: true,
    sortType: 'string',
    dynamicWidth: true,
    width: '20%',
  },
];
