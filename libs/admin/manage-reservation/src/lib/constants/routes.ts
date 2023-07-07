import { PageRoutes } from '@hospitality-bot/admin/shared';

export const navRoute = {
  eFrontdesk: { label: 'eFrontdesk', link: './' },
  manageBooking: {
    label: 'Booking',
    link: '/pages/efrontdesk/manage-booking',
  },
  addBooking: {
    label: 'Add Booking',
    link: '/pages/efrontdesk/manage-booking/add-booking',
  },
  editBooking: { label: 'Edit Booking', link: '/pages/efrontdesk/manage-booking/edit-booking/:id' },
  addGuest: { label: 'Add Guest', link: './' },
};

export const manageBookingRoutes: Record<
  'manageBooking' | 'addBooking' | 'editBooking' | 'addGuest1' | 'addGuest2',
  PageRoutes
> = {
  manageBooking: {
    route: '',
    navRoutes: [],
    title: 'Booking',
  },

  addBooking: {
    route: 'add-booking',
    navRoutes: [
      navRoute.eFrontdesk,
      navRoute.manageBooking,
      navRoute.addBooking,
    ],
    title: 'Add Booking',
  },

  editBooking: {
    route: 'edit-booking',
    navRoutes: [
      navRoute.eFrontdesk,
      navRoute.manageBooking,
      navRoute.editBooking,
    ],
    title: 'Edit Booking',
  },

  addGuest1: {
    route: 'add-guest',
    navRoutes: [
      navRoute.eFrontdesk,
      navRoute.manageBooking,
      navRoute.addBooking,
      navRoute.addGuest,
    ],
    title: 'Add Guest',
  },

  addGuest2: {
    route: 'add-guest',
    navRoutes: [
      navRoute.eFrontdesk,
      navRoute.manageBooking,
      navRoute.editBooking,
      navRoute.addGuest,
    ],
    title: 'Add Guest',
  },
};
