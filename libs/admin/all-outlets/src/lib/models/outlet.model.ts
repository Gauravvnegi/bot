import { MenuItemResponse } from '../types/menu';
import { OutletResponse } from '../types/response';

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
