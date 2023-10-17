import { PageRoutes } from '@hospitality-bot/admin/shared';

export const navRoute = {
  library: { label: 'Library', link: './' },
  packages: { label: 'Packages', link: '/pages/library/packages' },
  createPackage: { label: 'Create Package', link: './' },
  editPackage: { label: 'Edit Package', link: './' },
  createCategory: { label: 'Create Category', link: './' },
};

export const packagesRoutes: Record<
  'packages' | 'createPackage' | 'editPackage' | 'createCategory',
  PageRoutes
> = {
  packages: {
    route: '',
    navRoutes: [],
    title: 'Packages',
  },
  createPackage: {
    route: 'create-package',
    navRoutes: [navRoute.createPackage],
    title: 'Create Package',
  },
  createCategory: {
    route: 'create-category',
    navRoutes: [navRoute.createCategory],
    title: 'Create Category',
  },
  editPackage: {
    route: 'create-package/:id',
    navRoutes: [navRoute.editPackage],
    title: 'Edit Package',
  },
};
