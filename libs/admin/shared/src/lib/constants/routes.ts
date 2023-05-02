import { ModuleNames } from './subscriptionConfig';

export const routes = {
  //Dashboard
  [ModuleNames.Home]: 'home',

  // Create with
  [ModuleNames.CREATE_WITH]: 'create-with',
  [ModuleNames.CREATE_WITH_DASHBOARD]: 'create-with/dashboard',
  [ModuleNames.SEO_FRIENDLY]: 'create-with/marketing-seo',
  [ModuleNames.THEME]: 'create-with/theme',
  [ModuleNames.PAGES]: 'create-with/page',
  [ModuleNames.BLOG]: 'create-with/blog',
  [ModuleNames.BOOKING_ENGINE]: 'create-with/booking-engine',

  // Front Desk
  [ModuleNames.FRONT_DESK]: 'efrontdesk',
  [ModuleNames.FRONT_DESK_DASHBOARD]: 'efrontdesk/dashboard',
  [ModuleNames.REQUEST_DASHBOARD]: 'efrontdesk/request-analytics',
  [ModuleNames.REQUEST]: 'efrontdesk/request',
  [ModuleNames.ADD_RESERVATION]: 'efrontdesk/manage-reservation',

  // Freddie
  [ModuleNames.FREDDIE]: 'freddie',
  [ModuleNames.CONVERSATION_DASHBOARD]: 'freddie/conversation-analytics',
  [ModuleNames.LIVE_MESSAGING]: 'freddie/messages',

  // Hedda
  [ModuleNames.HEDA]: 'heda',
  [ModuleNames.HEDA_DASHBOARD]: 'heda/analytics',
  [ModuleNames.SENTIMENTAL_ANALYSIS]: 'heda/sentimental-analysis',

  // eMarkt_IT
  [ModuleNames.EMARK_IT]: 'marketing',
  [ModuleNames.EMARK_IT_DASHBOARD]: 'marketing/analytics',
  [ModuleNames.CAMPAIGN]: 'marketing/campaign',

  // Library
  [ModuleNames.LIBRARY]: 'library',
  [ModuleNames.PACKAGES]: 'library/packages',
  [ModuleNames.LISTING]: 'library/listing',
  [ModuleNames.TOPIC]: 'library/topic',
  [ModuleNames.ASSET]: 'library/assets',
  [ModuleNames.TEMPLATE]: 'library/template',
  [ModuleNames.PACKAGE]: 'library/package',
  [ModuleNames.SERVICES]: 'library/services',
  [ModuleNames.OFFERS]: 'library/offers',

  // Inventory
  [ModuleNames.INVENTORY]: 'inventory',
  [ModuleNames.ROOM]: 'inventory/room',

  // FINANCE
  [ModuleNames.FINANCE]: 'finance',

  // GUESTS
  [ModuleNames.GUESTS]: 'guest',
  [ModuleNames.GUESTS_DASHBOARD]: 'guest/dashboard',

  // SUBSCRIPTION
  [ModuleNames.SETTINGS]: 'settings',
  [ModuleNames.SUBSCRIPTION]: 'subscription',

  RoleAndPermission: 'roles-permissions',
};
