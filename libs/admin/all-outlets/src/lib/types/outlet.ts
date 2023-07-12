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
};
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
  taxIds: string[];
  status: boolean;
};

export type MenuItemResponse = MenuItemForm & {
  id: string;
  kitchenDept?: string;
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
  | 'hotel';
