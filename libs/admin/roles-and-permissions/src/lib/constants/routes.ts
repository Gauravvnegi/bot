import { NavRouteOption, PageRoutes } from '@hospitality-bot/admin/shared';

export type UserPermissionRoutes =
  | 'userProfile'
  | 'addNewUser'
  | 'editUser'
  | 'viewUser';

export const navRoute: Record<UserPermissionRoutes, NavRouteOption> = {
  userProfile: {
    label: 'User Profile',
    link: '/pages/roles-permissions/manage-profile',
  },
  editUser: {
    label: 'Edit User',
    link: '/pages/roles-permissions/edit-user/:userId',
    isDisabled: true,
  },
  addNewUser: {
    label: 'Add User',
    link: '/pages/roles-permissions/add-user',
    isDisabled: true,
  },
  viewUser: {
    label: 'View User',
    link: '/pages/roles-permissions/view-user/:userId',
    isDisabled: true,
  },
};

export const managePermissionRoutes: Record<
  UserPermissionRoutes,
  PageRoutes
> = {
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
    title: 'Edit User Profile',
  },
  viewUser: {
    route: 'view-user/:id',
    navRoutes: [navRoute.userProfile, navRoute.viewUser],
    title: 'View User Profile',
  },
};
