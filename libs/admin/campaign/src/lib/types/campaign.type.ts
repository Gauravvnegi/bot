import { IList } from 'libs/admin/listing/src/lib/data-models/listing.model';
import { CampaignFormData } from '../data-model/campaign.model';

export type QueryConfig = {
  queryObj: string;
};

export type SendersData = Record<
  'subscribers' | 'listing' | 'individual',
  string[]
>;

export type ReceiverFields = 'to' | 'cc' | 'bcc';

export type MessageObj = {
  key: string;
  message: string;
};

export type CampaignType = 'WHATSAPP' | 'EMAIL';

const CampaignState = {
  DOES_NOT_REPEAT: 'DOES_NOT_REPEAT',
  DAILY: 'DAILY',
  WEEKLY: 'WEEKLY',
  TRIGGERED: 'TRIGGERED',
} as const;

export type CampaignState = typeof CampaignState[keyof typeof CampaignState];

export type TemplateMode = 'backdrop' | 'edit' | 'view';

const TemplateType = {
  SAVED: 'SAVEDTEMPLATE',
  PREDESIGNED: 'PREDESIGNTEMPLATE',
} as const;

export type TemplateType = typeof TemplateType[keyof typeof TemplateType];

// export type ConstType<T extends Record<string, unknown>> = T[keyof T];

export type CampaignForm = Omit<CampaignFormData, 'deserialize'>;

export type RecipientType = 'LISTING' | 'SUBSCRIBER';

export type ListType<T extends RecipientType> = T extends 'LISTING'
  ? IList
  : { name: string; id: string };

export class PostCampaignForm {
  channel: CampaignType;
  to: {
    listing: string[];
    individual: string[];
  };
  name: string;
  isSchedule: boolean;
  // topicId: string
  from?: string;
  subject?: {
    text: string;
  };
  previewText?: string;
  message: string;
  templateId: string;
  campaignType?: string;
  testEmails?: [];
  tags: string[];
  dateTime?: number;
  cc?: string[];
  bcc?: string[];
  isDraft: boolean;
}
