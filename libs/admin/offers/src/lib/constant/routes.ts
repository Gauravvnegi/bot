import { PageRoutes } from '@hospitality-bot/admin/shared';

export const navRoute = {
  createOffers: { label: 'Create offers', link: './' },
  editOffers: { label: 'Edit offers', link: './' },
  createCategory: { label: 'Create Category', link: './' },
};

export const offersRoutes: Record<
  'offers' | 'createOffer' | 'editOffer' | 'createCategory',
  PageRoutes
> = {
  offers: {
    route: '',
    navRoutes: [],
    title: 'offers',
  },
  createOffer: {
    route: 'create-offer',
    navRoutes: [navRoute.createOffers],
    title: 'Create offers',
  },
  createCategory: {
    route: 'create-category',
    navRoutes: [navRoute.createCategory],
    title: 'Create Category',
  },
  editOffer: {
    route: 'create-offer/:id',
    navRoutes: [navRoute.editOffers],
    title: 'Edit offers',
  },
};
