import { EntityState } from '@hospitality-bot/admin/shared';
import {
  MenuItemListResponse,
  MenuItemResponse,
  MenuListResponse,
  MenuResponse,
  OutletForm,
} from '../types/outlet';
import {
  FoodPackageListResponse,
  FoodPackageResponse,
} from '../types/response';
import { MealPreferences } from 'libs/admin/outlets-dashboard/src/lib/types/menu-order';

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
  label?: string;
  value?: string;

  deserialize(input: MenuResponse) {
    this.id = input.id;
    this.name = input.name;
    this.imageUrl = input.imageUrl;
    this.description = input.description;
    this.status = input.status;
    this.entityId = input.entityId;
    this.value = input?.id;
    this.label = input?.name;
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
  mealPreference: MealPreferences;
  imageUrl: string;

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
    this.mealPreference = input?.mealPreference
      .replace(/[-_]/g, '')
      .toUpperCase() as MealPreferences;
    this.imageUrl = input?.imageUrl;
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

export class FoodPackageList {
  records: FoodPackage[];
  total: number;
  entityStateCounts;
  entityTypeCounts;

  deserialize(input: FoodPackageListResponse) {
    this.records = input.foodPackages.map((item) =>
      new FoodPackage().deserialize(item)
    );
    this.entityStateCounts = input?.entityStateCounts ?? {};
    this.entityTypeCounts = input?.entityTypeCounts ?? {};
    this.total = input?.total ?? 0;
    return this;
  }
}

export class FoodPackage {
  id: string;
  name: string;
  imageUrl: string;
  status: boolean;
  rate: number;
  startDate: number;
  endDate: number;
  currency: string;
  packageCode: string;
  source: string;
  hotelId: string;
  category: string;
  autoAccept: boolean;
  hasChild: boolean;
  discountedPrice: number;

  deserialize(input: FoodPackageResponse) {
    this.id = input?.id;
    this.name = input?.name;
    this.imageUrl = input?.images[0]?.url;
    this.status = input?.active;
    this.rate = input?.rate;
    this.startDate = input?.startDate;
    this.endDate = input?.endDate;
    this.currency = input?.currency;
    this.packageCode = input?.packageCode;
    this.source = input?.source;
    this.hotelId = input?.hotelId;
    this.category = input?.category;
    this.autoAccept = input?.autoAccept;
    this.hasChild = input?.hasChild;
    this.discountedPrice = input?.discountedPrice;
    return this;
  }
}

export class OutletFormData {
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
  subType: string;
  cuisinesType?: string;
  minimumOccupancy: number;
  maximumOccupancy: number;
  operationalDays;
  area: string;
  dimension: string;
  rules;
  paidServiceIds?;
  menuIds?;
  foodPackageIds?;
  shortDescription: string;

  deserialize(input: OutletForm) {
    this.status = input?.status;
    this.name = input?.name;
    this.emailId = input?.emailId;
    this.contact = input?.contact;
    this.address = input?.address;
    this.imageUrl = input?.imageUrl;
    this.description = input?.description;
    this.serviceIds = input?.serviceIds;
    this.socialPlatforms = input?.socialPlatforms;
    this.type = input?.type;
    this.subType = input?.subType;
    this.cuisinesType = input?.cuisinesType;
    this.minimumOccupancy = input?.minimumOccupancy;
    this.maximumOccupancy = input?.maximumOccupancy;
    this.operationalDays = {
      startDay: input?.startDay,
      endDay: input?.endDay,
      from: input?.from,
      to: input?.to,
    };
    this.area = input?.area;
    this.dimension = input?.dimension;
    this.rules = input?.rules;
    this.paidServiceIds = input?.paidServiceIds;
    this.menuIds = input?.menuIds;
    this.foodPackageIds = input?.foodPackageIds;
    this.shortDescription = input?.shortDescription;
    return this;
  }
}
