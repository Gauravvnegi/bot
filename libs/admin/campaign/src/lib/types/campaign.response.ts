import { CampaignType } from './campaign.type';

export type CampaignResponse = {
  active: boolean;
  archieved: boolean;
  bcc: string[];
  cc: string[];
  campaignType: string;
  channel: CampaignType;
  dateTime: number;
  delayTime: number;
  created: number;
  entityId: string;
  from: string;
  id: string;
  isDraft: boolean;
  isSchedule: boolean;
  message: string;
  sentCount: number;
  name: string;
  statsCampaign: {
    delivered: number;
    unopened: number;
    clicked: number;
    opened: number;
    failed: number;
    read: number;
    sent: number;
  };
  subject: {
    firstName: string;
    lastName: string;
    salutation: string;
    text: string;
  };
  tags: string[];
  templateName: string;
  templateId: string;
  to: {
    individual: string[];
    subscribers: string[];
    listing: string[];
  };
  topicId: string;
  topicName: string;
  zoneId: string;
  updatedAt: number;
};
