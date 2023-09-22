export enum ModuleNames {
  //Dashboard
  Home = 'HOME',

  // Create with
  CREATE_WITH = 'CREATE_WITH',
  CREATE_WITH_DASHBOARD = 'CREATE_WITH_DASHBOARD',
  SEO_FRIENDLY = 'MARKETING_SEO',
  PAGES = 'PAGES',
  BLOG = 'BLOG',
  BOOKING_ENGINE = 'BOOKING_ENGINE',
  MARKETING_SEO = 'MARKETING_SEO',
  BUILDER = 'BUILDER',

  // Front Desk
  FRONT_DESK = 'FRONT_DESK',
  FRONT_DESK_DASHBOARD = 'FRONT_DESK_DASHBOARD',
  IN_HOUSE_GUEST = 'IN_HOUSE_GUEST',
  REQUEST_DASHBOARD = 'REQUEST_DASHBOARD',
  REQUEST = 'REQUEST',
  RESERVATION = 'RESERVATION',
  ADD_RESERVATION = 'ADD_RESERVATION',

  // Freddie
  FREDDIE = 'FREDDIE',
  CONVERSATION_DASHBOARD = 'CONVERSATION_DASHBOARD',
  LIVE_MESSAGING = 'LIVE_MESSAGING',
  WHATSAPP_BOT = 'WHATSAPP_BOT',
  SENTIMENTAL_ANALYSIS_FREDDIE = 'SENTIMENTAL_ANALYSIS_FREDDIE',

  // Hedda
  HEDA = 'HEDA',
  HEDA_DASHBOARD = 'HEDA_DASHBOARD',
  FEEDBACK = 'FEEDBACK',
  FEEDBACK_TRANSACTIONAL = 'FEEDBACK_TRANSACTIONAL',
  SENTIMENTAL_ANALYSIS_HEDA = 'SENTIMENTAL_ANALYSIS_HEDA',

  // eMarkt_IT
  EMARK_IT = 'eMARK_IT',
  EMARK_IT_DASHBOARD = 'eMARK_IT_DASHBOARD',
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
  CHANNEL_MANAGER = 'CHANNEL_MANAGER',
  MANAGE_INVENTORY = 'MANAGE_INVENTORY',
  MANAGE_RATE = 'MANAGE_RATE',
  DYNAMIC_PRICING = 'DYNAMIC_PRICING',

  // REVENUE MANAGER
  REVENUE_MANAGER = 'REVENUE_MANAGER',
  SETUP_BAR_PRICE = 'SETUP_BAR_PRICE',

  //Settings
  SETTINGS = 'SETTINGS',
  SUBSCRIPTION = 'SUBSCRIPTION',

  //RevMaxi
  REVMAXI = 'REVMAXI',

  //BookConnectLive
  BOOKCONNECT_LIVE = 'BOOKCONNECT_LIVE',

  //ComplaintTrackr
  COMPLAINT_TRACKR = 'COMPLAINT_TRACKR',

  //PredictoPMS
  PREDICT_PMS = 'PREDICT_PMS',

  //hotel-in-box
  HOTEL_IN_BOX = 'HOTEL_IN_BOX',
}

export const productMenu: ProductMenu[] = [
  //productMenu
  {
    label: 'efrontdesk',
    name: ModuleNames.FRONT_DESK,
    icon: 'assets/images/efrontdesk.png',
    module: [
      {
        name: ModuleNames.FRONT_DESK,
        child: [
          // ModuleNames.FRONT_DESK,
          ModuleNames.FRONT_DESK_DASHBOARD,
          ModuleNames.REQUEST,
        ],
      },
      {
        name: ModuleNames.MEMBERS,
        child: [ModuleNames.GUESTS],
      },
      {
        name: ModuleNames.FINANCE,
        child: [ModuleNames.INVOICE, ModuleNames.TRANSACTIONS],
      },
      {
        name: ModuleNames.LIBRARY,
        child: [ModuleNames.PACKAGES, ModuleNames.OFFERS, ModuleNames.SERVICES],
      },
    ],
  },
  {
    label: 'heda',
    name: ModuleNames.HEDA,
    icon: 'assets/images/efrontdesk.png',
    module: [
      {
        name: ModuleNames.HEDA,
        child: [ModuleNames.HEDA_DASHBOARD, ModuleNames.FEEDBACK],
      },
      {
        name: ModuleNames.MEMBERS,
        child: [ModuleNames.GUESTS],
      },
    ],
  },
  {
    label: 'Hotel in a Box',
    name: ModuleNames.HOTEL_IN_BOX,
    icon: 'assets/images/hotel-in-box.png',
    module: [
      {
        name: ModuleNames.MEMBERS,
        child: [ModuleNames.GUESTS],
      },

      {
        name: ModuleNames.LIBRARY,
        child: [ModuleNames.PACKAGES, ModuleNames.OFFERS, ModuleNames.SERVICES],
      },
    ],
  },
  {
    label: 'RevMaxi',
    name: ModuleNames.REVMAXI,
    icon: 'assets/images/createwith.png',
    module: [],
  },
  {
    label: 'BookConnectLive',
    name: ModuleNames.BOOKCONNECT_LIVE,
    icon: 'assets/images/bookConnectLive.png',
    module: [],
  },
  {
    label: 'eMark-IT',
    name: ModuleNames.EMARK_IT,
    icon: 'assets/images/hotel-in-box.png',
    module: [
      {
        name: ModuleNames.EMARK_IT,
        child: [ModuleNames.EMARK_IT_DASHBOARD, ModuleNames.CAMPAIGN],
      },
    ],
  },
  {
    label: 'Createwith',
    name: ModuleNames.CREATE_WITH,
    icon: 'assets/images/hotel-in-box.png',
    module: [
      {
        name: ModuleNames.CREATE_WITH,
        child: [
          ModuleNames.CREATE_WITH_DASHBOARD,
          ModuleNames.PAGES,
          ModuleNames.BLOG,
          ModuleNames.MARKETING_SEO,
          ModuleNames.BUILDER,
        ],
      },
      {
        name: ModuleNames.MEMBERS,
        child: [ModuleNames.GUESTS],
      },
      {
        name: ModuleNames.LIBRARY,
        child: [ModuleNames.PACKAGES, ModuleNames.OFFERS, ModuleNames.SERVICES],
      },
    ],
  },
  {
    label: 'ComplaintTrackr',
    name: ModuleNames.COMPLAINT_TRACKR,
    icon: 'assets/images/bookConnectLive.png',
    module: [],
  },
  {
    label: 'PredictoPMS',
    name: ModuleNames.PREDICT_PMS,
    icon: 'assets/images/hotel-in-box.png',
    module: [],
  },
];

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
  [ModuleNames.REQUEST]: {
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
  label: string;
  name: ModuleNames;
  icon: string;
  module?: Module[];
};

type Module = {
  name: ModuleNames;
  child?: ModuleNames[];
};
