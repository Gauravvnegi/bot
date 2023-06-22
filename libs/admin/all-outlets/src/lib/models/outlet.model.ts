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

export class Outlets {
  id: string;
  status: string;
  name: string;
  emailId: string;
  contact;
  address;
  imageUrl;
  description: string;
  serviceIds: string[];
  socialPlatforms;
  type: string;
  subtype: string;
  cuisinesType: string;
  minimumOccupancy: number;
  maximumOccupancy: number;
  dayOfOperationStart: string;
  dayOfOperationEnd: string;
  timeDayStart: string;
  timeDayEnd: string;
  area: string;
  areaUnit: string;
  rules;

  deserialize(input: OutletResponse) {
    this.id = input.id;
    this.status = input.status;
    this.name = input.name;
    this.emailId = input.emailId;
    this.contact = input.contact;
    this.address = input.address;
    this.imageUrl = input.imageUrl;
    this.description = input.description;
    this.serviceIds = input.serviceIds;
    this.socialPlatforms = input.socialPlatforms;
    this.type = input.type;
    this.subtype = input.subtype;
    this.cuisinesType = input.cuisinesType;
    this.minimumOccupancy = input.minimumOccupancy;
    this.maximumOccupancy = input.maximumOccupancy;
    this.dayOfOperationStart = input.dayOfOperationStart;
    this.dayOfOperationEnd = input.dayOfOperationEnd;
    this.timeDayStart = input.timeDayStart;
    this.timeDayEnd = input.timeDayEnd;
    this.area = input.area;
    this.areaUnit = input.areaUnit;
    this.rules = input.rules;
    return this;
  }
}
