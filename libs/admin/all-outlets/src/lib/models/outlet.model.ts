import { MenuItemResponse } from '../types/menu';
import { MenuListResponse, MenuResponse } from '../types/outlet';

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
  entityStateCounts;
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
  itemName: string;
  type: string;
  hsnCode: string;
  category: string;
  kitchenDept: string;
  delivery: string;
  preparationTime: string;
  unit: number;

  deserialize(input: MenuItemResponse) {
    this.code = input.code;
    this.itemName = input.itemName;
    this.type = input.type;
    this.hsnCode = input.hsnCode;
    this.category = input.category;
    this.kitchenDept = input.kitchenDept;
    this.delivery = input.delivery;
    this.preparationTime = input.preparationTime;
    return this;
  }
}

export class Outlet {}
