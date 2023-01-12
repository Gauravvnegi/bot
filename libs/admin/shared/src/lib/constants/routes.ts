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

  // Freddie
  [ModuleNames.FREDDIE]: 'freddie',
  [ModuleNames.CONVERSATION_DASHBOARD]: 'freddie/conversation-analytics',
  [ModuleNames.LIVE_MESSAGING]: 'freddie/messages',

  // Hedda
  [ModuleNames.HEDA]: 'heda',
  [ModuleNames.HEDA_DASHBOARD]: 'heda/analytics',

  // eMarkt_IT
  [ModuleNames.EMARK_IT]: 'marketing',
  [ModuleNames.EMARK_IT_DASHBOARD]: 'marketing/analytics',
  [ModuleNames.CAMPAIGN]: 'marketing/campaign',

  // Library
  [ModuleNames.LIBRARY]: 'library',
  [ModuleNames.PACKAGES]: 'library/package',
  [ModuleNames.LISTING]: 'library/listing',
  [ModuleNames.TOPIC]: 'library/topic',
  [ModuleNames.ASSET]: 'library/assets',
  [ModuleNames.TEMPLATE]: 'library/template',

  // Inventory
  [ModuleNames.INVENTORY]: 'inventory',
  [ModuleNames.ROOM]: 'inventory/room',

  // FINANCE
  [ModuleNames.FINANCE]: 'finance',

  // GUESTS
  [ModuleNames.GUESTS]: 'guest',
  [ModuleNames.GUESTS_DASHBOARD]: 'guest/dashboard',

  // SUBSCRIPTION
  [ModuleNames.SUBSCRIPTION]: 'subscription',

  RoleAndPermission: 'roles-permissions',
};
