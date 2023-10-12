import { PageRoutes } from '@hospitality-bot/admin/shared';
import { title } from 'process';
import { OutletBaseComponent } from '../components/outlet-base.components';

export const navRoutes = {
  createWith: {
    label: 'create-with',
    link: './',
  },
  settings: {
    label: 'Settings',
    link: '/create-with/settings',
  },
  brand: {
    label: 'Brand',
    link: '/create-with/settings/business-info/brand',
  },
  hotel: {
    label: 'Hotel',
    link: '/create-with/settings/business-info/brand/:brandId/hotel',
  },
  editHotel: {
    label: 'Edit Hotel',
    link: '/create-with/settings/business-info/brand/:brandId/hotel/:entityId',
  },

  editBrand: {
    label: 'Edit Brand',
    link: '/create-with/settings/business-info/brand/:brandId',
  },
  businessInfo: {
    label: 'Business Info',
    link: '/create-with/settings/business-info',
  },
  addOutlet: {
    label: 'Add Outlet',
    link: '/create-with/settings/business-info/brand/:brandId/outlet',
  },
  addHotelOutlet: {
    label: 'Add Outlet',
    link:
      '/create-with/settings/business-info/brand/:brandId/hotel/:entityId/outlet',
  },
  editOutlet: {
    id: 'editOutlet',
    label: 'Edit Outlet',
    link: '/create-with/settings/business-info/brand/:brandId/outlet/:outletId',
  },
  editHotelOutlet: {
    label: 'Edit Outlet',
    link:
      '/create-with/settings/business-info/brand/:brandId/hotel/:entityId/outlet/:outletId',
  },
  importService: {
    label: 'Import Service',
    link:
      '/create-with/settings/business-info/brand/:brandId/outlet/:outletId/import-services',
  },
  addMenu: {
    label: 'Add Menu',
    link:
      '/create-with/settings/business-info/brand/:brandId/outlet/:outletId/add-menu',
  },
  editMenu: {
    label: 'Edit Menu',
    link: `/create-with/settings/business-info/brand/:brandId/outlet/:outletId/menu/:menuId`,
  },
  menuItem: {
    label: 'Add Menu Item',
    link: `/create-with/settings/business-info/brand/:brandId/outlet/:outletId/menu/:menuId/menu-item`,
  },
  editMenuItem: {
    label: 'Edit Menu Item',
    link: `/create-with/settings/business-info/brand/:brandId/outlet/:outletId/menu/:menuId/menu-item/:menuItemId`,
  },
  foodPackage: {
    label: 'Food Package',
    link: `/create-with/settings/business-info/brand/:brandId/outlet/:outletId/menu/:menuId/food-package`,
  },
  editFoodPackage: {
    label: 'Edit Food Package',
    link: `/create-with/settings/business-info/brand/:brandId/outlet/:outletId/menu/:menuId/food-package/:foodPackageId`,
  },
  services: {
    label: 'Services',
    link: `/create-with/settings/business-info/brand/:brandId/outlet/:outletId/view-all`,
  },
};

export const outletBusinessRoutes: Record<OutletBusinessRoutes, PageRoutes> = {
  outlet: {
    route: 'outlet',
    navRoutes: [
      navRoutes.createWith,
      navRoutes.settings,
      navRoutes.businessInfo,
      navRoutes.editBrand,
      navRoutes.addOutlet,
    ],
    title: 'Add Outlet',
  },
  editOutlet: {
    route: ':outletId',
    navRoutes: [
      navRoutes.createWith,
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
      navRoutes.createWith,
      navRoutes.settings,
      navRoutes.businessInfo,
      navRoutes.editBrand,
      navRoutes.editOutlet,
      navRoutes.importService,
    ],
    title: 'Import Services',
  },
  menu: {
    route: 'menu',
    navRoutes: [
      navRoutes.createWith,
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
      navRoutes.createWith,
      navRoutes.settings,
      navRoutes.businessInfo,
      navRoutes.editBrand,
      navRoutes.editOutlet,
      navRoutes.editMenu,
    ],
    title: 'Edit Menu',
  },
  menuItem: {
    route: 'menu-item',
    navRoutes: [
      navRoutes.createWith,
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
      navRoutes.createWith,
      navRoutes.settings,
      navRoutes.businessInfo,
      navRoutes.editBrand,
      navRoutes.editOutlet,
      navRoutes.editMenu,
      navRoutes.editMenuItem,
    ],
    title: 'Edit Menu Item',
  },
  foodPackage: {
    route: 'food-package',
    navRoutes: [
      navRoutes.createWith,
      navRoutes.settings,
      navRoutes.businessInfo,
      navRoutes.editBrand,
      navRoutes.editOutlet,
      navRoutes.foodPackage,
    ],
    title: 'Add Food Package',
  },
  editFoodPackage: {
    route: ':foodPackageId',
    navRoutes: [
      navRoutes.createWith,
      navRoutes.settings,
      navRoutes.businessInfo,
      navRoutes.editBrand,
      navRoutes.editOutlet,
      navRoutes.editFoodPackage,
    ],
    title: 'Edit Food Package',
  },
  services: {
    route: 'services',
    navRoutes: [
      navRoutes.createWith,
      navRoutes.settings,
      navRoutes.businessInfo,
      navRoutes.editBrand,
      navRoutes.editOutlet,
      navRoutes.services,
    ],
    title: 'Services',
  },
};

export type OutletEditRoutes =
  | 'editOutlet'
  | 'editMenu'
  | 'editMenuItem'
  | 'editFoodPackage';

export type OutletAddRoutes = 'outlet' | 'menu' | 'menuItem' | 'foodPackage';

export type OutletBusinessRoutes =
  | OutletAddRoutes
  | OutletEditRoutes
  | 'importService'
  | 'services';

export const hasId: Record<OutletAddRoutes, keyof OutletBaseComponent> = {
  outlet: 'outletId',
  menu: 'menuId',
  foodPackage: 'foodPackageId',
  menuItem: 'menuItemId',
};

export const correspondingEditRouteName: Record<
  OutletAddRoutes,
  OutletEditRoutes
> = {
  outlet: 'editOutlet',
  menu: 'editMenu',
  foodPackage: 'editFoodPackage',
  menuItem: 'editMenuItem',
};
