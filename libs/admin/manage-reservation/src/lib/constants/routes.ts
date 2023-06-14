import { PageRoutes } from '@hospitality-bot/admin/shared';

export const navRoute = {
  eFrontdesk: { label: 'eFrontdesk', link: './' },
  manageReservation: { label: 'Booking', link: '/pages/efrontdesk/manage-reservation' },
  addBooking: { label: 'Add Booking', link: '/pages/efrontdesk/manage-reservation/add-booking' },
  editBooking: { label: 'Edit Booking', link: './' },
  addGuest: { label: 'Add Guest', link: './' },

};

export const manageReservationRoutes: Record<
  'manageReservation' | 'addBooking' | 'editBooking' | 'addGuest',
  PageRoutes
> = {
  manageReservation: {
    route: '',
    navRoutes: [],
    title: 'Reservation',
  },

  addBooking: {
    route: 'add-booking',
    navRoutes: [
      navRoute.eFrontdesk,
      navRoute.manageReservation,
      navRoute.addBooking,
    ],
    title: 'Add Booking',
  },

  editBooking: {
    route: 'edit-booking',
    navRoutes: [
      navRoute.eFrontdesk,
      navRoute.manageReservation,
      navRoute.editBooking,
    ],
    title: 'Edit Booking',
  },

  addGuest: {
    route: 'add-guest',
    navRoutes: [
      navRoute.eFrontdesk,
      navRoute.manageReservation,
      navRoute.addBooking,
      navRoute.addGuest
    ],
    title: 'Add Guest',
  },
};
