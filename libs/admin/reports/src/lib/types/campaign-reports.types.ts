export type emailCampaignReportData = {
  name: string;
  channel: string;
  status: boolean;
  delivered: number;
  opened: number;
  unOpened: number;
  clicked: number;
  failed: number;
  createdBy: string;
};

export type emailMarketingTemplateReportData = {
  name: string;
  channel: string;
  active: boolean;
  createdBy: string;
  updatedBy: string;
};

export type whatsappCampaignReportData = {
  name: string;
  channel: string;
  status: boolean;
  sent: number;
  delivered: number;
  read: number;
  failed: number;
  createdBy: string;
};

export type whatsappMarketingTemplateReportData = {
  name: string;
  channel: string;
  active: boolean;
  createdBy: string;
  updatedBy: string;
};

type CampaignReportResponse = {
  active: boolean;
  archieved: boolean;
  bcc: string[];
  campaignType: string;
  cc: string[];
  channel: string;
  createdAt: number;
  createdBy: string;
  dateTime: number;
  delayTime: number;
  entityId: string;
  id: string;
  isDraft: boolean;
  isSchedule: boolean;
  message: string;
  sentCount: number;
  statsCampaign: {
    clicked: number;
    delivered: number;
    failed: number;
    opened: number;
    read: number;
    sent: number;
    unopened: number;
  };
  tags: string[];
  templateId: string;
  templateName: string;
  to: {
    listing: {
      name: string;
      receiverId: string;
    }[];

    subscribers: string[];
  };
  updatedAt: number;
  updatedBy: string;
  zoneId: string;
};

export type emailCampaignReportResponse = CampaignReportResponse & {
  from: string;
  subject: {
    firstName: string;
    lastName: string;
    salutation: string;
    text: string;
  };
};

export type whatsappCampaignReportResponse = CampaignReportResponse & {};

type MarketingTemplateReportResponse = {
  active: boolean;
  channel: string;
  createdAt: number;
  createdBy: string;
  description: string;
  entityId: string;
  htmlTemplate: string;
  isShared: boolean;
  name: string;
  templateType: string;
  updatedAt: number;
  updatedBy: string;
  userId: string;
};

export type emailMarketingTemplateReportResponse = MarketingTemplateReportResponse & {
  id: string;
};

export type whatsappMarketingTemplateReportResponse = MarketingTemplateReportResponse;
