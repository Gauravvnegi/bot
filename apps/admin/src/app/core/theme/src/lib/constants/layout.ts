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
