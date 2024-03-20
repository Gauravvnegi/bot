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
    link: './:id',
  },
  addGuest: { label: 'Add Guest', link: './' },
  template: { label: 'Template', link: './' },
};

export const campaignRoutes: Record<
  | 'campaign'
  | 'createWhatsappCampaign'
  | 'editWhatsappCampaign'
  | 'createEmailCampaign'
  | 'editEmailCampaign'
  | 'editTemplate'
  | 'createTemplate',
  PageRoutes
> = {
  campaign: {
    route: '',
    navRoutes: [],
    title: 'Campaign',
  },

  createEmailCampaign: {
    route: 'create-campaign',
    navRoutes: [navRoute.createCampaign],
    title: 'Email Campaign',
  },

  editEmailCampaign: {
    route: 'edit-campaign',
    navRoutes: [navRoute.editCampaign],
    title: 'Email Campaign',
  },

  createWhatsappCampaign: {
    route: 'create-campaign',
    navRoutes: [navRoute.createCampaign],
    title: 'Whatsapp Campaign',
  },

  editWhatsappCampaign: {
    route: 'edit-campaign',
    navRoutes: [navRoute.editCampaign],
    title: 'Whatsapp Campaign',
  },

  createTemplate: {
    route: 'template',
    navRoutes: [navRoute.createCampaign, navRoute.template],
    title: 'Template',
  },

  editTemplate: {
    route: 'template',
    navRoutes: [navRoute.editCampaign, navRoute.template],
    title: 'Template',
  },
};
