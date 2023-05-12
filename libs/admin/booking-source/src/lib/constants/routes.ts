import { PageRoutes } from '@hospitality-bot/admin/shared';

export const navRoute = {
  library: { label: 'Library', link: './' },
  bookingSource: { label: 'Booking Source', link: '/pages/library/booking-source'},
  addAgent: { label: 'Add Agent', link: './'},
  addCompany: { label: 'Add Company', link: './'},
};

export const bookingSourceRoutes: Record<
  'bookingSource' | 'addAgent' | 'addCompany',
  PageRoutes
> = {
  bookingSource: {
    route: '',
    navRoutes: [],
    title: 'Booking Source',
  },
  addAgent: {
    route: 'add-agent',
    navRoutes: [navRoute.library, navRoute.bookingSource, navRoute.addAgent],
    title: 'Add Agent',
  },
  addCompany: {
    route: 'add-company',
    navRoutes: [navRoute.library, navRoute.bookingSource, navRoute.addCompany],
    title: 'Add Compnay',
  },
};
