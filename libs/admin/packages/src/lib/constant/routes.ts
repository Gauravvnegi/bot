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
    navRoutes: [navRoute.library, navRoute.packages, navRoute.createPackage],
    title: 'Create Package',
  },
  createCategory: {
    route: 'create-category',
    navRoutes: [navRoute.library, navRoute.packages, navRoute.createCategory],
    title: 'Create Category',
  },
  editPackage: {
    route: 'create-package/:id',
    navRoutes: [navRoute.library, navRoute.packages, navRoute.editPackage],
    title: 'Edit Package',
  },
};
