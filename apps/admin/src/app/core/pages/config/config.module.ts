import { ModuleNames, SubscriptionConfig } from 'libs/admin/shared/src/index';

export const moduleConfig: Partial<Record<ModuleNames, any>> = {
  //Create With - all submodule will have same module as the external (Iframe)
  [ModuleNames.CREATE_WITH_DASHBOARD]: () =>
    import('@hospitality-bot/admin/create-with').then(
      (m) => m.AdminCreateWithModule
    ),
  [ModuleNames.SEO_FRIENDLY]: () =>
    import('@hospitality-bot/admin/create-with').then(
      (m) => m.AdminCreateWithModule
    ),
  [ModuleNames.PAGES]: () =>
    import('@hospitality-bot/admin/create-with').then(
      (m) => m.AdminCreateWithModule
    ),
  [ModuleNames.BLOG]: () =>
    import('@hospitality-bot/admin/create-with').then(
      (m) => m.AdminCreateWithModule
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
};
