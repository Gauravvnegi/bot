export enum FeatureNames {
  GUESTS = 'guest',
  REQUEST = 'request',
  FEEDBACK = 'feedback',
  PACKAGES = 'package',
  RESERVATION = 'dashboard',
  NOTIFICATIONS = 'notification',
  USERS = 'roles-permissions',
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
  ARRIVAL = 'ARRIVAL',
  INHOUSE = 'INHOUSE',
  DEPARTURE = 'DEPARTURE',
  VIP = 'VIP',
  RESERVATION = 'RESERVATION',
  STATUS = 'STATUS',
  PAYMENT = 'PAYMENT',
  DOCUMENT = 'DOCUMENT',
  GlobalNPS = 'GlobalNPS',
  FeedbackDistribution = 'FeedbackDistribution',
  NPS = 'NetPromoterScore',
  NPSAcrossDepartment = 'NPSAcrossDepartments',
  NPSAcrossTouchpoint = 'NPSAcrossAllTouchpoints',
  NPSAcrossServices = 'NPSAcrossServices',
  TopLowNPS = 'Top/LowNPS',
}

export enum Filters {
  ARRIVAL = 'ARRIVAL',
  INHOUSE = 'INHOUSE',
  DEPARTURE = 'DEPARTURE',
  OUTGUEST = 'OUTGUEST',
  RESERVATION = 'RESERVATION',
  JOURNEYRESERVATION = 'ALL',
}

export enum Communication {
  WHATSAPP = 'WHATSAPP_BOT',
  FACEBOOK = 'FACEBOOK_BOT',
  WEB = 'WEB_BOT',
  MICRO = 'MICRO_SITES',
}

export const CommunicationConfig = {
  [Communication.FACEBOOK]: {
    imageUrl: 'assets/mm.png',
    disabledImageUrl: 'assets/messenger-disabled.png',
  },
  [Communication.WHATSAPP]: {
    imageUrl: 'assets/whatsapp.png',
    disabledImageUrl: 'assets/whatsapp-disabled.png',
  },
  [Communication.WEB]: {
    imageUrl: 'assets/telegram.png',
    disabledImageUrl: 'assets/telegram-disabled.png',
  },
  [Communication.MICRO]: {
    imageUrl: 'assets/mm.png',
    disabledImageUrl: 'assets/messenger-disabled.png',
  },
};

export const ModuleConfig = {
  [FeatureNames.RESERVATION]: {
    cards: [
      CardNames.ARRIVAL,
      CardNames.INHOUSE,
      CardNames.DEPARTURE,
      CardNames.RESERVATION,
    ],
    tables: [TableNames.RESERVATION],
    filters: {
      [TableNames.RESERVATION]: {
        tabFilters: [Filters.INHOUSE, Filters.ARRIVAL, Filters.DEPARTURE],
      },
    },
  },
  [FeatureNames.GUESTS]: {
    cards: [
      CardNames.VIP,
      CardNames.STATUS,
      CardNames.PAYMENT,
      CardNames.DOCUMENT,
    ],
    tables: [TableNames.GUEST],
    filters: {
      [TableNames.GUEST]: {
        tabFilters: [
          Filters.ARRIVAL,
          Filters.INHOUSE,
          Filters.DEPARTURE,
          Filters.OUTGUEST,
        ],
      },
    },
  },
  [FeatureNames.FEEDBACK]: {
    cards: [
      CardNames.GlobalNPS,
      CardNames.NPSAcrossDepartment,
      CardNames.NPSAcrossTouchpoint,
      CardNames.FeedbackDistribution,
      CardNames.NPS,
      CardNames.TopLowNPS,
      CardNames.NPSAcrossServices,
    ],
    tables: [TableNames.FEEDBACK],
    filters: {
      [TableNames.FEEDBACK]: { tabFilters: [Filters.JOURNEYRESERVATION] },
    },
  },
  [FeatureNames.PACKAGES]: {
    cards: [],
    tables: [TableNames.PACKAGE, TableNames.CATEGORY],
    filters: {
      [TableNames.PACKAGE]: { tabFilters: [] },
      [TableNames.CATEGORY]: { tabFilters: [] },
    },
  },
  [FeatureNames.REQUEST]: {
    cards: [],
    tables: [TableNames.REQUEST],
    filters: {
      [TableNames.REQUEST]: {
        tabFilters: [Filters.RESERVATION, Filters.INHOUSE],
      },
    },
  },
  [FeatureNames.NOTIFICATIONS]: {
    cards: [],
    tables: [],
    filters: {},
  },
  [FeatureNames.USERS]: {
    cards: [],
    tables: [],
    filters: {},
  },
};
