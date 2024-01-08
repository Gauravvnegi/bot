import {
  ModuleNames,
  ProductNames,
  SubscriptionConfig,
} from 'libs/admin/shared/src/index';

const CreateWithSubModule = () =>
  import('@hospitality-bot/admin/create-with').then(
    (m) => m.AdminCreateWithModule
  );

export const productConfig: Partial<Record<ModuleNames, any>> = {
  [ProductNames.CREATE_WITH]: CreateWithSubModule,
};

export const moduleConfig: Partial<Record<ModuleNames, any>> = {
  // Reports
  [ModuleNames.REPORTS]: () =>
    import('@hospitality-bot/admin/reports').then((m) => m.AdminReportsModule),
  [ModuleNames.CREATE_WITH_HOME]: CreateWithSubModule,
};

export const subModuleConfig: Partial<Record<ModuleNames, any>> = {
  // Settings Module
  [ModuleNames.TAX]: () =>
    import('@hospitality-bot/admin/tax').then((m) => m.AdminTaxModule),
  [ModuleNames.SUBSCRIPTION]: () =>
    import('@hospitality-bot/admin/subscription').then(
      (m) => m.AdminSubscriptionModule
    ),
  [ModuleNames.ROLES_AND_PERMISSION]: () =>
    import('@hospitality-bot/admin/roles-and-permissions').then(
      (m) => m.AdminRolesAndPermissionsModule
    ),

  // All submodule of create-with will have same module as the external (Iframe)
  //Create With Home sub modules - Can be loaded from module config
  // [ModuleNames.CREATE_WITH_DASHBOARD]: CreateWithSubModule,
  // [ModuleNames.SEO_FRIENDLY]: CreateWithSubModule,
  // [ModuleNames.PAGES]: CreateWithSubModule,
  // [ModuleNames.BLOG]: CreateWithSubModule,

  // Create with setting sub modules
  [ModuleNames.WEBSITE_SETTINGS]: CreateWithSubModule,
  [ModuleNames.ACCEPT_PAYMENTS]: CreateWithSubModule,
  [ModuleNames.LEGAL_POLICIES]: CreateWithSubModule,
  [ModuleNames.BUSINESS_INFO]: () =>
    import('@hospitality-bot/admin/business').then(
      (m) => m.AdminBusinessModule
    ),

  // front desk
  [ModuleNames.ADD_RESERVATION]: () =>
    import('@hospitality-bot/admin/manage-reservation').then(
      (m) => m.AdminManageReservationModule
    ),
  [ModuleNames.FRONT_DESK_DASHBOARD]: () =>
    import('@hospitality-bot/admin/dashboard').then(
      (m) => m.AdminDashboardModule
    ),
  [ModuleNames.HOUSEKEEPING]: () =>
    import('@hospitality-bot/admin/housekeeping').then(
      (m) => m.AdminHousekeepingModule
    ),
  [ModuleNames.ROOM]: () =>
    import('@hospitality-bot/admin/room').then((m) => m.AdminRoomModule),

  //freddie
  [ModuleNames.CONVERSATION_DASHBOARD]: () =>
    import('@hospitality-bot/admin/conversation-analytics').then(
      (m) => m.AdminConversationAnalyticsModule
    ),
  [ModuleNames.LIVE_MESSAGING]: () =>
    import('@hospitality-bot/admin/messages').then(
      (m) => m.AdminMessagesModule
    ),

  [ModuleNames.SENTIMENTAL_ANALYSIS_FREDDIE]: () =>
    import('@hospitality-bot/admin/sentimental-analysis').then(
      (m) => m.AdminSentimentalAnalysisModule
    ),

  //Heda
  [ModuleNames.HEDA_DASHBOARD]: () =>
    import('@hospitality-bot/admin/feedback-analytics').then(
      (m) => m.AdminFeedbackAnalyticsModule
    ),
  [ModuleNames.FEEDBACK]: () =>
    import('@hospitality-bot/admin/feedback').then(
      (m) => m.AdminFeedbackModule
    ),

  //emarkit
  [ModuleNames.EMARK_IT_DASHBOARD]: () =>
    import('@hospitality-bot/admin/marketing-dashboard').then(
      (m) => m.AdminMarketingDashboardModule
    ),
  [ModuleNames.CAMPAIGN]: () =>
    import('@hospitality-bot/admin/campaign').then(
      (m) => m.AdminCampaignModule
    ),

  //channel Manager
  [ModuleNames.MANAGE_INVENTORY]: () =>
    import('@hospitality-bot/admin/manage-inventory').then(
      (m) => m.AdminManageInventoryModule
    ),

  [ModuleNames.MANAGE_RATE]: () =>
    import('@hospitality-bot/admin/manage-rate').then(
      (m) => m.AdminManageRateModule
    ),

  // Revenue manager
  [ModuleNames.SETUP_BAR_PRICE]: () =>
    import('@hospitality-bot/admin/setup-bar-price').then(
      (m) => m.AdminSetupBarPriceModule
    ),

  [ModuleNames.DYNAMIC_PRICING]: () =>
    import('@hospitality-bot/admin/dynamic-pricing').then(
      (m) => m.AdminDynamicPricingModule
    ),

  //Complaint Tracker
  [ModuleNames.COMPLAINT_DASHBOARD]: () =>
    import('@hospitality-bot/admin/request-analytics').then(
      (m) => m.AdminRequestAnalyticsModule
    ),
  [ModuleNames.COMPLAINTS]: () =>
    import('@hospitality-bot/admin/request').then((m) => m.AdminRequestModule),

  // Library
  [ModuleNames.SERVICES]: () =>
    import('@hospitality-bot/admin/services').then(
      (m) => m.AdminServicesModule
    ),
  [ModuleNames.PACKAGES]: () =>
    import('@hospitality-bot/admin/packages').then(
      (m) => m.AdminPackagesModule
    ),
  [ModuleNames.LISTING]: () =>
    import('@hospitality-bot/admin/listing').then((m) => m.AdminListingModule),
  [ModuleNames.ASSET]: () =>
    import('@hospitality-bot/admin/assets').then((m) => m.AdminAssetsModule),
  [ModuleNames.TEMPLATE]: () =>
    import('@hospitality-bot/admin/template').then(
      (m) => m.AdminTemplateModule
    ),
  [ModuleNames.TOPIC]: () =>
    import('@hospitality-bot/admin/topic').then((m) => m.AdminTopicModule),
  [ModuleNames.OFFERS]: () =>
    import('@hospitality-bot/admin/offers').then((m) => m.AdminOffersModule),

  // Members
  [ModuleNames.GUESTS]: () =>
    import('@hospitality-bot/admin/guests').then((m) => m.AdminGuestsModule),
  [ModuleNames.AGENT]: () =>
    import('@hospitality-bot/admin/agent').then((m) => m.AdminAgentModule),
  [ModuleNames.COMPANY]: () =>
    import('@hospitality-bot/admin/company').then((m) => m.AdminCompanyModule),

  // Finance
  [ModuleNames.INVOICE]: () =>
    import('@hospitality-bot/admin/invoice').then((m) => m.AdminInvoiceModule),
  [ModuleNames.TRANSACTIONS]: () =>
    // This module to be rename as Transaction module
    import('@hospitality-bot/admin/finance').then((m) => m.AdminFinanceModule),

  // Pos
  // [ModuleNames.POS_DASHBOARD]: () =>
  //   import('@hospitality-bot/admin/outlets-dashboard').then(
  //     (m) => m.AdminOutletsDashboardModule
  //   ),

  [ModuleNames.TABLE_MANAGEMENT]: () =>
    import('@hospitality-bot/table-management').then(
      (m) => m.TableManagementModule
    ),
};
