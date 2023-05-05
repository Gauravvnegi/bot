export enum SettingOptions {
  BUSINESS_INFO = 'BUSINESS_INFO',
  WEBSITE_SETTINGS = 'WEBSITE_SETTINGS',
  ACCEPT_PAYMENTS = 'ACCEPT_PAYMENTS',
  NOTIFICATION = 'NOTIFICATION',
  SUBSCRIPTION = 'SUBSCRIPTION',
  LEGAL_POLICIES = 'LEGAL_POLICIES',
  ROLES_AND_PERMISSION = 'ROLES_AND_PERMISSION',
  TAX = 'TAX',
}

export const routeUrl = {
  [SettingOptions.BUSINESS_INFO]: 'business-info',
  [SettingOptions.WEBSITE_SETTINGS]: 'website-settings',
  [SettingOptions.ACCEPT_PAYMENTS]: 'accept-payments',
  [SettingOptions.NOTIFICATION]: 'notifications',
  [SettingOptions.SUBSCRIPTION]: 'subscription',
  [SettingOptions.LEGAL_POLICIES]: 'legal-policies',
  [SettingOptions.ROLES_AND_PERMISSION]: 'roles-and-permissions',
  [SettingOptions.TAX]: 'tax',
};

export const siteUrl = {
  [routeUrl[SettingOptions.BUSINESS_INFO]]:
    '/admin/dashboard/edit-business-info',
  [routeUrl[SettingOptions.WEBSITE_SETTINGS]]: '/admin/website-settings',
  [routeUrl[SettingOptions.ACCEPT_PAYMENTS]]: '/admin/onboard-payment',
  [routeUrl[SettingOptions.LEGAL_POLICIES]]: '/admin/legal-policy',
  [routeUrl[SettingOptions.TAX]]: '/admin/tax',
};
