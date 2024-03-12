import { PageRoutes } from '@hospitality-bot/admin/shared';

export const navRoute = {
  campaignDataTable: {
    label: 'Campaign',
    link: './',
  },
  createCampaign: {
    label: 'Create Campaign',
    link: './',
  },
  editCampaign: {
    label: 'Edit Campaign',
    link: './',
  },
  addGuest: { label: 'Add Guest', link: './' },
};

export const campaignRoutes: Record<
  | 'campaign'
  | 'createWhatsappCampaign'
  | 'editWhatsappCampaign'
  | 'createEmailCampaign'
  | 'editEmailCampaign',
  PageRoutes
> = {
  campaign: {
    route: '',
    navRoutes: [],
    title: 'Campaign',
  },

  createEmailCampaign: {
    route: 'create-campaign',
    navRoutes: [navRoute.campaignDataTable, navRoute.createCampaign],
    title: 'Email Campaign',
  },

  editEmailCampaign: {
    route: 'edit-campaign',
    navRoutes: [navRoute.campaignDataTable, navRoute.editCampaign],
    title: 'Email Campaign',
  },

  createWhatsappCampaign: {
    route: 'create-campaign',
    navRoutes: [navRoute.campaignDataTable, navRoute.createCampaign],
    title: 'Whatsapp Campaign',
  },

  editWhatsappCampaign: {
    route: 'edit-campaign',
    navRoutes: [navRoute.campaignDataTable, navRoute.editCampaign],
    title: 'Whatsapp Campaign',
  },
};
