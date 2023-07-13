import { EntityState } from '@hospitality-bot/admin/shared';

export type OutletForm = {
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
  cuisinesType?: string;
  minimumOccupancy: number;
  maximumOccupancy: number;
  dayOfOperationStart: string;
  dayOfOperationEnd: string;
  timeDayStart: string;
  timeDayEnd: string;
  area: string;
  dimension: string;
  rules: Rules;
  paidServiceIds?;
  menuIds?;
  foodPackageIds?;
};

type OutletItems = {
  paidAmenities?;
  complimentaryAmenities?;
  MenuList?;
};

export type OutletFormData = OutletForm & OutletItems;

type Rules = {
  title: string;
  description: string;
};

type Address = {
  country: string;
  state: string;
  pinCode: string;
  city: string;
} & Record<string, any>;

export type MenuListResponse = {
  total: number;
  entityStateCounts: EntityStateCounts;
  records: MenuResponse[];
};

export type MenuResponse = {
  id: string;
  name: string;
  imageUrl: string;
  description: string;
  status: boolean;
  entityId: string;
};

export type Menu = {
  id: string;
  name: string;
  imageUrl: string;
  description: string;
  status: boolean;
  entityId: string;
};

type EntityStateCounts = {
  ACTIVE: number;
  INACTIVE: number;
};

export type RestaurantForm = Omit<OutletForm, 'minimumOccupancy'>;

export type SpaForm = Omit<
  OutletForm,
  'minimumOccupancy' | 'maximumOccupancy' | 'cuisinesType'
>;

export type VenueForm = Omit<OutletForm, 'cuisinesType'>;

export type MenuItemForm = {
  name: string;
  description: string;
  mealPreference: string;
  category: string;
  type: string;
  preparationTime: number;
  quantity: number;
  unit: string;
  dineInPrice: number;
  dineInPriceCurrency: string;
  deliveryPrice: number;
  deliveryPriceCurrency: string;
  hsnCode: string;
  taxes: TaxData[];
  status: boolean;
};

export type MenuItemResponse = MenuItemForm & {
  id: string;
  code?: string;
};

export type MenuItemListResponse = {
  records: MenuItemResponse[];
  total: number;
  entityStateCounts: EntityState<string>;
  entityTypeCounts: EntityState<string>;
};

export type FoodPackageForm = {
  active: boolean;
  name: string;
  category: string;
  imageUrl: string;
  currency: string;
  rate: number;
  discountType: string;
  discountValue: string;
  discountedPrice: number;
  enableVisibility: string[];
  type: string;
  source: number;
};

export type Feature =
  | 'service'
  | 'menu'
  | 'import-services'
  | 'food-package'
  | 'brand'
  | 'hotel'
  | 'view-all';

export type OutletType = 'RESTAURANT' | 'SPA' | 'VENUE';

export type TaxData = {
  category: string;
  country: string;
  created: number;
  id: string;
  status: boolean;
  taxType: string;
  taxValue: number;
  updated: number;
};
