import { EntityTypeCounts } from '@hospitality-bot/admin/library';
import { EntityState, EntityType } from '@hospitality-bot/admin/shared';

export type OutletResponse = {
  id: string;
  category: string;
  name: string;
  imageUrl: Image[];
  logo: string;
  address: Address;
  timezone: string;
  redirectionParameter: {};
  socialPlatforms: any[];
  showAddress: boolean;
  contact: Contact;
  description: string;
  emailId: string;
  status: string;
  maximumOccupancy: number;
  startDay: string;
  endDay: string;
  from: string;
  to: string;
  area: string;
  dimension: string;
  type: string;
  subType: string;
  parentId: string;
  absoluteRoute: string;
  operationalDays;
};

type Image = {
  url: string;
  isFeatured: boolean;
};

export type Contact = {
  countryCode: string;
  phoneNumber: string;
};

export type Address = {
  id: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  pincode: number;
  formattedAddress: string;
  state: string;
  postalCode: string;
} & Record<string, any>;

export type FoodPackageListResponse = {
  foodPackages: FoodPackageResponse[];
  total: number;
  entityStateCounts: EntityState<string>;
  entityTypeCounts;
};

export type FoodPackageResponse = {
  id: string;
  name: string;
  rate: number;
  startDate: number;
  endDate: number;
  active: boolean;
  currency: string;
  packageCode: string;
  imageUrl: string;
  source: string;
  hotelId: string;
  category: string;
  autoAccept: boolean;
  hasChild: boolean;
  discountedPrice: number;
  created: number;
  updated: number;
};
