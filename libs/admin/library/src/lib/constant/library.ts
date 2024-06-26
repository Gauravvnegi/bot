import { Chip } from '@hospitality-bot/admin/shared';

/**
 * Library item type value
 */
export enum LibraryItem {
  service = 'SERVICE',
  package = 'PACKAGE',
  offer = 'OFFER',
}

export enum LibrarySearchItem {
  PACKAGE_CATEGORY = 'PACKAGE_CATEGORY',
  SERVICE_CATEGORY = 'SERVICE_CATEGORY',
  ROOM_TYPE = 'ROOM_TYPE',
  SERVICE = 'SERVICE',
  PACKAGE = 'PACKAGE',
  MENU_ITEM = 'MENU_ITEM',
}

export enum ServiceTypeOptionValue {
  PAID = 'Paid',
  COMPLIMENTARY = 'Complimentary',
}

export const filtersChips: Chip<'ALL' | 'ACTIVE' | 'INACTIVE'>[] = [
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
    type: 'active',
  },
  {
    label: 'Inactive ',
    value: 'INACTIVE',
    total: 0,
    isSelected: false,
    type: 'failed',
  },
];
