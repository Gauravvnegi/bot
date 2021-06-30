export const ADMIN_ROUTES = [
  {
    path: 'dashboard',
    title: 'Dashboard',
    children: null,
    url: 'assets/svg/dashboard.svg',
  },
  // {
  //   path: 'roles-permissions',
  //   title: 'Roles & Permissions',
  //   children: null,
  //   url: 'assets/svg/Roles_&_Permission.svg',
  // },
  {
    path: 'guest',
    title: 'Guest',
    children: null,
    url: 'assets/svg/guest-tab.svg',
  },
  // {
  //   path: 'reservation',
  //   title: 'Reservations',
  //   children: null,
  //   url: 'assets/svg/chair.svg',
  // },
  // {
  //   path: 'notification',
  //   title: 'Notifications',
  //   children: null,
  //   url: 'assets/svg/notification.svg',
  // },
  {
    path: 'feedback',
    title: 'Feedback',
    children: null,
    url: 'assets/svg/feedback-tab.svg',
  },
  {
    path: 'request',
    title: 'Requests',
    children: null,
    url: 'assets/svg/request.svg',
  },
  {
    path: 'package',
    title: 'Packages',
    children: null,
    url: 'assets/svg/box.svg',
  },
  {
    path: 'covid',
    title: 'Covid-19',
    children: null,
    url: 'assets/svg/virus.svg',
  },
];

export const DEFAULT_ROUTES = [
  {
    path: 'conversation',
    title: 'Conversations',
    url: 'assets/svg/request.svg',
    children: [
      // {
      //   path: 'conversation/request',
      //   title: 'Requests',
      //   url: 'assets/svg/virus.svg',
      // },
      {
        path: 'conversation/messages',
        title: 'Messages',
        url: 'assets/svg/request.svg',
      },
    ],
  },
  {
    path: 'subscription',
    title: 'Subscription',
    children: null,
    url: 'assets/svg/subscription.svg',
  },
];
