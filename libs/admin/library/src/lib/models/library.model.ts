import {
  CategoriesResponse,
  CategoryResponse,
  EntityStateCountsResponse,
} from '../types/response';

export class EntityStateCounts {
  ALL: number;
  INACTIVE: number;
  ACTIVE: number;
  deserialize(input: EntityStateCountsResponse) {
    this.ALL = input.All;
    this.ACTIVE = input.Active;
    this.INACTIVE = input.Inactive;
    return this;
  }
}

export class Categories {
  records: Category[];
  total: number;
  deserialize(input: CategoriesResponse) {
    this.records = input.records.map((item) =>
      new Category().deserialize(item)
    );
    this.total = input.total;
    return this;
  }
}

export class Category {
  label: string;
  value: string;
  description: string;
  deserialize(input: CategoryResponse) {
    this.label = input.name ?? '';
    this.value = input.id ?? '';
    this.description = input.description ?? '';
    return this;
  }
}
