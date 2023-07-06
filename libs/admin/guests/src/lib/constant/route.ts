import { PageRoutes } from '@hospitality-bot/admin/shared';

export const navRoute = {
  guest: { label: 'Guest', link: '/pages/members/guests' },
  addGuest: { label: 'Add Guest', link: '' },
  editGuest: { label: 'Edit Guest', link: '' },
};

export const manageGuestRoutes: Record<
  'addGuest' | 'editGuest' | 'guest',
  PageRoutes
> = {
  guest: {
    title: 'Guest',
    route: '',
    navRoutes: [navRoute.addGuest],
  },
  addGuest: {
    title: 'Add Guest',
    route: 'add-guest',
    navRoutes: [navRoute.guest, navRoute.addGuest],
  },

  editGuest: {
    title: 'Edit Guest',
    route: 'edit-guest',
    navRoutes: [navRoute.guest, navRoute.editGuest],
  },
};
