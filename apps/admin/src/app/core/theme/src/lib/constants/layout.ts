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
  settings: {
    name: 'SETTINGS',
    label: 'Settings',
    description: 'SETTINGS MODULE',
    icon: 'assets/svg/settings.svg',
    config: [
      {
        cost: {
          cost: 0,
          usageLimit: 20000,
        },
        currentUsage: 0,
        description: 'Set your business name, logo, location and contact info.',
        featureId: 'ee8373bvcdfghja4-5ddb-4253-87e7-1bbe093fe220',
        icon: 'assets/svg/briefcase.svg',
        isSubscribed: true,
        isView: true,
        label: 'Business info',
        name: 'BUSINESS_INFO',
      },
      {
        cost: {
          cost: 0,
          usageLimit: 20000,
        },
        currentUsage: 0,
        description: 'Manage your site’s name, URL, favicon and more.',
        featureId: 'ee8373bvcdfghja4-5ddb-4253-87e7-1bbe093fe220',
        icon: 'assets/svg/internet.svg',
        isSubscribed: true,
        isView: true,
        label: 'Website settings',
        name: 'WEBSITE_SETTING',
      },
      {
        cost: {
          cost: 0,
          usageLimit: 20000,
        },
        currentUsage: 0,
        description: 'Choose the way you get paid by customers.',
        featureId: 'ee8373bvcdfghja4-5ddb-4253-87e7-1bbe093fe220',
        icon: 'assets/svg/dollar-currency-symbol.svg',
        isSubscribed: true,
        isView: true,
        label: 'Accept payments',
        name: 'ACCEPT_PAYMENTS',
      },
      {
        cost: {
          cost: 0,
          usageLimit: 20000,
        },
        currentUsage: 0,
        description: 'Choose which notifications you get from us.',
        featureId: 'ee8373bvcdfghja4-5ddb-4253-87e7-1bbe093fe220',
        icon: 'assets/svg/bell-setting.svg',
        isSubscribed: true,
        isView: true,
        label: 'Notifications',
        name: 'NOTIFICATION',
      },
      {
        cost: {
          cost: 0,
          usageLimit: 20000,
        },
        currentUsage: 0,
        description: 'Compare website plans and upgrade your subscription.',
        featureId: 'ee8373bvcdfghja4-5ddb-4253-87e7-1bbe093fe220',
        icon: 'assets/svg/businessman.svg',
        isSubscribed: true,
        isView: true,
        label: 'Subscription',
        name: 'SUBSCRIPTION',
      },
      {
        cost: {
          cost: 0,
          usageLimit: 20000,
        },
        currentUsage: 0,
        description:
          'Invite people to work on this site and set their permissions.',
        featureId: 'ee8373bvcdfghja4-5ddb-4253-87e7-1bbe093fe220',
        icon: 'assets/svg/lock.svg',
        isSubscribed: true,
        isView: true,
        label: 'Roles & permissions',
        name: 'ROLES_AND_PERMISSION',
      },
      {
        cost: {
          cost: 0,
          usageLimit: 20000,
        },
        currentUsage: 0,
        description:
          'Invite people to work on this site and set their permissions.',
        featureId: 'ee8373bvcdfghja4-5ddb-4253-87e7-1bbe093fe220',
        icon: 'assets/svg/insurance.svg',
        isSubscribed: true,
        isView: true,
        label: 'Legal Policies',
        name: 'LEGAL_POLICIES',
      },
      {
        cost: {
          cost: 0,
          usageLimit: 20000,
        },
        currentUsage: 0,
        description:
          'Invite people to work on this site and set their permissions.',
        featureId: 'ee8373bvcdfghja4-5ddb-4253-87e7-1bbe093fe220',
        icon: 'assets/svg/insurance.svg',
        isSubscribed: true,
        isView: true,
        label: 'Tax',
        name: 'TAX',
      },
    ],
    isSubscribed: true,
    isView: true,
  },
};
