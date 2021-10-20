export const ADMIN_ROUTES = [
  {
    path: 'dashboard',
    title: 'Dashboard',
    children: null,
    url: 'assets/svg/dashboard.svg',
  },
  {
    path: 'guest',
    title: 'Guest',
    children: null,
    url: 'assets/svg/guest-tab.svg',
  },
  {
    path: 'feedback',
    title: 'Feedback',
    children: null,
    url: 'assets/svg/feedback-tab.svg',
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
    url: 'assets/svg/messenger.svg',
    children: [
      {
        path: 'conversation/analytics',
        title: 'Analytics',
        url: 'assets/svg/Analytics.svg',
      },
      {
        path: 'conversation/messages',
        title: 'Messages',
        url: 'assets/svg/chatting.svg',
      },
      {
        path: 'conversation/request',
        title: 'Requests',
        children: null,
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
