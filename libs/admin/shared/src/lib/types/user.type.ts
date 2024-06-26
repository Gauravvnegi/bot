import { PermissionModuleNames, ProductNames } from '../constants';
import { EntitySubType, EntityType } from './table.type';

export type CookiesData = {
  accessToken: string;
  accessRefreshToken: string;
  user: string;
  'x-userId': string;
  entityId: string;
  siteId: string;
  brandId: string;
};

export type SocialPlatforms = {
  name: string;
  socialPlatformType: string;
  imageUrl: string;
  redirectUrl: string;
};

export type Address = {
  id: string;
  city: string;
  country: string;
  streetAddress: string;
  latitude?: number;
  longitude?: number;
  pincode?: number;
  formattedAddress: string;
  countryCode: string;
};

export type Entity = {
  id: string;
  category: EntityType;
  name: string;
  logo: string;
  address: Address;
  websiteUrl?: string;
  socialPlatforms: SocialPlatforms[];
  nationality: string;
  status: string;
  parentId: string;
  entities?: Entity[];
  contact: any;
  redirectionParameter: any;
  showAddress: boolean;
  timezone: string;
  footerLogo: string;
  privacyPolicyUrl: string;
  termsUrl?: string;
  favIcon: string;
  type: EntitySubType;
};

export type Brand = {
  id: string;
  name: string;
  logo: string;
  entities: Entity[];
  socialPlatforms: SocialPlatforms[];
  category: string;
  address: Address;
  redirectionParameter: {};
  showAddress: boolean;
  description: string;
  status: string | boolean;
};

export type Sites = {
  id: string;
  name: string;
  siteUrl: string;
  themeId: string;
  status: string;
  brands: Brand[];
  socialPlatforms: SocialPlatforms[];
  created: number;
  updated: number;
  domainConnected: boolean;
};

export type DepartmentRes = {
  parentId: string;
  id: string;
  view: -1 | 0 | 1;
  manage: -1 | 0 | 1;
  module: string;
  department: string;
  entityId: string;
  userId: string;
  created: number;
  updated: number;
  productType: string;
  departmentLabel: string;
  productLabel: string;
};

export type UserResponse = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  title: string;
  cc: string;
  phoneNumber: string;
  // hotelAccess: { brands: Brand[] };
  products: Product[];
  departments?: DepartmentRes[];
  status: boolean;
  parentId?: string;
  profileUrl?: string;

  sites: Sites[];
  agent: boolean;
  reportingTo: string;
  available: boolean;
};

type PermissionStatus = -1 | 0 | 1;

type PermissionConfig = {
  manage: PermissionStatus;
  view: PermissionStatus;
};

type ProductPermission = {
  module: PermissionModuleNames;
  label: string;
  permissions: PermissionConfig;
  productType: string;
};

type Product = {
  id: string;
  module: ProductNames;
  label: string;
  permissions: PermissionConfig;
  productType: string;
  productPermissions: ProductPermission[];
};
