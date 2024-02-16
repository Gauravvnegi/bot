import { PackageResponse } from 'libs/admin/packages/src/lib/types/response';
import { RoomTypeResponse } from 'libs/admin/room/src/lib/types/service-response';
import { ServiceResponse } from 'libs/admin/services/src/lib/types/response';
import { LibrarySearchItem } from '../constant/library';

export type EntityStateCountsResponse = {
  All: number;
  Active: number;
  Inactive: number;
};

export type CategoryResponse = {
  id: string;
  name: string;
  description: string;
  active: boolean;
  packageCode: string;
  imageUrl: string;
  entityId: string;
  hasChild: boolean;
  subPackages: any[];
};

export type MenuItemsResponse = {
  category: string;
  deliveryPrice: number;
  description: string;
  dineInPrice: number;
  entityId: string;
  hsnCode: string;
  id: string;
  mealPreference: string;
  name: string;
  preparationTime: number;
  quantity: number;
  status: boolean;
  type: string;
  unit: string;
  code?: string;
  imageUrl?: string;
  popular?: boolean;
};

export type CategoriesResponse = {
  total: number;
  records: CategoryResponse[];
};

export type SearchResultResponse = {
  [LibrarySearchItem.SERVICE]?: ServiceResponse[];
  [LibrarySearchItem.PACKAGE]?: PackageResponse[];
  [LibrarySearchItem.ROOM_TYPE]?: RoomTypeResponse[];
  [LibrarySearchItem.SERVICE_CATEGORY]?: CategoryResponse[];
  [LibrarySearchItem.PACKAGE_CATEGORY]?: CategoryResponse[];
  [LibrarySearchItem.MENU_ITEM]?: MenuItemsResponse[];
};
