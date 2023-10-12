import { P } from '@angular/cdk/keycodes';
import { PageRoutes } from '@hospitality-bot/admin/shared';

export const navRoute = {
  createWith: {
    label: 'create-with',
    link: './',
  },
  settings: {
    label: 'Settings',
    link: './',
  },
  brand: {
    label: 'Brand',
    link: '/create-with/settings/business-info/brand',
    isDisabled: true,
  },
  hotel: {
    label: 'Hotel',
    link: '/create-with/settings/business-info/brand/:brandId/hotel',
    isDisabled: true,
  },

  editBrand: {
    label: 'Edit Brand',
    link: '/create-with/settings/business-info/brand/:brandId',
    isDisabled: true,
  },
  businessInfo: {
    label: 'Business Info',
    link: '/create-with/settings/business-info',
  },
  editHotel: {
    label: 'Edit Hotel',
    link: '/create-with/settings/business-info/brand/:brandId/hotel/:entityId',
    isDisabled: true,
  },
  importService: {
    label: 'Import Service',
    link:
      '/create-with/settings/business-info/brand/:brandId/hotel/import-services',
    isDisabled: true,
  },
  editImportService: {
    label: 'Import Service',
    link:
      '/create-with/settings/business-info/brand/:brandId/hotel/:entityId/import-services',
    isDisabled: true,
  },
  services: { label: 'Services', link: './' },
};

export const businessRoute: Record<
  | 'brand'
  | 'editBrand'
  | 'hotel'
  | 'editHotel'
  | 'services'
  | 'editServices'
  | 'importServices'
  | 'editImportServices'
  | 'outlet',
  PageRoutes
> = {
  brand: {
    route: '',
    navRoutes: [
      navRoute.createWith,
      navRoute.settings,
      navRoute.businessInfo,
      navRoute.brand,
    ],
    title: 'Brand',
  },
  editBrand: {
    route: ':brandId',
    navRoutes: [
      navRoute.createWith,
      navRoute.settings,
      navRoute.businessInfo,
      navRoute.editBrand,
    ],
    title: 'Edit Brand',
  },
  hotel: {
    route: 'hotel',
    navRoutes: [
      navRoute.createWith,
      navRoute.settings,
      navRoute.businessInfo,
      navRoute.editBrand,
      navRoute.hotel,
    ],
    title: 'Hotel',
  },
  editHotel: {
    route: ':entityId',
    navRoutes: [
      navRoute.createWith,
      navRoute.settings,
      navRoute.businessInfo,
      navRoute.editBrand,
      navRoute.editHotel,
    ],
    title: 'Edit Hotel',
  },
  services: {
    route: 'services',
    navRoutes: [
      navRoute.createWith,
      navRoute.settings,
      navRoute.businessInfo,
      navRoute.editBrand,
      navRoute.hotel,
      navRoute.services,
    ],
    title: 'Services',
  },
  editServices: {
    route: ':serviceId',
    navRoutes: [
      navRoute.createWith,
      navRoute.settings,
      navRoute.businessInfo,
      navRoute.editBrand,
      navRoute.editHotel,
      navRoute.services,
    ],
    title: 'Services',
  },
  importServices: {
    route: 'import-services',
    navRoutes: [
      navRoute.createWith,
      navRoute.settings,
      navRoute.businessInfo,
      navRoute.editBrand,
      navRoute.hotel,
      navRoute.importService,
    ],
    title: 'Import Services',
  },
  editImportServices: {
    route: 'import-services',
    navRoutes: [
      navRoute.createWith,
      navRoute.settings,
      navRoute.businessInfo,
      navRoute.editBrand,
      navRoute.editHotel,
      navRoute.editImportService,
    ],
    title: 'Import Services',
  },
  outlet: {
    route: 'outlet',
    navRoutes: [],
    title: 'Outlet',
  },
};
