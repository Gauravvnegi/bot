export enum PermissionModuleNames {
  INVENTORY = 'INVENTORY',
  MEMBERS = 'MEMBERS',
  LIBRARY = 'LIBRARY',
  REPORTS = 'REPORTS',
  USERS = 'USERS',
  FINANCE = 'FINANCE',
  CONVERSATIONS = 'CONVERSATIONS',
  SITE = 'SITE',
  SEGMENTS = 'SEGMENTS',
  RESERVATION = 'RESERVATION',
}

export enum ProductNames {
  CREATE_WITH = 'CREATE_WITH',
  FRONT_DESK = 'FRONT_DESK',
  FREDDIE = 'FREDDIE',
  HEDA = 'HEDA',
  EMARK_IT = 'EMARK_IT',
  REV_MAXI = 'REV_MAXI', // Product
  COMPLAINT_TRACKER = 'COMPLAINT_TRACKER',
  CHANNEL_MANAGER = 'CHANNEL_MANAGER', // Product
  PREDICTO_PMS = 'PREDICTO_PMS',

  REPORTS = 'REPORTS', // remove

  POS = 'POS',
}

export enum ModuleNames {
  //Dashboard
  Home = 'HOME',

  // Create with
  CREATE_WITH = 'CREATE_WITH',
  CREATE_WITH_HOME = 'CREATE_WITH_HOME',
  CREATE_WITH_DASHBOARD = 'CREATE_WITH_DASHBOARD',
  SEO_FRIENDLY = 'MARKETING_SEO',
  PAGES = 'PAGES',
  BLOG = 'BLOG',
  BOOKING_ENGINE = 'BOOKING_ENGINE',
  MARKETING_SEO = 'MARKETING_SEO',
  BUILDER = 'BUILDER',

  // Front Desk
  FRONT_DESK = 'FRONT_DESK', // Product
  FRONT_DESK_HOME = 'FRONT_DESK_HOME',
  FRONT_DESK_DASHBOARD = 'FRONT_DESK_DASHBOARD',
  IN_HOUSE_GUEST = 'IN_HOUSE_GUEST',
  RESERVATION = 'RESERVATION',
  ADD_RESERVATION = 'ADD_RESERVATION',
  HOUSEKEEPING = 'HOUSEKEEPING',

  // Freddie
  FREDDIE = 'FREDDIE',
  FREDDIE_HOME = 'FREDDIE_HOME',
  CONVERSATION_DASHBOARD = 'CONVERSATION_DASHBOARD',
  LIVE_MESSAGING = 'LIVE_MESSAGING',
  WHATSAPP_BOT = 'WHATSAPP_BOT',
  SENTIMENTAL_ANALYSIS_FREDDIE = 'SENTIMENTAL_ANALYSIS_FREDDIE',

  // Hedda
  HEDA = 'HEDA',
  HEDA_HOME = 'HEDA_HOME',
  HEDA_DASHBOARD = 'HEDA_DASHBOARD',
  FEEDBACK = 'FEEDBACK',
  FEEDBACK_TRANSACTIONAL = 'FEEDBACK_TRANSACTIONAL',
  SENTIMENTAL_ANALYSIS_HEDA = 'SENTIMENTAL_ANALYSIS_HEDA',

  // eMarkt_IT
  EMARK_IT = 'EMARK_IT',
  EMARK_IT_HOME = 'EMARK_IT_HOME',
  EMARK_IT_DASHBOARD = 'EMARK_IT_DASHBOARD',
  CAMPAIGN = 'CAMPAIGN',

  // Library
  LIBRARY = 'LIBRARY',
  PACKAGES = 'PACKAGES',
  LISTING = 'LISTING',
  TOPIC = 'TOPIC',
  ASSET = 'ASSET',
  TEMPLATE = 'TEMPLATE',
  SERVICES = 'SERVICES',
  OFFERS = 'OFFERS',
  PACKAGE = 'PACKAGE',
  BOOKING_SOURCE = 'BOOKING_SOURCE',

  // Inventory
  INVENTORY = 'INVENTORY',
  ROOM = 'ROOM',

  // Outlet
  OUTLET = 'OUTLET',
  OUTLETS_DASHBOARD = 'OUTLETS_DASHBOARD',
  ALL_OUTLETS = 'ALL_OUTLETS',

  // POS
  POS_HOME = 'POS_HOME',
  POS_DASHBOARD = 'POS_DASHBOARD',
  KOT = 'KOT',
  TABLE_MANAGEMENT = 'TABLE_MANAGEMENT',

  // FINANCE
  FINANCE = 'FINANCE',
  INVOICE = 'INVOICE',
  TRANSACTIONS = 'TRANSACTIONS',

  // GUESTS
  GUEST_DASHBOARD = 'GUESTS_DASHBOARD',
  GUESTS = 'GUESTS',
  MEMBERS = 'MEMBERS',
  AGENT = 'AGENT',
  COMPANY = 'COMPANY',

  // CHANNEL MANAGER
  CHANNEL_MANAGER = 'CHANNEL_MANAGER', // Product
  CHANNEL_MANAGER_HOME = 'CHANNEL_MANAGER_HOME',
  MANAGE_INVENTORY = 'MANAGE_INVENTORY',
  MANAGE_RATE = 'MANAGE_RATE',
  DYNAMIC_PRICING = 'DYNAMIC_PRICING',
  UPDATE_INVENTORY = 'UPDATE_INVENTORY',
  UPDATE_RATES = 'UPDATE_RATES',

  // REVENUE MANAGER
  REV_MAXI = 'REV_MAXI', // Product
  REVENUE_MANAGER = 'REVENUE_MANAGER',
  SETUP_BAR_PRICE = 'SETUP_BAR_PRICE',

  //ComplaintTracker
  COMPLAINT_TRACKER = 'COMPLAINT_TRACKER',
  COMPLAINT_HOME = 'COMPLAINT_HOME',
  COMPLAINT_DASHBOARD = 'COMPLAINT_DASHBOARD',
  COMPLAINTS = 'COMPLAINTS',
  SERVICE_ITEM = 'SERVICE_ITEM',

  //Settings
  SETTINGS = 'SETTINGS',
  SUBSCRIPTION = 'SUBSCRIPTION',
  TAX = 'TAX',
  BUSINESS_INFO = 'BUSINESS_INFO',
  ACCEPT_PAYMENTS = 'ACCEPT_PAYMENTS',
  WEBSITE_SETTINGS = 'WEBSITE_SETTINGS',
  LEGAL_POLICY = ' LEGAL_POLICY',
  ROLES_AND_PERMISSION = 'ROLES_AND_PERMISSION',
  LEGAL_POLICIES = 'LEGAL_POLICIES',

  // Map ReportType values to SettingType
  REPORTS = 'REPORTS',
  RESERVATION_REPORTS = 'RESERVATION_REPORTS',
  MANAGER_REPORTS = 'MANAGER_REPORTS',
  OCCUPANCY_REPORTS = 'OCCUPANCY_REPORTS',
  REVENUE_REPORTS = 'REVENUE_REPORTS',
  FINANCIAL_REPORTS = 'FINANCIAL_REPORTS',
  NIGHT_AUDIT_REPORTS = 'NIGHT_AUDIT_REPORTS',
  TAX_REPORTS = 'TAX_REPORTS',
  GUEST_REPORTS = 'GUEST_REPORTS',
  ACTIVITY_REPORTS = 'ACTIVITY_REPORTS',
  ANALYTICS_REPORTS = 'ANALYTICS_REPORTS',
  DISCOUNT_REPORTS = 'DISCOUNTS_REPORTS',
  DIRECT_BILLING_REPORTS = 'DIRECT_BILLING_REPORTS',
  SOURCE_REPORTS = 'SOURCE_REPORTS',
  FOLIO_REPORTS = 'FOLIO_REPORTS',
  RATE_PACKAGE_REPORTS = 'RATE_PACKAGE_REPORTS',
  FUND_REPORTS = 'FUND_REPORTS',

  PREDICTO_PMS = 'PREDICTO_PMS',
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
  MESSENGER = 'MESSENGER_SUPPORT',
  EMAIL = 'EMAIL',
  EMAIL_SUPPORT = 'EMAIL_SUPPORT',
}

export const CommunicationConfig = {
  [Communication.MESSENGER]: {
    imageUrl: 'assets/images/mm.png',
    disabledImageUrl: 'assets/images/messenger-disabled.png',
  },
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
    imageUrl: 'assets/svg/telegram.svg',
    disabledImageUrl: 'assets/svg/telegram.svg',
  },
  [Communication.EMAIL]: {
    disabledImageUrl: 'assets/svg/email-02.svg',
    imageUrl: 'assets/svg/email-02.svg',
  },
  [Communication.EMAIL_SUPPORT]: {
    disabledImageUrl: 'assets/svg/email-02.svg',
    imageUrl: 'assets/svg/email-02.svg',
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
  [ModuleNames.FRONT_DESK_DASHBOARD]: {
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
  [ModuleNames.COMPLAINTS]: {
    cards: [],
    tables: [TableNames.REQUEST],
    filters: {
      [TableNames.REQUEST]: {
        tabFilters: [Filters.RESERVATION, Filters.INHOUSE],
      },
    },
  },
};
export type ProductMenu = {
  title: string;
  name: ModuleNames;
  icon: string;
  children?: ProductMenu[];
};

type Module = {
  name: ModuleNames;
  child?: ModuleNames[];
};
