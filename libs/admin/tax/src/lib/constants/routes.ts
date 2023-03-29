import { PageRoutes } from '@hospitality-bot/admin/shared';
export const navRoute = {
  settings: { label: 'Settings', link: '/pages/settings' },
  tax: { label: 'Tax', link: '/pages/tax' },
  createTax: { label: 'Create Tax', link: './' },
};

export const taxRoutes: Record<'tax' | 'createTax', PageRoutes> = {
  tax: {
    route: '',
    navRoutes: [navRoute.settings, navRoute.tax],
    title: 'Services',
  },
  createTax: {
    route: 'create-tax',
    navRoutes: [navRoute.settings, navRoute.tax, navRoute.createTax],
    title: 'Create Service',
  },
};

