import { PageRoutes } from '@hospitality-bot/admin/shared';
import { title } from 'process';
import { OutletBaseComponent } from '../components/outlet-base.components';

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
  editHotel: {
    label: 'Edit Hotel',
    link: '/pages/settings/business-info/brand/:brandId/hotel/:entityId',
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
  addHotelOutlet: {
    label: 'Add Outlet',
    link: '/pages/settings/business-info/brand/:brandId/hotel/:entityId/outlet',
  },
  editOutlet: {
    id: 'editOutlet',
    label: 'Edit Outlet',
    link: '/pages/settings/business-info/brand/:brandId/outlet/:outletId',
  },
  editHotelOutlet: {
    label: 'Edit Outlet',
    link:
      '/pages/settings/business-info/brand/:brandId/hotel/:entityId/outlet/:outletId',
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
  editMenuItem: {
    label: 'Edit Menu Item',
    link: `/pages/settings/business-info/brand/:brandId/outlet/:outletId/menu/:menuId/menu-item/:menuItemId`,
  },
  foodPackage: {
    label: 'Food Package',
    link: `/pages/settings/business-info/brand/:brandId/outlet/:outletId/menu/:menuId/food-package`,
  },
  editFoodPackage: {
    label: 'Edit Food Package',
    link: `/pages/settings/business-info/brand/:brandId/outlet/:outletId/menu/:menuId/food-package/:foodPackageId`,
  },
  services: {
    label: 'Services',
    link: `/pages/settings/business-info/brand/:brandId/outlet/:outletId/view-all`,
  },
};

export const outletBusinessRoutes: Record<OutletBusinessRoutes, PageRoutes> = {
  outlet: {
    route: 'outlet',
    navRoutes: [
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
  menu: {
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
      navRoutes.editMenu,
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
      navRoutes.editMenuItem,
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
      navRoutes.editFoodPackage,
    ],
    title: 'Add Food Package',
  },
  editFoodPackage: {
    route: ':foodPackageId',
    navRoutes: [
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
