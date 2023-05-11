import { PageRoutes } from '@hospitality-bot/admin/shared';

export const navRoute = {
  eFrontdesk: { label: 'eFrontdesk', link: './' },
  reservation: { label: 'Reservation', link: '/pages/efrontdesk/reservation' },
  addReservation: { label: 'Create Reservation', link: './' },
  editReservation: { label: 'Edit Reservation', link: './' },
  invoice: { label: 'Invoice', link: './' },
};

export const manageReservationRoutes: Record<
  'manageReservation' | 'addReservation' | 'editReservation' | 'invoice',
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
      navRoute.reservation,
      navRoute.addReservation,
    ],
    title: 'Add Reservation',
  },

  editReservation: {
    route: 'edit-reservation',
    navRoutes: [
      navRoute.eFrontdesk,
      navRoute.reservation,
      navRoute.editReservation,
    ],
    title: 'Edit Reservation',
  },

  invoice: {
    route: 'invoice',
    navRoutes: [navRoute.eFrontdesk, navRoute.reservation, navRoute.invoice],
    title: 'Invoice',
  },
};