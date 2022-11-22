export enum ModuleNames {
  GUESTS = 'guest',
  REQUEST = 'request',
  FEEDBACK = 'feedback',
  PACKAGES = 'package',
  RESERVATION = 'dashboard',
  NOTIFICATIONS = 'notification',
  ROLE_MANAGEMENT = 'roles-permissions',
  FEEDBACK_TRANSACTIONAL = 'FEEDBACK_TRANSACTIONAL',
  MARKETING = 'marketing',
  HEDA = 'heda',
  FREDDIE = 'freddie',
  FRONT_DESK = 'efrontdesk',
  BUILDER = 'builder',
}

export enum Integrations {
  OCR = 'ocr',
}

export enum TableNames {
  RESERVATION = 'Reservations',
  GUEST = 'Guest List',
  FEEDBACK = 'Guest - Feedback',
  PACKAGE = 'Packages',
  CATEGORY = 'Categories',
  REQUEST = 'Requests',
  FEEDBACK_TRANSACTIONAL = 'Guest - Feedback',
}

export enum CardNames {
  ARRIVAL = 'ARRIVAL',
  INHOUSE = 'INHOUSE',
  DEPARTURE = 'DEPARTURE',
  BOOKINGSTATUS = 'BOOKINGSTATUS',
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
  NPSAcrossPOS = 'NPSAcrossPOS',
  TopLowNPS = 'Top/LowNPS',
  OverallReceivedBifurcation = 'OverallReceivedBifurcation',
  Shared = 'Shared',
  Messages = 'Messages',
  Notification = 'Notification',
  GTMAcrossServices = 'GTMAcrossServices',
  ARTAcrossExperience = 'ARTAcrossExperience',
}

export enum Filters {
  ARRIVAL = 'ARRIVAL',
  DUEIN = 'DUEIN',
  DUEOUT = 'DUEOUT',
  INHOUSE = 'INHOUSE',
  CHECKEDOUT = 'CHECKEDOUT',
  DEPARTURE = 'DEPARTURE',
  OUTGUEST = 'OUTGUEST',
  RESERVATION = 'RESERVATION',
  JOURNEYRESERVATION = 'STAYFEEDBACK',
  Transactional = 'TRANSACTIONALFEEDBACK',
}

export enum Communication {
  WHATSAPP = 'WHATSAPP_BOT',
  FACEBOOK = 'FACEBOOK_BOT',
  WEB = 'WEB_BOT',
  MICRO = 'MICRO_SITES',
  TELEGRAM = 'TELEGRAM_BOT',
  WHATSAPP_LITE = 'WHATSAPP_LITE',
}

export const CommunicationConfig = {
  [Communication.FACEBOOK]: {
    imageUrl: 'assets/images/mm.png',
    disabledImageUrl: 'assets/images/messenger-disabled.png',
  },
  [Communication.WHATSAPP]: {
    imageUrl: 'assets/images/whatsapp.png',
    disabledImageUrl: 'assets/images/whatsapp-disabled.png',
  },
  [Communication.WEB]: {
    imageUrl: 'assets/svg/web-bot.svg',
    disabledImageUrl: 'assets/svg/web-botb.svg',
  },
  [Communication.MICRO]: {
    imageUrl: 'assets/svg/Micro-Site.svg',
    disabledImageUrl: 'assets/svg/Micro-Site-disabled.svg',
  },
  [Communication.TELEGRAM]: {
    imageUrl: '../../../../../../apps/admin/src/assets/svg/telegram.svg',
    disabledImageUrl:
      '../../../../../../apps/admin/src/assets/svg/telegram.svg',
  },
  [Communication.WHATSAPP_LITE]: {
    imageUrl: 'assets/images/whatsapp.png',
    disabledImageUrl: 'assets/images/whatsapp-disabled.png',
  },
};

export const TechSupport = {
  Gold: 'assets/svg/gold.svg',
  Silver: 'assets/svg/silver.svg',
  Platinum: 'assets/svg/platinum.svg',
};

export const ModuleConfig = {
  [ModuleNames.RESERVATION]: {
    cards: [
      CardNames.ARRIVAL,
      CardNames.INHOUSE,
      CardNames.DEPARTURE,
      CardNames.BOOKINGSTATUS,
      CardNames.RESERVATION,
      CardNames.Messages,
      CardNames.Notification,
    ],
    tables: [TableNames.RESERVATION],
    filters: {
      [TableNames.RESERVATION]: {
        tabFilters: [Filters.INHOUSE, Filters.ARRIVAL, Filters.DEPARTURE],
      },
    },
  },
  [ModuleNames.GUESTS]: {
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
          Filters.DUEIN,
          Filters.INHOUSE,
          Filters.DUEOUT,
          Filters.CHECKEDOUT,
        ],
      },
    },
  },
  [ModuleNames.FEEDBACK]: {
    cards: [
      CardNames.GlobalNPS,
      CardNames.NPSAcrossDepartment,
      CardNames.NPSAcrossTouchpoint,
      CardNames.FeedbackDistribution,
      CardNames.NPS,
      CardNames.TopLowNPS,
      CardNames.NPSAcrossServices,
      CardNames.NPSAcrossPOS,
      CardNames.OverallReceivedBifurcation,
      CardNames.Shared,
      CardNames.GTMAcrossServices,
      CardNames.ARTAcrossExperience,
    ],
    tables: [TableNames.FEEDBACK],
    filters: {
      [TableNames.FEEDBACK]: {
        tabFilters: [Filters.JOURNEYRESERVATION, Filters.Transactional],
      },
    },
  },
  [ModuleNames.FEEDBACK_TRANSACTIONAL]: {
    cards: [
      CardNames.GlobalNPS,
      CardNames.NPSAcrossDepartment,
      CardNames.NPSAcrossTouchpoint,
      CardNames.FeedbackDistribution,
      CardNames.NPS,
      CardNames.TopLowNPS,
      CardNames.NPSAcrossServices,
      CardNames.NPSAcrossPOS,
      CardNames.OverallReceivedBifurcation,
      CardNames.Shared,
    ],
    tables: [TableNames.FEEDBACK_TRANSACTIONAL],
    filters: {
      [TableNames.FEEDBACK_TRANSACTIONAL]: {
        tabFilters: [Filters.Transactional],
      },
    },
  },
  [ModuleNames.PACKAGES]: {
    cards: [],
    tables: [TableNames.PACKAGE, TableNames.CATEGORY],
    filters: {
      [TableNames.PACKAGE]: { tabFilters: [] },
      [TableNames.CATEGORY]: { tabFilters: [] },
    },
  },
  [ModuleNames.REQUEST]: {
    cards: [],
    tables: [TableNames.REQUEST],
    filters: {
      [TableNames.REQUEST]: {
        tabFilters: [Filters.RESERVATION, Filters.INHOUSE],
      },
    },
  },
  [ModuleNames.NOTIFICATIONS]: {
    cards: [],
    tables: [],
    filters: {},
  },
  [ModuleNames.ROLE_MANAGEMENT]: {
    cards: [],
    tables: [],
    filters: {},
  },
  [ModuleNames.MARKETING]: {
    cards: [],
    tables: [],
    filters: [],
  },
  [ModuleNames.HEDA]: {
    cards: [],
    tables: [],
    filters: [],
  },
  [ModuleNames.FREDDIE]: {
    cards: [],
    tables: [],
    filters: [],
  },
  [ModuleNames.FRONT_DESK]: {
    cards: [],
    tables: [],
    filters: [],
  },
  [ModuleNames.BUILDER]: {
    cards: [],
    tables: [],
    filters: [],
  },
};
