import { PageRoutes } from '@hospitality-bot/admin/shared';

export const navRoute = {
  library: { label: 'Library', link: './' },
  services: { label: 'Services', link: '/pages/library/services' },
  createServices: { label: 'Create Service', link: './' },
  editServices: { label: 'Edit Service', link: './' },
  createCategory: { label: 'Create Category', link: './' },
};

export const servicesRoutes: Record<
  'services' | 'createService' | 'editService' | 'createCategory',
  PageRoutes
> = {
  services: {
    route: '',
    navRoutes: [],
    title: 'Services',
  },
  createService: {
    route: 'create-service',
    navRoutes: [navRoute.library, navRoute.services, navRoute.createServices],
    title: 'Create Service',
  },
  createCategory: {
    route: 'create-category',
    navRoutes: [navRoute.library, navRoute.services, navRoute.createCategory],
    title: 'Create Category',
  },
  editService: {
    route: 'create-service/:id',
    navRoutes: [navRoute.library, navRoute.services, navRoute.editServices],
    title: 'Edit Service',
  },
};
