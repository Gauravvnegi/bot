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
 * @constant defaultProduct  [Menu Items]
 * These are default products, that are not subscription based
 * Add to get subscription api
 */
export const defaultProduct = [
  {
    name: 'SETTINGS',
    label: 'Settings',
    description: 'Settings Page',
    icon: 'assets/svg/settings.svg',
    config: [],
    isSubscribed: true,
    isView: true,
  },
];
export const customModule = {
  bookingSource: {
    cost: { cost: 0, usageLimit: 20000 },
    currentUsage: 0,
    description:
      'Never miss an opportunity to connect with guests by automating communication and strengthening guest relationships',
    featureId: 'ee8373bvcdfghja4-5ddb-4253-87e7-1bbe093fe220',
    icon:
      'https://nyc3.digitaloceanspaces.com/botfiles/bot/subscription_icons/template.svg',
    isSubscribed: true,
    isView: true,
    label: 'Booking Source',
    name: 'BOOKING_SOURCE',
  },
};
