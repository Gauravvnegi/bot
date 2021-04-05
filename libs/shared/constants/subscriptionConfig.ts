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

export enum CardNames {
  arrival = 'ARRIVAL',
  inhouse = 'INHOUSE',
  departure = 'DEPARTURE',
  vip = 'VIP',
  status = 'STATUS',
  payment = 'PAYMENT',
  document = 'DOCUMENT',
  globalNps = 'GlobalNPS',
  feedbackDistribution = 'FeedbackDistribution',
  nps = 'NetPromoterScore',
  npsAcrossDepartment = 'NPSAcrossDepartments',
  npsAcrossTouchpoint = 'NPSAcrossAllTouchpoints',
  npsAcrossServices = 'NPSAcrossServices',
  topLowNPS = 'Top/LowNPS',
}

export enum Filters {
  arrival = 'ARRIVAL',
  inhouse = 'INHOUSE',
  departure = 'DEPARTURE',
  outguest = 'OUTGUEST',
  reservation = 'RESERVATION',
}

export const ModuleConfig = {
  [TabNames.RESERVATION]: {
    cards: [CardNames.arrival, CardNames.inhouse, CardNames.departure],
    tables: [TableNames.RESERVATION],
    filters: {
      [TableNames.RESERVATION]: {
        tabFilters: [Filters.inhouse, Filters.arrival, Filters.departure],
      },
    },
  },
  [TabNames.GUESTS]: {
    cards: [
      CardNames.vip,
      CardNames.status,
      CardNames.payment,
      CardNames.document,
    ],
    tables: [TableNames.GUEST],
    filters: {
      [TableNames.GUEST]: {
        tabFilters: [
          Filters.arrival,
          Filters.inhouse,
          Filters.departure,
          Filters.outguest,
        ],
      },
    },
  },
  [TabNames.FEEDBACK]: {
    cards: [
      CardNames.globalNps,
      CardNames.npsAcrossDepartment,
      CardNames.npsAcrossTouchpoint,
      CardNames.feedbackDistribution,
      CardNames.nps,
      CardNames.topLowNPS,
      CardNames.npsAcrossServices,
    ],
    tables: [TableNames.FEEDBACK],
    filters: { [TableNames.FEEDBACK]: { tabFilters: [] } },
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
    filters: {
      [TableNames.REQUEST]: {
        tabFilters: [Filters.reservation, Filters.inhouse],
      },
    },
  },
};
