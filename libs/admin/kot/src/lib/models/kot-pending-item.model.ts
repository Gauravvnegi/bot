import {
  PendingItemListResponse,
  PendingItemResponse,
} from '../types/pending-item.summary.type';

export class PendingItemSummaryList {
  total: string;
  records: PendingItem[];
  deserialize(value: PendingItemListResponse) {
    this.records = value?.records.map((res) =>
      new PendingItem().deserialize(res)
    );

    return this;
  }
}

export class PendingItem {
  name: string;
  quantity: number;
  mealPreference: string;

  deserialize(value: PendingItemResponse) {
    this.name = value?.menuItem?.name;
    this.quantity = value?.unit;
    this.mealPreference = value?.menuItem?.mealPreference;

    return this;
  }
}
