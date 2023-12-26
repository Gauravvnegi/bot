import { managePermissionRoutes } from '../constants/routes';

export type Permission = {
  module: string;
  label: string;
  permissions: {
    manage: -1 | 0 | 1;
    view: -1 | 0 | 1;
  };
  productType: string;
};

export type PermissionMod = Permission & {
  permissions: Permission['permissions'] & {
    disabledPermissions: {
      view: boolean;
      manage: boolean;
    };
  };
};

export type PageState = keyof typeof managePermissionRoutes;

export type QueryConfig = {
  queryObj?: string;
  loggedInUserId?: string;
  entityId?: string;
};

export type HotelAccess = {
  brands: {
    id: string;
    name: string;
    entities: {
      id: string;
      name: string;
      imageUrl: string;
      logo: string;
      footerLogo: string;
      bgColor: string;
      nationality: string;
      timezone: string;
      outlets: [];
      txnFbId: string;
      domain: string;
      pmsEnable: boolean;
    }[];
  }[];
};

export type UserForm = {
  id: string;
  firstName: string;
  lastName: string;
  jobTitle: string;
  brandName: string;
  products: string[];
  departments: string[];
  branchName: string[];
  cc: string;
  phoneNumber: string;
  email: string;
  profileUrl: string;
  permissionConfigs: any;
  reportingTo: string;
};
