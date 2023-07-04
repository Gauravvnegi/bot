import { PageRoutes } from '@hospitality-bot/admin/shared';
import { title } from 'process';

export const navRoutes = {
  settings: {
    label: 'Settings',
    link: '/pages/settings',
  },
  brand: {
    label: 'Brand',
    link: '/pages/settings/business-info/brand',
  },
  hotel: {
    label: 'Hotel',
    link: '/pages/settings/business-info/brand/:brandId/hotel',
  },

  editBrand: {
    label: 'Edit Brand',
    link: '/pages/settings/business-info/brand/:brandId',
  },
  businessInfo: {
    label: 'Business Info',
    link: '/pages/settings/business-info',
  },
  addOutlet: {
    label: 'Add Outlet',
    link: '/pages/settings/business-info/brand/:brandId/outlet',
  },
  editOutlet: {
    label: 'Edit Outlet',
    link: '/pages/settings/business-info/brand/:brandId/outlet/:outletId',
  },
  importService: {
    label: 'Import Service',
    link:
      '/pages/settings/business-info/brand/:brandId/outlet/:outletId/import-services',
  },
  addMenu: {
    label: 'Add Menu',
    link:
      '/pages/settings/business-info/brand/:brandId/outlet/:outletId/add-menu',
  },
  editMenu: {
    label: 'Edit Menu',
    link: `/pages/settings/business-info/brand/:brandId/outlet/:outletId/menu/:menuId`,
  },
  menuItem: {
    label: 'Add Menu Item',
    link: `/pages/settings/business-info/brand/:brandId/outlet/:outletId/menu/:menuId/menu-item`,
  },
  foodPackage: {
    label: 'Food Package',
    link: `/pages/settings/business-info/brand/:brandId/outlet/:outletId/menu/:menuId/food-package`,
  },
};

export const outletBusinessRoutes: Record<
  | 'addOutlet'
  | 'editOutlet'
  | 'importService'
  | 'addMenu'
  | 'editMenu'
  | 'menuItem'
  | 'editMenuItem'
  | 'foodPackage',
  PageRoutes
> = {
  addOutlet: {
    route: 'outlet',
    navRoutes: [
      navRoutes.settings,
      navRoutes.businessInfo,
      navRoutes.editBrand,
      navRoutes.addOutlet,
    ],
    title: 'Outlet',
  },
  editOutlet: {
    route: ':outletId',
    navRoutes: [
      navRoutes.settings,
      navRoutes.businessInfo,
      navRoutes.editBrand,
      navRoutes.editOutlet,
    ],
    title: 'Edit Outlet',
  },
  importService: {
    route: 'import-services',
    navRoutes: [
      navRoutes.settings,
      navRoutes.businessInfo,
      navRoutes.editBrand,
      navRoutes.editOutlet,
      navRoutes.importService,
    ],
    title: 'Import Services',
  },
  addMenu: {
    route: 'menu',
    navRoutes: [
      navRoutes.settings,
      navRoutes.businessInfo,
      navRoutes.editBrand,
      navRoutes.editOutlet,
      navRoutes.addMenu,
    ],
    title: 'Add Menu',
  },
  editMenu: {
    route: ':menuId',
    navRoutes: [
      navRoutes.settings,
      navRoutes.businessInfo,
      navRoutes.editBrand,
      navRoutes.editOutlet,
      navRoutes.addMenu,
    ],
    title: 'Edit Menu',
  },
  menuItem: {
    route: 'menu-item',
    navRoutes: [
      navRoutes.settings,
      navRoutes.businessInfo,
      navRoutes.editBrand,
      navRoutes.editOutlet,
      navRoutes.editMenu,
      navRoutes.menuItem,
    ],
    title: 'Add Menu Item',
  },
  editMenuItem: {
    route: ':menuItemId',
    navRoutes: [
      navRoutes.settings,
      navRoutes.businessInfo,
      navRoutes.editBrand,
      navRoutes.editOutlet,
      navRoutes.editMenu,
      navRoutes.menuItem,
    ],
    title: 'Edit Menu Item',
  },
  foodPackage: {
    route: 'food-package',
    navRoutes: [
      navRoutes.settings,
      navRoutes.businessInfo,
      navRoutes.editBrand,
      navRoutes.editOutlet,
      navRoutes.foodPackage,
    ],
    title: 'Add Food Package',
  },
};
