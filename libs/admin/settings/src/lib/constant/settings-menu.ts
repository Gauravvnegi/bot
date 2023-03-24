export enum SettingOptions {
  BUSINESS_INFO = 'business-info',
  WEBSITE_SETTING = 'website-settings',
  ACCEPT_PAYMENTS = 'accept-payments',
  NOTIFICATION = 'notifications',
  SUBSCRIPTION = 'subscription',
  LEGAL_POLICIES = 'legal-policies',
  ROLES_AND_PERMISSION = 'roles-and-permissions',
}

export const siteUrl = {
  [SettingOptions.BUSINESS_INFO]: '/admin/dashboard/edit-business-info',
  [SettingOptions.WEBSITE_SETTING]: '/admin/website-settings',
  [SettingOptions.ACCEPT_PAYMENTS]: '/admin/onboard-payment',
  [SettingOptions.LEGAL_POLICIES]: '/admin/legal-policy',
};

export const settingsMenuOptions: SettingsMenuComponent[] = [
  {
    name: SettingOptions.BUSINESS_INFO,
    title: 'Business info',
    description: 'Set your business name, logo, location and contact info.',
    icon: 'assets/svg/briefcase.svg',
  },
  {
    name: SettingOptions.WEBSITE_SETTING,
    title: 'Website settings',
    description: 'Manage your site’s name, URL, favicon and more.',
    icon: 'assets/svg/internet.svg',
  },
  {
    name: SettingOptions.ACCEPT_PAYMENTS,
    title: 'Accept payments',
    description: 'Choose the way you get paid by customers.',
    icon: 'assets/svg/dollar-currency-symbol.svg',
  },
  {
    name: SettingOptions.NOTIFICATION,
    title: 'Notifications',
    description: 'Choose which notifications you get from us.',
    icon: 'assets/svg/bell-setting.svg',
  },
  {
    name: SettingOptions.SUBSCRIPTION,
    title: 'Subscription',
    description: 'Compare website plans and upgrade your subscription.',
    icon: 'assets/svg/businessman.svg',
  },
  {
    name: SettingOptions.ROLES_AND_PERMISSION,
    title: 'Roles & permissions',
    description:
      'Invite people to work on this site and set their permissions.',
    icon: 'assets/svg/lock.svg',
  },
  {
    name: SettingOptions.LEGAL_POLICIES,
    title: 'Legal Policies',
    description:
      'Invite people to work on this site and set their permissions.',
    icon: 'assets/svg/insurance.svg',
  },
];

export type SettingsMenuComponent = {
  name: SettingOptions;
  title: string;
  description: string;
  icon: string;
};
