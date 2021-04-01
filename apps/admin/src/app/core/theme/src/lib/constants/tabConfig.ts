export const TabsConfig = {
  GUESTS: 'guest',
  NOTIFICATIONS: 'request',
  FEEDBACK: 'feedback',
  PACKAGES: 'package',
  RESERVATION: 'dashboard',
};

export const ModuleConfig = {
  dashboard: {
    cards: ['ARRIVAL', 'INHOUSE', 'DEPARTURE'],
    tables: ['Reservations'],
    filters: { Reservations: ['ARRIVAL', 'INHOUSE', 'DEPARTURE'] },
  },
  guest: {
    cards: ['VIP', 'STATUS', 'PAYMENT', 'DOCUMENT'],
    tables: ['Guest List'],
    filters: { 'Guest List': ['ARRIVAL', 'INHOUSE', 'DEPARTURE', 'Out-Guest'] },
  },
  feedback: {
    cards: [],
    tables: ['Customers - Feedback'],
    filters: { 'Customers - Feedback': [] },
  },
  package: {
    cards: [],
    tables: ['Packages', 'Categories'],
    filters: { Packages: [], Categories: [] },
  },
  request: { cards: [], tables: ['Requests'], filters: { Requests: [] } },
};
