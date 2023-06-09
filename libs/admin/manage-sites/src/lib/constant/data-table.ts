import { Chip, Cols, Status } from '@hospitality-bot/admin/shared';
import { ManageSiteStatus } from './manage-site';

export const status = [
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
    label: 'Trash',
    value: ManageSiteStatus.TRASH,
    type: 'failed',
  },
  {
    label: 'Delete',
    value: ManageSiteStatus.DELETE,
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
    type: 'active',
  },
  {
    label: 'Draft',
    value: ManageSiteStatus.DRAFT,
    total: 0,
    isSelected: false,
    type: 'warning',
  },
  {
    label: 'Trash',
    value: ManageSiteStatus.TRASH,
    total: 0,
    isSelected: false,
    type: 'failed',
  },
];

export const cols: Cols[] = [
  {
    field: 'thumbnail',
    header: 'Thumbnail',
    isSortDisabled: true,
    sortType: 'string',
    isSearchDisabled: true,
    width: '15%',
  },
  {
    field: 'siteName',
    header: 'Hotel site name',
    sortType: 'string',
    width: '18%',
  },
  {
    field: 'url',
    header: 'URL',
    sortType: 'string',
    width: '32%',
  },
  // {
  //   field: 'expiry',
  //   header: 'Expiry',
  //   sortType: 'number',
  //   width: '15%',
  //   isSearchDisabled: true,
  // },
  {
    field: 'status',
    header: 'Actions',
    sortType: 'string',
    width: '20%',
  },
];
