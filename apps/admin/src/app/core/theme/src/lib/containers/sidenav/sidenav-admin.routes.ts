export const ADMIN_ROUTES = [
  {
    path: 'dashboard',
    title: 'Dashboard',
    children: null,
    url: 'assets/svg/dashboard.svg',
  },
  {
    path: 'create-with',
    title: 'Create With',
    url: 'assets/svg/efrontdesk.svg',
    children: [
      {
        path: 'create-with/dashboard',
        title: 'Dashboard',
        children: null,
        url: 'assets/svg/guest-tab.svg',
      },
      {
        path: 'create-with/marketing-seo',
        title: 'Marketing & SEO',
        children: null,
        url: 'assets/svg/guest-tab.svg',
      },
      {
        path: 'create-with/theme',
        title: 'Themes',
        children: null,
        url: 'assets/svg/guest-tab.svg',
      },
      {
        path: 'create-with/page',
        title: 'Pages',
        children: null,
        url: 'assets/svg/guest-tab.svg',
      },
      {
        path: 'create-with/blog',
        title: 'Blogs',
        children: null,
        url: 'assets/svg/guest-tab.svg',
      },
    ],
  },
  {
    path: 'efrontdesk',
    title: 'eFrontdesk',
    url: 'assets/svg/efrontdesk.svg',
    children: [
      {
        path: 'efrontdesk/guest',
        title: 'Guest',
        children: null,
        url: 'assets/svg/guest-tab.svg',
      },
    ],
  },
  {
    path: 'freddie',
    title: 'Freddie',
    url: 'assets/svg/freddie.svg',
    urlColor: 'assets/svg/freddie-color.svg',
    children: [
      {
        path: 'freddie/conversation-analytics',
        title: 'Conversation Analytics',
        url: 'assets/svg/Analytics.svg',
      },
      {
        path: 'freddie/request-analytics',
        title: 'Request Analytics',
        url: 'assets/svg/Analytics.svg',
      },
      {
        path: 'freddie/request',
        title: 'Requests',
        children: null,
        url: 'assets/svg/request_icon.svg',
      },
      {
        path: 'freddie/messages',
        title: 'Messages',
        url: 'assets/svg/chatting.svg',
      },
      {
        path: 'freddie/sentimental-analysis',
        title: 'Sentimental Analysis',
        children: null,
        url: 'assets/svg/Analytics.svg',
      },
    ],
  },
  {
    path: 'heda',
    title: 'Heda',
    url: 'assets/svg/heda.svg',
    urlColor: 'assets/svg/heda-color.svg',
    children: [
      {
        path: 'heda/analytics',
        title: 'Analytics',
        children: null,
        url: 'assets/svg/Analytics.svg',
      },
      {
        path: 'heda/sentimental-analysis',
        title: 'Sentimental Analysis',
        children: null,
        url: 'assets/svg/Analytics.svg',
      }
    ],
  },
  {
    path: 'marketing',
    title: 'eMark-IT',
    url: 'assets/svg/emarkit.svg',
    children: [
      {
        path: 'marketing/analytics',
        title: 'Analytics',
        children: null,
        url: 'assets/svg/Analytics.svg',
      },
      {
        path: 'marketing/campaign',
        title: 'Campaign',
        children: null,
        url: 'assets/svg/megaphone.svg',
      },
    ],
  },
  {
    path: 'builder',
    title: 'Builder',
    children: null,
    url: 'assets/svg/builder.svg',
  },
  {
    path: 'library',
    title: 'Library',
    url: 'assets/svg/library.svg',
    children: [
      {
        path: 'library/packages',
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
];

export const DEFAULT_ROUTES = [
  {
    path: 'subscription',
    title: 'Subscription',
    children: null,
    url: 'assets/svg/subscription.svg',
  },
];
