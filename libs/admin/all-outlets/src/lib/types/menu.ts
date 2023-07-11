export type MenuItemResponse = {
  code: string;
  itemName: string;
  type: string;
  hsnCode: string;
  category: string;
  kitchenDept: string;
  delivery: string;
  preparationTime: string;
  unit: number;
};

export type MenuFormData = {
  name: string;
  imageUrl: string;
  description: string;
  status: boolean;
}

export type MenuResponse = MenuFormData & {
  id: string;
  entityId: string;
}
