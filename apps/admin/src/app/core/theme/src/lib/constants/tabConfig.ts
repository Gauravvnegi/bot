export enum TabNames {
  GUESTS = 'guest',
  NOTIFICATIONS = 'request',
  FEEDBACK = 'feedback',
  PACKAGES = 'package',
  RESERVATION = 'dashboard',
}

export enum TableNames {
  RESERVATION = 'Reservations',
  GUEST = 'Guest List',
  FEEDBACK = 'Customers - Feedback',
  PACKAGE = 'Packages',
  CATEGORY = 'Categories',
  REQUEST = 'Requests',
}

export const ModuleConfig = {
  [TabNames.RESERVATION]: {
    cards: ['ARRIVAL', 'INHOUSE', 'DEPARTURE'],
    tables: [TableNames.RESERVATION],
    filters: {
      [TableNames.RESERVATION]: {
        tabFilters: ['ARRIVAL', 'INHOUSE', 'DEPARTURE'],
      },
    },
  },
  [TabNames.GUESTS]: {
    cards: ['VIP', 'STATUS', 'PAYMENT', 'DOCUMENT'],
    tables: [TableNames.GUEST],
    filters: {
      [TableNames.GUEST]: {
        tabFilters: ['ARRIVAL', 'INHOUSE', 'DEPARTURE', 'OUTGUEST'],
      },
    },
  },
  [TabNames.FEEDBACK]: {
    cards: [],
    tables: [TableNames.FEEDBACK],
    filters: { 'Customers - Feedback': { tabFilters: [] } },
  },
  [TabNames.PACKAGES]: {
    cards: [],
    tables: [TableNames.PACKAGE, TableNames.CATEGORY],
    filters: {
      [TableNames.PACKAGE]: { tabFilters: [] },
      [TableNames.CATEGORY]: { tabFilters: [] },
    },
  },
  [TabNames.NOTIFICATIONS]: {
    cards: [],
    tables: [TableNames.REQUEST],
    filters: { [TableNames.REQUEST]: { tabFilters: [] } },
  },
};
