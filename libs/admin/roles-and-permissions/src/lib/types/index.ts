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
