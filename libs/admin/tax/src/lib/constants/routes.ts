import { PageRoutes } from '@hospitality-bot/admin/shared';

export const navRoute = {
  settings: { label: 'Settings', link: '/pages/settings' },
  tax: { label: 'Tax', link: '/pages/settings/tax' },
  createTax: { label: 'Create Tax', link: './' },
  editTax: { label: 'Edit Tax', link: './' },
};

export const taxRoutes: Record<'tax' | 'createTax' | 'editTax', PageRoutes> = {
  tax: {
    route: '',
    navRoutes: [navRoute.settings, navRoute.tax],
    title: 'Tax',
  },
  createTax: {
    route: 'create-tax',
    navRoutes: [navRoute.settings, navRoute.tax, navRoute.createTax],
    title: 'Create Tax',
  },
  editTax: {
    route: 'create-tax',
    navRoutes: [navRoute.settings, navRoute.tax, navRoute.editTax],
    title: 'Edit Tax',
  },
};
