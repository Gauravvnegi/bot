interface MenuItem {
  id: string;
  name: string;
  description: string;
  popular: boolean;
  mealPreference: string;
  category: string;
  type: string;
  preparationTime: number;
  quantity: number;
  unit: string;
  dineInPrice: number;
  deliveryPrice: number;
  hsnCode: string;
  entityId: string;
  status: boolean;
}

export type PendingItemResponse = {
  unit: number;
  menuItem: MenuItem;
};

export type PendingItemListResponse = {
  total: number;
  records: PendingItemResponse[];
};
