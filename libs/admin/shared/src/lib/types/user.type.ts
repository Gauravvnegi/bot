export type CookiesData = {
  accessToken: string;
  accessRefreshToken: string;
  user: string;
  'x-userId': string;
  entityId: string;
  siteId: string;
  brandId: string;
};

type SocialPlatforms = {
  name: string;
  socialPlatformType: string;
  imageUrl: string;
  redirectUrl: string;
};

type Brand = {
  id: string;
  name: string;
  logo: string;
  entities: {
    id: string;
    name: string;
    logo: string;
    timezone: string;
    outlets?: any[];
    address: {
      id: string;
      city: string;
      country: string;
      latitude: number;
      longitude: number;
      pincode: number;
    };
    pmsEnable: boolean;
  }[];
  socialPlatforms: SocialPlatforms[];
};

export type UserResponse = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  title: string;
  otpVerified: boolean;
  cc: string;
  phoneNumber: string;
  hotelAccess: { brands: Brand[] };
  permissions: {
    entity: string;
    label: string;
    permissions: {
      manage: -1 | 0 | 1;
      view: -1 | 0 | 1;
    };
    productType: string;
  }[];
  status: boolean;
  parentId?: boolean;
  profileUrl?: string;
  departments: {
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
  }[];
  sites: {
    id: string;
    name: string;
    domain: string;
    themeId: string;
    status: string;
    brands: Brand[];
    socialPlatforms: SocialPlatforms[];
  }[];
  agent: boolean;
};
