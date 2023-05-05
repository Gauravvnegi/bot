export enum SettingOptions {
  BUSINESS_INFO = 'BUSINESS_INFO',
  WEBSITE_SETTING = 'WEBSITE_SETTING',
  ACCEPT_PAYMENTS = 'ACCEPT_PAYMENTS',
  NOTIFICATION = 'NOTIFICATION',
  SUBSCRIPTION = 'SUBSCRIPTION',
  LEGAL_POLICIES = 'LEGAL_POLICIES',
  ROLES_AND_PERMISSION = 'ROLES_AND_PERMISSION',
  TAX = 'TAX',
}

export const siteUrl = {
  [SettingOptions.BUSINESS_INFO]: '/admin/dashboard/edit-business-info',
  [SettingOptions.WEBSITE_SETTING]: '/admin/website-settings',
  [SettingOptions.ACCEPT_PAYMENTS]: '/admin/onboard-payment',
  [SettingOptions.LEGAL_POLICIES]: '/admin/legal-policy',
  [SettingOptions.TAX]: '/admin/tax',
};
