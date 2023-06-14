import { PageRoutes } from '@hospitality-bot/admin/shared';

export const navRoute = {
  outlet: { label: 'Outlet', link: './' },
  allOutlets: { label: 'All Outlets', link: '/pages/outlet/all-outlets' },
  addOutlet: {
    label: 'Add Outlet',
    link: '/pages/outlet/all-outlets/add-outlet',
  },
  editOutlet: { label: 'Edit Outlet', link: '/pages/outlet/all-outlets/edit-outlet' },
  addMenu: { label: 'Add Menu', link: './' },
  addMenuItem: { label: 'Add Menu Item', link: './' },
  menuList: { label: 'Menu List', link: './' },
  createFoodPackage: { label: 'Create Food Package', link: './' },
};

export const outletRoutes: Record<
  | 'outlet'
  | 'allOutlets'
  | 'addOutlet'
  | 'editOutlet'
  | 'addMenu'
  | 'addMenuItem'
  | 'menuList'
  | 'createFoodPackage',
  PageRoutes
> = {
  outlet: {
    route: '',
    navRoutes: [],
    title: 'Outlet',
  },
  allOutlets: {
    route: 'all-outlets',
    navRoutes: [navRoute.outlet, navRoute.allOutlets],
    title: 'All Outlets',
  },
  addOutlet: {
    route: 'add-outlet',
    navRoutes: [navRoute.outlet, navRoute.allOutlets, navRoute.addOutlet],
    title: 'Add Outlet',
  },
  addMenu: {
    route: 'add-menu',
    navRoutes: [
      navRoute.outlet,
      navRoute.allOutlets,
      navRoute.addOutlet,
      navRoute.addMenu,
    ],
    title: 'Add Menu',
  },
  addMenuItem: {
    route: 'add-menu-item',
    navRoutes: [
      navRoute.outlet,
      navRoute.allOutlets,
      navRoute.addOutlet,
      navRoute.addMenu,
      navRoute.addMenuItem,
    ],
    title: 'Add Menu Item',
  },
  menuList: {
    route: 'menu-list',
    navRoutes: [navRoute.outlet, navRoute.allOutlets, navRoute.menuList],
    title: 'Menu List',
  },
  createFoodPackage: {
    route: 'create-food-package',
    navRoutes: [
      navRoute.outlet,
      navRoute.allOutlets,
      navRoute.createFoodPackage,
    ],
    title: 'Create Food Package',
  },
  editOutlet: {
    route: 'edit-outlet',
    navRoutes: [navRoute.outlet, navRoute.allOutlets, navRoute.editOutlet],
    title: 'Edit Outlet',
  },
};
