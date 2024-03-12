export type QueryConfig = {
  queryObj: string;
};

export type SendersData = Record<'subscribers' | 'listing' | 'individual', string[]>;

export type ReceiverFields = 'to' | 'cc' | 'bcc';

export type MessageObj = {
  key: string;
  message: string;
};

export type CampaignType = 'whatsapp' | 'email';

export enum CampaignState {
  DOES_NOT_REPEAT = 'DOES_NOT_REPEAT',
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  TRIGGERED = 'TRIGGERED'
}

export type CampaignForm = {
  campaignName: string;
  topic: string;
  recipient: string;
  event: string;
  startDate: number;
  triggers: string;
  endDate: number;
  campaignState: CampaignState;
};
