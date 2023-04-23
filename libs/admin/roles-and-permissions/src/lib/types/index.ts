import { managePermissionRoutes } from '../constants/routes';

export type Permission = {
  entity: string;
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
  hotelId?: string;
};

export type Department = {
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
}

export type HotelAccess = {
  chains: {
    id: string;
    name: string;
    hotels: {
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
  }[]
}
