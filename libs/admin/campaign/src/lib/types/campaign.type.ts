import { IList } from 'libs/admin/listing/src/lib/data-models/listing.model';

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

export type CampaignType = 'whatsapp' | 'email';

const CampaignState = {
  DOES_NOT_REPEAT: 'DOES_NOT_REPEAT',
  DAILY: 'DAILY',
  WEEKLY: 'WEEKLY',
  TRIGGERED: 'TRIGGERED',
} as const;

export type CampaignState = typeof CampaignState[keyof typeof CampaignState];

const TemplateType = {
  SAVED: 'SAVEDTEMPLATE',
  PREDESIGNED: 'PREDESIGNTEMPLATE',
} as const;

export type TemplateType = typeof TemplateType[keyof typeof TemplateType];

// export type ConstType<T extends Record<string, unknown>> = T[keyof T];

export type CampaignForm = {
  campaignName: string;
  topic: string;
  to: string[];
  event: string;
  startDate: number;
  triggers: string;
  endDate: number;
  campaignState: CampaignState;
  template: TemplateType;
  message: string;
  templateTopic: string;
  cc?: string;
  bcc?: string;
};

export type RecipientType = 'LISTING' | 'SUBSCRIBER';

export type ListType<T extends RecipientType> = T extends 'LISTING'
  ? IList
  : { name: string; id: string };
