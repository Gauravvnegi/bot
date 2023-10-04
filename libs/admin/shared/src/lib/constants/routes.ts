import { ModuleNames } from './subscriptionConfig';

export const routes = {
  //Dashboard
  [ModuleNames.Home]: 'home',

  // Create with
  [ModuleNames.CREATE_WITH_HOME]: 'create-with',
  [ModuleNames.CREATE_WITH_DASHBOARD]: 'create-with/dashboard',
  [ModuleNames.SEO_FRIENDLY]: 'create-with/marketing-seo',
  [ModuleNames.PAGES]: 'create-with/page',
  [ModuleNames.BLOG]: 'create-with/blog',
  [ModuleNames.BOOKING_ENGINE]: 'create-with/booking-engine',

  // Front Desk
  [ModuleNames.FRONT_DESK_HOME]: 'efrontdesk',
  [ModuleNames.FRONT_DESK_DASHBOARD]: 'efrontdesk/dashboard',
  [ModuleNames.IN_HOUSE_GUEST]: 'efrontdesk/in-house-guest',
  [ModuleNames.COMPLAINT_DASHBOARD]: 'efrontdesk/complaint-analytics',
  [ModuleNames.COMPLAINTS]: 'efrontdesk/complaint',
  [ModuleNames.ADD_RESERVATION]: 'efrontdesk/reservation',
  [ModuleNames.ROOM]: 'efrontdesk/room',
  [ModuleNames.HOUSEKEEPING]: 'efrontdesk/housekeeping',

  // Freddie
  [ModuleNames.FREDDIE_HOME]: 'freddie',
  [ModuleNames.CONVERSATION_DASHBOARD]: 'freddie/conversation-analytics',
  [ModuleNames.LIVE_MESSAGING]: 'freddie/messages',
  // [ModuleNames.SENTIMENTAL_ANALYSIS_FREDDIE]: 'freddie/sentimental-analysis',

  // Hedda
  [ModuleNames.HEDA_HOME]: 'heda',
  [ModuleNames.HEDA_DASHBOARD]: 'heda/analytics',
  [ModuleNames.SENTIMENTAL_ANALYSIS_HEDA]: 'heda/sentimental-analysis',
  [ModuleNames.FEEDBACK]: 'heda/feedback',

  // eMarkt_IT
  [ModuleNames.eMARK_IT_HOME]: 'marketing',
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
  [ModuleNames.CHANNEL_MANAGER_HOME]: 'channel-manager',
  [ModuleNames.MANAGE_RATE]: 'channel-manager/update-rates',
  [ModuleNames.MANAGE_INVENTORY]: 'channel-manager/update-inventory',

  //REVENUE_MANAGER
  [ModuleNames.REVENUE_MANAGER]: 'revenue-manager',
  [ModuleNames.DYNAMIC_PRICING]: 'revenue-manager/dynamic-pricing',
  [ModuleNames.SETUP_BAR_PRICE]: 'revenue-manager/setup-bar-price',

  RoleAndPermission: 'roles-permissions',
};
