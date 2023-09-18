import { ModuleNames } from './subscriptionConfig';

export const routes = {
  //Dashboard
  [ModuleNames.Home]: 'home',

  // Create with
  [ModuleNames.CREATE_WITH]: 'create-with',
  [ModuleNames.CREATE_WITH_DASHBOARD]: 'create-with/dashboard',
  [ModuleNames.SEO_FRIENDLY]: 'create-with/marketing-seo',
  [ModuleNames.PAGES]: 'create-with/page',
  [ModuleNames.BLOG]: 'create-with/blog',
  [ModuleNames.BOOKING_ENGINE]: 'create-with/booking-engine',

  // Front Desk
  [ModuleNames.FRONT_DESK]: 'efrontdesk',
  [ModuleNames.FRONT_DESK_DASHBOARD]: 'efrontdesk/dashboard',
  [ModuleNames.IN_HOUSE_GUEST]: 'efrontdesk/in-house-guest',
  [ModuleNames.REQUEST_DASHBOARD]: 'efrontdesk/complaint-analytics',
  [ModuleNames.REQUEST]: 'efrontdesk/complaint',
  [ModuleNames.ADD_RESERVATION]: 'efrontdesk/reservation',
  [ModuleNames.ROOM]: 'efrontdesk/room',
  [ModuleNames.HOUSEKEEPING]: 'efrontdesk/housekeeping',

  // Freddie
  [ModuleNames.FREDDIE]: 'freddie',
  [ModuleNames.CONVERSATION_DASHBOARD]: 'freddie/conversation-analytics',
  [ModuleNames.LIVE_MESSAGING]: 'freddie/messages',
  // [ModuleNames.SENTIMENTAL_ANALYSIS_FREDDIE]: 'freddie/sentimental-analysis',

  // Hedda
  [ModuleNames.HEDA]: 'heda',
  [ModuleNames.HEDA_DASHBOARD]: 'heda/analytics',
  [ModuleNames.SENTIMENTAL_ANALYSIS_HEDA]: 'heda/sentimental-analysis',
  [ModuleNames.FEEDBACK]: 'heda/feedback',

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
  [ModuleNames.BOOKING_SOURCE]: 'library/booking-source',

  // Inventory
  [ModuleNames.INVENTORY]: 'inventory',
  // [ModuleNames.ROOM]: 'inventory/room',

  // FINANCE
  [ModuleNames.FINANCE]: 'finance',
  [ModuleNames.INVOICE]: 'finance/invoice',
  [ModuleNames.TRANSACTIONS]: 'finance/transactions',

  // MEMBERS
  [ModuleNames.MEMBERS]: 'members',
  [ModuleNames.GUESTS]: 'members/guests',
  [ModuleNames.GUEST_DASHBOARD]: 'members/guest-dashboard',
  [ModuleNames.AGENT]: 'members/agent',
  [ModuleNames.COMPANY]: 'members/company',

  // SETTINGS
  [ModuleNames.SETTINGS]: 'settings',

  //OUTLET
  // [ModuleNames.OUTLET]: 'outlet',
  // [ModuleNames.OUTLETS_DASHBOARD]: 'outlet/dashboard',
  // [ModuleNames.ALL_OUTLETS]: 'outlet/all-outlets',

  //CHANNEL_MANAGER
  [ModuleNames.CHANNEL_MANAGER]: 'channel-manager',
  [ModuleNames.MANAGE_RATE]: 'channel-manager/update-rates',
  [ModuleNames.MANAGE_INVENTORY]: 'channel-manager/update-inventory',
  [ModuleNames.DYNAMIC_PRICING]: 'channel-manager/dynamic-pricing',

  //REVENUE_MANAGER
  [ModuleNames.REVENUE_MANAGER]: 'revenue-manager',
  [ModuleNames.REVENUE_DYNAMIC_PRICING]: 'revenue-manager/dynamic-pricing',
  [ModuleNames.REVENUE_SETUP_BAR_PRICE]: 'revenue-manager/setup-bar-price',

  RoleAndPermission: 'roles-permissions',
};
