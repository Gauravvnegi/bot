import { NavRouteOption, PageRoutes } from '@hospitality-bot/admin/shared';

type RouteKey = 'userProfile' | 'addNewUser' | 'editUser';

export const navRoute: Record<RouteKey, NavRouteOption> = {
  userProfile: {
    label: 'User Profile',
    link: '/pages/roles-permissions/manage-profile',
  },
  editUser: {
    label: 'Edit User',
    link: '/pages/roles-permissions/edit-user/{0}',
    isDisabled: true,
  },
  addNewUser: {
    label: 'Add User',
    link: '/pages/roles-permissions/add-user',
    isDisabled: true,
  },
};

export const managePermissionRoutes: Record<RouteKey, PageRoutes> = {
  userProfile: {
    route: 'manage-profile',
    navRoutes: [{ ...navRoute.userProfile, isDisabled: true }],
    title: 'Mange User Profile',
  },
  addNewUser: {
    route: 'add-user',
    navRoutes: [navRoute.userProfile, navRoute.addNewUser],
    title: 'Add New User',
  },
  editUser: {
    route: 'edit-user/:id',
    navRoutes: [navRoute.userProfile, navRoute.editUser],
    title: 'Edit {0} Profile',
  },
};
