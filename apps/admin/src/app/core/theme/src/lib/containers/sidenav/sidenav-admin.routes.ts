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
    path: 'covid',
    title: 'Covid-19',
    children: null,
    url: 'assets/svg/virus.svg',
  },
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
        path: 'conversation/request',
        title: 'Requests',
        children: null,
        url: 'assets/svg/request_icon.svg',
      },
      {
        path: 'conversation/messages',
        title: 'Messages',
        url: 'assets/svg/chatting.svg',
      },
    ],
  },
];

export const DEFAULT_ROUTES = [
  {
    path: 'marketing',
    title: 'Marketing',
    url: 'assets/svg/megaphone.svg',
    children: [
      {
        path: 'marketing/campaign',
        title: 'Campaign',
        children: null,
        url: 'assets/svg/marketing.svg',
      },
    ],
  },
  {
    path: 'library',
    title: 'Library',
    url: 'assets/svg/books.svg',
    children: [
      {
        path: 'library/package',
        title: 'Packages',
        children: null,
        url: 'assets/svg/box.svg',
      },
      {
        path: 'library/listing',
        title: 'Listing',
        children: null,
        url: 'assets/svg/to-do-list.svg',
      },
      {
        path: 'library/topic',
        title: 'Topic',
        children: null,
        url: 'assets/svg/ballot.svg',
      },
      {
        path: 'library/assets',
        title: 'Assets',
        children: null,
        url: 'assets/svg/allocation.svg',
      },
      {
        path: 'library/template',
        title: 'Template',
        children: null,
        url: 'assets/svg/template.svg',
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
