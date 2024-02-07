import { EntityState } from '@hospitality-bot/admin/shared';
import {
  CategoryListResponse,
  CategoryResponse,
} from '../types/service-items-category-datable.type';

export class CategoryList {
  entityStateCounts: EntityState<string>;
  records: CategoryItem[];
  total: number;

  deserialize(value: CategoryListResponse) {
    this.entityStateCounts = value?.entityStateCounts;
    this.total = value?.total;
    this.records = value?.records.map((item) => {
      return new CategoryItem().deserialize(item);
    });
    return this;
  }
}

export class CategoryItem {
  id: string;
  name: string;
  serviceItems?: string;
  status: boolean;

  deserialize(value: CategoryResponse): CategoryItem {
    this.id = value?.id || '';
    this.name = value?.name || '';
    this.status = !!value?.active;

    if (value?.serviceItems) {
      const firstThreeItems = value.serviceItems
        .slice(0, 3)
        .map((item) => item?.itemName)
        .join(', ');

      this.serviceItems = `${firstThreeItems}${
        value.serviceItems.length > 3
          ? `, +${value.serviceItems.length - 3}`
          : ''
      }`;
    } else {
      this.serviceItems = '';
    }

    return this;
  }
}
