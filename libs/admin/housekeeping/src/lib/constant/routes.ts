import { PageRoutes } from '@hospitality-bot/admin/shared';

export const navRoutes = {
  efrontDesk: {
    label: 'eFront Desk',
    link: './',
  },
  houseKeeping: {
    label: 'HouseKeeping',
    link: '/pages/housekeeping',
  },
};
export const houseKeepingRoutes: Record<HouseKeepingRoutes, PageRoutes> = {
  HouseKeeping: {
    route: 'housekeeping',
    navRoutes: [navRoutes.efrontDesk, navRoutes.houseKeeping],
    title: 'HouseKeeping',
  },
};

type HouseKeepingRoutes = 'HouseKeeping';
