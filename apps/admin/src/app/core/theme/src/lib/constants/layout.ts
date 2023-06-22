export enum UserDropdown {
  PROFILE = 'profile',
  LOGOUT = 'logout',
  MANAGE_SITES = 'manageSites',
}

export const layoutConfig = {
  profile: [
    { label: 'Go to my Profile', value: UserDropdown.PROFILE },
    { label: 'Manage Sites', value: UserDropdown.MANAGE_SITES },
    { label: 'Logout', value: UserDropdown.LOGOUT },
  ],

  feedback: {
    transactional: 'TRANSACTIONALFEEDBACK',
    stay: 'STAYFEEDBACK',
  },
  notificationDelayTime: 5,
};

/**
 * @constant customModule  [Menu Items]
 * These are default products, that are not subscription based
 * Add to get subscription api
 */
export const customModule = {
  finance: {
    name: 'FINANCE',
    label: 'Finance',
    description: 'Outlet Module',
    icon:
      'https://nyc3.digitaloceanspaces.com/botfiles/bot/subscription_icons/FrontDesk.svg',
    config: [
      {
        isSubscribed: true,
        isView: true,
        label: 'Invoice',
        name: 'INVOICE',
      },
      {
        isSubscribed: true,
        isView: true,
        label: 'Transaction',
        name: 'TRANSACTION',
      },
    ],
    isSubscribed: true,
    isView: true,
  },
  outlets: {
    name: 'OUTLET',
    label: 'Outlet',
    description: 'Outlet Module',
    icon:
      'https://nyc3.digitaloceanspaces.com/botfiles/bot/subscription_icons/FrontDesk.svg',
    config: [
      {
        isSubscribed: true,
        isView: true,
        label: 'Dashboard',
        name: 'OUTLETS_DASHBOARD',
      },
      {
        isSubscribed: true,
        isView: true,
        label: 'All Outlets',
        name: 'ALL_OUTLETS',
      },
    ],
    isSubscribed: true,
    isView: true,
  },
  channelManager: {
    name: 'CHANNEL_MANAGER',
    label: 'Channel Manager',
    description: 'Channel Manager Module',
    icon:
      'https://nyc3.digitaloceanspaces.com/botfiles/bot/subscription_icons/FrontDesk.svg',
    config: [
      {
        isSubscribed: true,
        isView: true,
        label: 'Update Inventory',
        name: 'UPDATE_INVENTORY',
      },
      {
        isSubscribed: true,
        isView: true,
        label: 'Update Rates',
        name: 'UPDATE_RATES',
      },
    ],
    isSubscribed: true,
    isView: true,
  },
  guests: {
    config: [
      {
        isSubscribed: true,
        isView: true,
        label: 'Agent',
        name: 'AGENT',
      },
      {
        isSubscribed: true,
        isView: true,
        label: 'Company',
        name: 'COMPANY',
      },
    ],
  },
};
