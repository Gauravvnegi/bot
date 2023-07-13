import { EntityState } from '@hospitality-bot/admin/shared';
import {
  MenuItemListResponse,
  MenuItemResponse,
  MenuListResponse,
  MenuResponse,
} from '../types/outlet';

export class OutletList {
  id: string;
  outletName: string;
  type: string;
  totalSales: string;
  area: string;
  status: string;

  deserialize(input) {
    this.id = input.id;
    this.outletName = input.outletName;
    this.type = input.outletName;
    this.area = input.area;
    this.status = input.status;
    return this;
  }
}

export class MenuList {
  total: number;
  entityStateCounts: EntityState<string>;
  records: Menu[];

  deserialize(input: MenuListResponse) {
    this.total = input.total;
    this.entityStateCounts = input.entityStateCounts;
    this.records = input.records.map((item) => new Menu().deserialize(item));
    return this;
  }
}

class Menu {
  id: string;
  name: string;
  imageUrl: string;
  description: string;
  status: boolean;
  entityId: string;

  deserialize(input: MenuResponse) {
    this.id = input.id;
    this.name = input.name;
    this.imageUrl = input.imageUrl;
    this.description = input.description;
    this.status = input.status;
    this.entityId = input.entityId;
    return this;
  }
}

export class Records {}

export class MenuItem {
  code: string;
  name: string;
  description: string;
  type: string;
  hsnCode: string;
  category: string;
  deliveryPrice: number;
  kitchenDept: string;
  dineInPrice: number;
  preparationTime: number;
  unit: string;
  status: boolean;
  quantity: number;
  id: string;

  deserialize(input: MenuItemResponse) {
    this.code = input.code;
    this.name = input.name;
    this.description = input.description;
    this.type = input.type;
    this.hsnCode = input.hsnCode;
    this.category = input.category;
    this.dineInPrice = input.dineInPrice;
    this.deliveryPrice = input.deliveryPrice;
    this.preparationTime = input.preparationTime;
    this.unit = input.unit;
    this.status = input.status;
    this.quantity = input.quantity;
    this.id = input.id;
    return this;
  }
}

export class MenuItemList {
  records: MenuItem[];
  total: number;
  entityStateCounts: EntityState<string>;
  entityTypeCounts: EntityState<string>;

  deserialize(input: MenuItemListResponse) {
    this.records = input.records?.map((item) =>
      new MenuItem().deserialize(item)
    );
    this.entityStateCounts = input?.entityStateCounts ?? {};
    this.entityTypeCounts = input?.entityTypeCounts ?? {};
    this.total = input?.total ?? 0;
    return this;
  }
}
