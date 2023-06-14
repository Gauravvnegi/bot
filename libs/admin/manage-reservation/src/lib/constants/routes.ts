import { PageRoutes } from '@hospitality-bot/admin/shared';

export const navRoute = {
  eFrontdesk: { label: 'eFrontdesk', link: './' },
  manageReservation: {
    label: 'Reservation',
    link: '/pages/efrontdesk/manage-reservation',
  },
  addReservation: {
    label: 'Add Reservation',
    link: '/pages/efrontdesk/manage-reservation/add-reservation',
  },
  editReservation: { label: 'Edit Reservation', link: './' },
  addGuest: { label: 'Add Guest', link: './' },
};

export const manageReservationRoutes: Record<
  'manageReservation' | 'addReservation' | 'editReservation' | 'addGuest',
  PageRoutes
> = {
  manageReservation: {
    route: '',
    navRoutes: [],
    title: 'Reservation',
  },

  addReservation: {
    route: 'add-reservation',
    navRoutes: [
      navRoute.eFrontdesk,
      navRoute.manageReservation,
      navRoute.addReservation,
    ],
    title: 'Add Reservation',
  },

  editReservation: {
    route: 'edit-reservation',
    navRoutes: [
      navRoute.eFrontdesk,
      navRoute.manageReservation,
      navRoute.editReservation,
    ],
    title: 'Edit Reservation',
  },

  addGuest: {
    route: 'add-guest',
    navRoutes: [
      navRoute.eFrontdesk,
      navRoute.manageReservation,
      navRoute.addReservation,
      navRoute.addGuest,
    ],
    title: 'Add Guest',
  },
};
