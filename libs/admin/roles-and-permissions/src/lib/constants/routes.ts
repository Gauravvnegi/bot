import { PageRoutes } from '@hospitality-bot/admin/shared';

export const navRoute = {
  userProfile: {
    label: 'User Profile',
    link: '/pages/roles-permissions/manage-profile',
  },
  editUser: {
    label: 'Edit User',
    link: '/pages/roles-permissions/edit-user/{0}',
  },
  addNewUser: { label: 'Add User', link: '/pages/roles-permissions/add-user' },
};

export const managePermissionRoutes: Record<
  'userProfile' | 'addNewUser' | 'editUser',
  PageRoutes
> = {
  userProfile: {
    route: 'manage-profile',
    navRoutes: [navRoute.userProfile],
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
