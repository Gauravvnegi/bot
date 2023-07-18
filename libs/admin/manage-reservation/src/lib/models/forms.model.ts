import { EntityState } from '@hospitality-bot/admin/shared';
import { MenuItemListResponse, MenuItemResponse, ServiceListResponse, ServiceResponse } from '../types/response.type';

export class Service {
  id: string;
  name: string;
  code: string;
  source: string;
  type: string;
  amount: number;
  currency: string;
  category: string;
  status: boolean;
  unit: string;

  deserialize(input: ServiceResponse) {
    this.id = input.id;
    this.name = input.name;
    this.code = input.packageCode;
    this.source = input.source;
    this.type = input.type;
    this.amount = input.rate;
    this.currency = input.currency;
    this.category = input.categoryName;
    this.status = input.active;
    this.unit = input.unit;
    return this;
  }
}

export class ServiceList {
  allService: Service[];
  paidService: Service[];
  complimentaryService: Service[];
  total: number;
  entityStateCounts: EntityState<string>;
  entityTypeCounts: EntityState<string>;

  deserialize(input: ServiceListResponse) {
    this.allService =
      input.services?.map((item) => new Service().deserialize(item)) ?? [];

    this.paidService =
      input.paidPackages?.map((item) => new Service().deserialize(item)) ?? [];

    this.complimentaryService =
      input.complimentaryPackages?.map((item) =>
        new Service().deserialize(item)
      ) ?? [];

    this.total = input.total;
    this.entityStateCounts = input?.entityStateCounts;
    this.entityTypeCounts = input?.entityTypeCounts;
    return this;
  }
}

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
