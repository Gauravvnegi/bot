export const ROUTES = [
  { path: '', title: 'Dashboard', icon: 'dashboard', children: null },
  { path: '/profile', title: 'User Profile', icon: 'person', children: null },
  // { path: 'table', title: 'Table List', icon: 'content_paste', children: null },
  {
    path: '/#component',
    id: 'component',
    title: 'Component',
    icon: 'apps',
    children: [
      { path: '/components/price-table', title: 'Price Table', icon: 'PT' },
      { path: '/components/panels', title: 'Panels', icon: 'P' },
      { path: '/components/wizard', title: 'Wizard', icon: 'W' },
    ],
  },
  { path: '/settings', title: 'Settings', icon: 'settings', children: null },
];
