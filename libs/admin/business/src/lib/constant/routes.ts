import { PageRoutes } from '@hospitality-bot/admin/shared';

export const navRoute = {
  settings: {
    label: 'Settings',
    link: '/pages/settings',
  },
  brand: {
    label: 'Brand',
    link: '/pages/settings/business-info/brand',
    isDisabled: true,
  },
  hotel: {
    label: 'Hotel',
    link: '/pages/settings/business-info/brand/:brandId/hotel',
    isDisabled: true,
  },

  editBrand: {
    label: 'Edit Brand',
    link: '/pages/settings/business-info/brand/:brandId',
    isDisabled: true,
  },
  bussinessInfo: {
    label: 'Business Info',
    link: '/pages/settings/business-info',
  },
  editHotel: {
    label: 'Edit Hotel',
    link: '/pages/settings/business-info/brand/:brandId/hotel/:hotelId',
    isDisabled: true,
  },
  services: { label: 'Services', link: './' },
};

export const businessRoute: Record<
  'brand' | 'editBrand' | 'hotel' | 'editHotel' | 'services' | 'editServices',
  PageRoutes
> = {
  brand: {
    route: '',
    navRoutes: [navRoute.settings, navRoute.bussinessInfo, navRoute.brand],
    title: 'Brand',
  },
  editBrand: {
    route: ':brandId',
    navRoutes: [navRoute.settings, navRoute.bussinessInfo, navRoute.editBrand],
    title: 'Edit Brand',
  },
  hotel: {
    route: 'hotel',
    navRoutes: [
      navRoute.settings,
      navRoute.bussinessInfo,
      navRoute.editBrand,
      navRoute.hotel,
    ],
    title: 'Hotel',
  },
  editHotel: {
    route: ':hotelId',
    navRoutes: [
      navRoute.settings,
      navRoute.bussinessInfo,
      navRoute.editBrand,
      navRoute.editHotel,
    ],
    title: 'Edit Hotel',
  },
  services: {
    route: 'services',
    navRoutes: [
      navRoute.settings,
      navRoute.bussinessInfo,
      navRoute.editBrand,
      navRoute.hotel,
      navRoute.services,
    ],
    title: 'Services',
  },
  editServices: {
    route: ':serviceId',
    navRoutes: [
      navRoute.settings,
      navRoute.bussinessInfo,
      navRoute.editBrand,
      navRoute.editHotel,
      navRoute.services,
    ],
    title: 'Services',
  },
};
