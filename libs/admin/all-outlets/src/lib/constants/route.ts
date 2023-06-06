import { PageRoutes } from '@hospitality-bot/admin/shared';

export const navRoute = {
  outlet: { label: 'Outlet', link: './' },
  allOutlets: { label: 'All Outlets', link: '/pages/outlets' },
  addOutlet: { label: 'Add Outlet', link: './' },
  addMenu: { label: 'Add Menu', link: './'},
  addMenuItem: { label: 'Add Menu Item', link: './'},
  menuList: { label: 'Menu List', link: './'}
};

export const outletRoutes: Record<
  'outlet' | 'allOutlets' | 'addOutlet' | 'addMenu' | 'addMenuItem' | 'menuList',
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
    title: 'Add Outlet'
  },
  addMenu: {
    route: 'add-menu',
    navRoutes: [navRoute.outlet, navRoute.allOutlets, navRoute.addOutlet, navRoute.addMenu],
    title: 'Add Menu'
  },
  addMenuItem: {
    route: 'add-menu-item',
    navRoutes: [navRoute.outlet, navRoute.allOutlets, navRoute.addOutlet, navRoute.addMenu, navRoute.addMenuItem],
    title: 'Add Menu Item'
  },
  menuList: {
    route: 'menu-list',
    navRoutes: [navRoute.outlet, navRoute.allOutlets, navRoute.menuList],
    title: 'Menu List'
  }
};


