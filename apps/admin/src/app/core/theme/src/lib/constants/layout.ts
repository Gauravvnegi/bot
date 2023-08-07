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
  revenueManager: {
    name: 'REVENUE_MANAGER',
    label: 'Revenue Manager',
    description: 'Revenue Manager Module',
    icon:
      'https://nyc3.digitaloceanspaces.com/botfiles/bot/subscription_icons/FrontDesk.svg',
    config: [
      {
        isSubscribed: true,
        isView: true,
        label: 'Dynamic Pricing',
        name: 'REVENUE_DYNAMIC_PRICING',
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
        label: 'Guest Dashboard',
        name: 'GUEST_DASHBOARD',
      },
      {
        isSubscribed: true,
        isView: true,
        label: 'Guests',
        name: 'GUESTS',
      },
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
